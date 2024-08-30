import { Card } from '~/components/Card';
import { Button } from '~/components/Button';
import { FormField } from '~/components/FormField';
import { useEffect, useState } from 'react';
import { Select, SelectItemType } from '~/components/Select';
import {
  Form,
  json,
  redirect,
  useActionData,
  useLoaderData,
  useSubmit,
} from '@remix-run/react';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/node';
import { getUserSession } from '~/api/auth.server';
import { AdsFields, AdsFieldsErrors } from '~/utils/validation/schema';
import { getNew, getNews } from '~/api/news.server';
import { getUser } from '~/api/user.server';
import { capitalize } from '~/utils/capitalize';
import { Role } from '~/types/user.types';
import { Checkbox } from '~/components/Checkbox';
import { DropZone } from '~/components/DropZone';
import { getObject, uploadImage } from '~/api/minio.server';
import * as process from 'node:process';
import { saveMedia } from '~/api/media.server';
import { createAd, deleteAd, getAd, updateAd } from '~/api/ads.server';
import { prepareSelectItems } from '~/utils/prepareSelectItems';
import { Breadcrumbs } from '~/components/Breadcrumbs';

type ActionData = {
  fields: AdsFields;
  errors?: AdsFieldsErrors & {
    error: string;
    status: number;
  };
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const session = await getUserSession(request);

  const { adId } = params;

  const url = new URL(request.url);
  const searchQuery = url.searchParams.get('query') || '';
  const page = Number(url.searchParams.get('page')) || 1;

  if (!adId) {
    return;
  }

  const sessionUser = await getUser(Number(session.get('userId')));
  const isAdmin = sessionUser
    ? capitalize(sessionUser.role) === Role.ADMIN
    : false;

  const { news, paginationInfo } = await getNews(
    page,
    false,
    false,
    searchQuery,
  );

  if (adId === 'create') {
    return json({
      adId,
      advertisement: null,
      news: prepareSelectItems(news || []),
      isAdmin,
      media: null,
      newsPaginationInfo: paginationInfo,
    });
  } else {
    const advertisement = await getAd(Number(adId));
    const media = await getObject(
      process.env.MINIO_BUCKET_NAME || '',
      advertisement?.media?.file_name || '',
    );

    return json({
      adId,
      advertisement: advertisement,
      news: prepareSelectItems(news || []),
      isAdmin,
      media,
      newsPaginationInfo: paginationInfo,
    });
  }
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `Single advertisement page | News CMS` },
    {
      property: 'og:title',
      content: 'News CMS',
    },
    {
      name: 'description',
      content: `${data?.adId === 'create' ? 'Create advertisement page' : `User id ${data?.adId}`}`,
    },
  ];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const fields = Object.fromEntries(formData.entries()) as AdsFields;
  const result = AdsFields.safeParse(fields);

  if ('actionType' in fields && fields.actionType === 'delete') {
    await deleteAd(Number(fields.id));
  }

  if (!result.success) {
    return json({
      fields,
      errors: result.error.flatten(),
    });
  }

  const imageName = await uploadImage(
    process.env.MINIO_BUCKET_NAME || 'default',
    fields.image,
  );

  const createdImage = await saveMedia(imageName);

  const existedNew = await getNew(Number(fields.new));

  const data = {
    id: fields.id,
    content: fields.content,
    title: fields.title,
    link: fields.link,
    is_draft: !fields.is_publish,
    is_list_page: !!fields.is_list_page,
    is_search_page: !!fields.is_search_page,
    is_main_page: !!fields.is_main_page,
    is_filter_page: !!fields.is_filter_page,
    priority: Number(fields.priority),
    regExp: fields.regExp,
    media_id:
      Number(fields.image_id) > 0
        ? Number(fields.image_id)
        : createdImage?.id
          ? createdImage?.id
          : null,
    new_id: existedNew?.id || null,
  };

  if (fields.id === 'create') {
    const { id, ...createData } = data;
    const createdNew = await createAd(createData);
    if (createdNew) {
      return redirect(`/dashboard/ads/${createdNew.id}`);
    }
  } else {
    const { id, ...updateData } = data;
    const updatedNew = await updateAd(Number(id), updateData);
    if (updatedNew) {
      return redirect(`/dashboard/ads/${updatedNew.id}`);
    }
  }

  return null;
};

