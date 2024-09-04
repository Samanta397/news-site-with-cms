import { Card } from '~/components/Card';
import { Button } from '~/components/Button';
import { FormField } from '~/components/FormField';
import { useReducer, useState } from 'react';
import { Select } from '~/components/Select';
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
import { NewsFields, NewsFieldsErrors } from '~/utils/validation/schema';
import {
  createNew,
  getNew,
  restoreNew,
  softDeleteNew,
  updateNew,
} from '~/api/news.server';
import { getUser } from '~/api/user.server';
import { capitalize } from '~/utils/capitalize';
import { Role } from '~/types/user.types';
import { getTags } from '~/api/tags.server';
import { prepareTags } from '~/utils/prepareTags';
import { Checkbox } from '~/components/Checkbox';
import { DropZone } from '~/components/DropZone';
import { getObject, uploadImage } from '~/api/minio.server';
import * as process from 'node:process';
import { saveMedia } from '~/api/media.server';
import { Breadcrumbs } from '~/components/Breadcrumbs';
import { NewsActionKind, newsReducer } from '~/utils/reducers/news';

type ActionData = {
  fields: NewsFields;
  errors?: NewsFieldsErrors & {
    error: string;
    status: number;
  };
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const session = await getUserSession(request);

  const { newsId } = params;
  const url = new URL(request.url);
  const searchQuery = url.searchParams.get('query') || '';
  const page = Number(url.searchParams.get('page')) || 1;

  if (!newsId) {
    return;
  }

  const sessionUser = await getUser(Number(session.get('userId')));
  const isAdmin = sessionUser
    ? capitalize(sessionUser.role) === Role.ADMIN
    : false;

  const { tags, paginationInfo } = await getTags(page, searchQuery);

  if (newsId === 'create') {
    return json({
      newsId,
      news: null,
      tags: prepareTags(tags || []),
      isAdmin,
      media: null,
      tagsPaginationInfo: paginationInfo,
    });
  } else {
    const news = await getNew(Number(newsId));
    const media = await getObject(
      process.env.MINIO_BUCKET_NAME || '',
      news?.media?.file_name || '',
    );

    return json({
      newsId,
      news: news,
      tags: prepareTags(tags || []),
      isAdmin,
      media,
      tagsPaginationInfo: paginationInfo,
    });
  }
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `Single news page | News CMS` },
    {
      property: 'og:title',
      content: 'News CMS',
    },
    {
      name: 'description',
      content: `${data?.newsId === 'create' ? 'Create news page' : `User id ${data?.newsId}`}`,
    },
  ];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const fields = Object.fromEntries(formData.entries()) as NewsFields;
  const result = NewsFields.safeParse(fields);

  if ('actionType' in fields && fields.actionType === 'delete') {
    await softDeleteNew(Number(fields.id));
    return null;
  }

  if ('actionType' in fields && fields.actionType === 'restore') {
    await restoreNew(Number(fields.id));
    return null;
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
  const data = {
    id: fields.id,
    content: fields.content,
    title: fields.title,
    author: fields.author,
    is_graft: !fields.is_publish,
    is_hidden: !!fields.is_hidden,
    media_id:
      Number(fields.image_id) > 0
        ? Number(fields.image_id)
        : createdImage?.id
          ? createdImage?.id
          : null,
    tags: fields.tags ? fields.tags.split(',') : [],
  };

  if (fields.id === 'create') {
    const { id, ...createData } = data;

    const createdNew = await createNew(createData);
    if (createdNew) {
      return redirect(`/dashboard/news/${createdNew.id}`);
    }
  } else {
    const { id, ...updateData } = data;
    const updatedNew = await updateNew(Number(id), updateData);
    if (updatedNew) {
      return redirect(`/dashboard/news/${updatedNew.id}`);
    }
  }

  return null;
};