export default function Ad() {
  const { adId, advertisement, isAdmin, media, news, newsPaginationInfo } =
    useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>() as ActionData;
  const submit = useSubmit();

  const [title, setTitle] = useState<string>(advertisement?.title || '');
  const [content, setContent] = useState<string>(advertisement?.content || '');
  const [link, setLink] = useState<string>(advertisement?.link || '');
  const [regExp, setRegExp] = useState<string>(advertisement?.regExp || '');
  const [isPublish, setIsPublish] = useState<boolean>(!advertisement?.pubDate);
  const [isOnListPage, setIsOnListPage] = useState<boolean>(
    advertisement?.is_list_page || false,
  );
  const [isOnSearchPage, setIsOnSearchPage] = useState<boolean>(
    advertisement?.is_search_page || false,
  );
  const [isOnMainPage, setIsOnMainPage] = useState<boolean>(
    advertisement?.is_main_page || false,
  );
  const [isOnFilterPage, setIsOnFilterPage] = useState<boolean>(
    advertisement?.is_filter_page || false,
  );
  const [priority, setPriority] = useState<number>(
    advertisement?.priority || 0,
  );
  const [selectedNews, setSelectedNews] = useState<
    SelectItemType | SelectItemType[]
  >([]);
  const [mediaId, setMediaId] = useState<string>(
    advertisement?.media?.id.toString() || '0',
  );
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (advertisement && advertisement.new_id && advertisement.new) {
      setSelectedNews({
        id: advertisement.new.id.toString(),
        value: advertisement.new.title,
      });
    }
  }, [advertisement]);

  const handleDelete = (id: string) => {
    submit(
      {
        id,
        actionType: 'delete',
      },
      {
        replace: true,
        method: 'POST',
      },
    );
  };

  return (
    <div className={'flex flex-col gap-10'}>
      <Breadcrumbs
        breadcrumbs={[
          { href: '/dashboard/ads', label: 'Ads' },
          {
            href: `/dashboard/ads/${adId}`,
            label: `${advertisement ? advertisement.title : 'create'}`,
          },
        ]}
        aria-label="Breadcrumbs"
      />
      <Form
        className="space-y-4"
        method="post"
        encType="multipart/form-data"
        role="advertisement_form"
      >
        <div className={'flex gap-10 flex-wrap lg:flex-nowrap'}>
          <Card width={'w-3/4'} gap>
            <FormField
              name="id"
              htmlFor="id"
              label="Id"
              value={adId}
              required
              hidden
              aria-label="Id input"
            />

            <FormField
              name="image_id"
              htmlFor="image_id"
              label="image_id"
              value={mediaId}
              // required
              hidden
              aria-label="Image id input"
            />

            <FormField
              name="title"
              htmlFor="title"
              label="Title"
              value={title}
              required
              onChange={setTitle}
              aria-label="Title input"
              errorMessage={actionData?.errors?.fieldErrors?.title}
            />
            <FormField
              name="content"
              htmlFor="content"
              label="Content"
              value={content}
              required
              onChange={setContent}
              aria-label="Content input"
              errorMessage={actionData?.errors?.fieldErrors?.content}
            />

            <FormField
              name="link"
              htmlFor="link"
              label="link"
              value={link}
              required
              onChange={setLink}
              aria-label="Link input"
              errorMessage={actionData?.errors?.fieldErrors?.link}
            />

            <DropZone
              name={'image'}
              label={'Image'}
              htmlFor={'image'}
              media={media}
              onChange={setMediaId}
              aria-label="Drop zone"
            />

            <Select
              label={'Select new'}
              name={'new'}
              options={news}
              value={selectedNews}
              onSelect={setSelectedNews}
              query={query}
              onSearch={setQuery}
              searchable={true}
              pagination={{
                hasNext: newsPaginationInfo.hasNextPage,
                hasPrevious: newsPaginationInfo.hasPreviousPage,
                onNext: () =>
                  submit({ page: newsPaginationInfo.page + 1, query }),
                onPrevious: () =>
                  submit({ page: newsPaginationInfo.page - 1, query }),
              }}
              aria-label="Select news"
            />
          </Card>

          <Card width={'w-1/4'} gap>
            <Checkbox
              name={'is_publish'}
              htmlFor={'is_publish'}
              label={'Publish'}
              checked={isPublish}
              onChange={() => setIsPublish((prevState) => !prevState)}
              aria-label="Is publish checkbox"
            />
            <Checkbox
              name={'is_list_page'}
              htmlFor={'is_list_page'}
              label={'Should be on list page?'}
              checked={isOnListPage}
              onChange={() => setIsOnListPage((prevState) => !prevState)}
              aria-label="Is list page checkbox"
            />
            <Checkbox
              name={'is_search_page'}
              htmlFor={'is_search_page'}
              label={'Should be on search page?'}
              checked={isOnSearchPage}
              onChange={() => setIsOnSearchPage((prevState) => !prevState)}
              aria-label="Is search page checkbox"
            />

            {isOnListPage && (
              <>
                <Checkbox
                  name={'is_main_page'}
                  htmlFor={'is_main_page'}
                  label={'Should be on main page?'}
                  checked={isOnMainPage}
                  onChange={() => setIsOnMainPage((prevState) => !prevState)}
                  aria-label="Is main page checkbox"
                />
                <Checkbox
                  name={'is_filter_page'}
                  htmlFor={'is_filter_page'}
                  label={'Should be on filter page?'}
                  checked={isOnFilterPage}
                  onChange={() => setIsOnFilterPage((prevState) => !prevState)}
                  aria-label="Is filter page checkbox"
                />
                <FormField
                  name="priority"
                  htmlFor="priority"
                  label="Priority of displaying (in %)"
                  value={priority}
                  type={'number'}
                  onChange={setPriority}
                  aria-label="Priority input"
                />
              </>
            )}

            {isOnSearchPage && (
              <FormField
                name="regExp"
                htmlFor="regExp"
                label="Regular expression for display in search page"
                value={regExp}
                onChange={setRegExp}
                aria-label="Regular expression input"
                errorMessage={actionData?.errors?.fieldErrors?.regExp}
              />
            )}
          </Card>
        </div>
        <div className={'flex justify-between'}>
          <Button
            label={'Delete'}
            onClick={() => handleDelete(adId)}
            tone={'success'}
            disabled={!advertisement || !isAdmin}
            aria-label="Delete advertisement"
          />
          <Button
            type={'submit'}
            label={`${isPublish ? 'Save and publish' : 'Save to draft'} `}
            aria-label="Save advertisement changes"
            disabled={!isAdmin}
          />
        </div>
      </Form>
    </div>
  );
}