export default function New() {
  const { newsId, news, tags, isAdmin, media, tagsPaginationInfo } =
    useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>() as ActionData;
  const submit = useSubmit();

  const [newsState, dispatch] = useReducer(newsReducer, {
    title: news?.title || '',
    content: news?.content || '',
    author: news?.author || '',
    is_publish: !!news?.pubDate,
    is_hidden: news?.is_hidden || false,
    image_id: news?.media?.id.toString() || '0',
    tags:
      news?.tags.map((item) => ({
        id: item.tag.id.toString(),
        value: item.tag.tagName,
      })) || [],
  });

  const [query, setQuery] = useState('');

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

  const handleRestore = (id: string) => {
    submit(
      {
        id,
        actionType: 'restore',
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
        aria-label="Breadcrumbs"
        breadcrumbs={[
          { href: '/dashboard/news', label: 'News' },
          {
            href: `/dashboard/news/${newsId}`,
            label: `${news ? news.title : 'create'}`,
          },
        ]}
      />
      <Form
        className="space-y-4"
        method="post"
        encType="multipart/form-data"
        role="news_form"
      >
        <div className={'flex gap-10 flex-wrap lg:flex-nowrap'}>
          <Card width={'w-3/4'} gap>
            <FormField
              name="id"
              htmlFor="id"
              label="Id"
              value={newsId}
              required
              hidden
              aria-label="Id input"
            />

            <FormField
              name="image_id"
              htmlFor="image_id"
              label="image_id"
              value={newsState.image_id}
              // required
              hidden
              aria-label="Image id input"
            />

            <FormField
              name="title"
              htmlFor="title"
              label="Title"
              value={newsState.title}
              required
              onChange={(e) =>
                dispatch({ type: NewsActionKind.TITLE, payload: e })
              }
              aria-label="Title input"
              errorMessage={actionData?.errors?.fieldErrors?.title}
            />
            <FormField
              name="content"
              htmlFor="content"
              label="Content"
              value={newsState.content}
              onChange={(e) =>
                dispatch({ type: NewsActionKind.CONTENT, payload: e })
              }
              aria-label="Content input"
              errorMessage={actionData?.errors?.fieldErrors?.content}
            />

            <DropZone
              name={'image'}
              label={'Image'}
              htmlFor={'image'}
              media={media}
              onChange={(e) =>
                dispatch({ type: NewsActionKind.IMAGE_ID, payload: e })
              }
              aria-label="Drop zone"
            />
          </Card>

          <Card width={'w-1/4'} gap>
            <FormField
              name="author"
              htmlFor="author"
              label="Author"
              value={newsState.author}
              onChange={(e) =>
                dispatch({ type: NewsActionKind.AUTHOR, payload: e })
              }
              aria-label="Author input"
              errorMessage={actionData?.errors?.fieldErrors?.author}
            />

            <Select
              label={'Tags'}
              name={'tags'}
              options={tags}
              value={newsState.tags}
              onSelect={(e) =>
                dispatch({ type: NewsActionKind.TAGS, payload: e })
              }
              multiple={true}
              query={query}
              onSearch={setQuery}
              searchable={true}
              pagination={{
                hasNext: tagsPaginationInfo.hasNextPage,
                hasPrevious: tagsPaginationInfo.hasPreviousPage,
                onNext: () =>
                  submit({ page: tagsPaginationInfo.page + 1, query }),
                onPrevious: () =>
                  submit({ page: tagsPaginationInfo.page - 1, query }),
              }}
              aria-label="Tags selector"
            />

            <Checkbox
              name={'is_publish'}
              htmlFor={'is_publish'}
              label={'Publish'}
              checked={newsState.is_publish}
              onChange={() =>
                dispatch({
                  type: NewsActionKind.IS_PUBLISH,
                  payload: !newsState.is_publish,
                })
              }
              aria-label="Is publish checkbox"
            />
            <Checkbox
              name={'is_hidden'}
              htmlFor={'is_hidden'}
              label={'Hidden mode'}
              checked={newsState.is_hidden}
              onChange={() =>
                dispatch({
                  type: NewsActionKind.IS_HIDDEN,
                  payload: !newsState.is_hidden,
                })
              }
              aria-label="Is hidden checkbox"
            />
          </Card>
        </div>
        <div className={'flex justify-between'}>
          <Button
            label={news?.is_deleted ? 'Restore' : 'Move to trash'}
            onClick={() =>
              news?.is_deleted ? handleRestore(newsId) : handleDelete(newsId)
            }
            tone={news?.is_deleted ? 'success' : 'critical'}
            disabled={!news || !isAdmin}
            aria-label={
              news?.is_deleted ? 'Restore news' : 'Move news to trash'
            }
          />
          <Button
            type={'submit'}
            label={`${newsState.is_publish ? 'Save and publish' : 'Save to draft'} `}
            aria-label="Save news changes"
            disabled={!isAdmin}
          />
        </div>
      </Form>
    </div>
  );
}
