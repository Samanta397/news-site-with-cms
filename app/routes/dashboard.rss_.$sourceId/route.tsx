import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/node';
import { getUserSession } from '~/api/auth.server';
import { getUser } from '~/api/user.server';
import { capitalize } from '~/utils/capitalize';
import { Role } from '~/types/user.types';
import {
  Form,
  json,
  redirect,
  useActionData,
  useLoaderData,
  useSubmit,
} from '@remix-run/react';
import { Card } from '~/components/Card';
import { FormField } from '~/components/FormField';
import { Checkbox } from '~/components/Checkbox';
import { Button } from '~/components/Button';
import { useEffect, useState } from 'react';
import {
  createNewsSource,
  deleteNewsSource,
  getNewsSource,
  updateNewsSource,
} from '~/api/rss.server';
import { formatDate } from '~/utils/formatDate';
import { SourceFields, SourceFieldsErrors } from '~/utils/validation/schema';
import { Breadcrumbs } from '~/components/Breadcrumbs';
import { Select, SelectItemType } from '~/components/Select';
import { getTags } from '~/api/tags.server';
import { prepareTags } from '~/utils/prepareTags';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const session = await getUserSession(request);

  const { sourceId } = params;
  const url = new URL(request.url);
  const searchQuery = url.searchParams.get('query') || '';
  const page = Number(url.searchParams.get('page')) || 1;

  if (!sourceId) {
    return;
  }

  const sessionUser = await getUser(Number(session.get('userId')));
  const isAdmin = sessionUser
    ? capitalize(sessionUser.role) === Role.ADMIN
    : false;

  const { tags, paginationInfo } = await getTags(page, searchQuery);

  if (sourceId === 'create') {
    return json({
      sourceId,
      source: null,
      isAdmin,
      tags: prepareTags(tags || []),
      tagsPaginationInfo: paginationInfo,
    });
  } else {
    const source = await getNewsSource(Number(sourceId));

    return json({
      sourceId,
      source,
      isAdmin,
      tags: prepareTags(tags || []),
      tagsPaginationInfo: paginationInfo,
    });
  }
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `Single rss page | News CMS` },
    {
      property: 'og:title',
      content: 'News CMS',
    },
    {
      name: 'description',
      content: `${data?.sourceId === 'create' ? 'Create rss page' : `RSS id ${data?.sourceId}`}`,
    },
  ];
};

type ActionData = {
  fields: SourceFields;
  errors?: SourceFieldsErrors & {
    error: string;
    status: number;
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const fields = Object.fromEntries(formData.entries()) as SourceFields;
  const result = SourceFields.safeParse(fields);

  if ('actionType' in fields && fields.actionType === 'delete') {
    await deleteNewsSource(Number(fields.id));
    return redirect('/dashboard/rss');
  }

  if (!result.success) {
    return json({
      fields,
      errors: result.error.flatten(),
    });
  }

  const data = {
    id: fields.id,
    url: fields.url,
    name: fields.name,
    has_title: !!fields.has_title,
    has_content: !!fields.has_content,
    has_author: !!fields.has_author,
    has_pub_date: !!fields.has_pub_date,
    is_active: !fields.is_active,
    import_interval: Number(fields.import_interval),
    // next_import_time: !fields.is_active
    tags: fields.tags.split(','),
  };

  if (fields.id === 'create') {
    const { id, ...createData } = data;
    const createdSource = await createNewsSource(createData);
    if (createdSource) {
      return redirect(`/dashboard/rss/${createdSource.id}`);
    }
  } else {
    const { id, ...updateData } = data;
    const updatedSource = await updateNewsSource(Number(id), updateData);
    if (updatedSource) {
      return redirect(`/dashboard/rss/${updatedSource.id}`);
    }
  }

  return null;
};

export default function Source() {
  const { sourceId, isAdmin, source, tags, tagsPaginationInfo } =
    useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>() as ActionData;
  const submit = useSubmit();

  const [url, setUrl] = useState<string>(source?.url || '');
  const [name, setName] = useState<string>(source?.name || '');
  const [hasTitle, setHasTitle] = useState<boolean>(source?.has_title || false);
  const [hasContent, setHasContent] = useState<boolean>(
    source?.has_content || false,
  );
  const [hasAuthor, setHasAuthor] = useState<boolean>(
    source?.has_author || false,
  );
  const [hasPubDate, setHasPubDate] = useState<boolean>(
    source?.has_pub_date || false,
  );
  const [interval, setInterval] = useState<number>(
    source?.import_interval || 5,
  );
  const [pause, setPause] = useState<boolean>(!source?.is_active || false);

  const [selectedTags, setSelectedTags] = useState<
    SelectItemType | SelectItemType[]
  >([]);

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

  useEffect(() => {
    if (source?.tags.length) {
      setSelectedTags(
        source.tags.map((item) => ({
          id: item.tag.id.toString(),
          value: item.tag.tagName,
        })),
      );
    }
  }, [source]);

  return (
    <div className={'flex flex-col gap-10'}>
      <Breadcrumbs
        aria-label="Breadcrumbs"
        breadcrumbs={[
          { href: '/dashboard/rss', label: 'Rss' },
          {
            href: `/dashboard/rss/${sourceId}`,
            label: `${source ? source.name : 'create'}`,
          },
        ]}
      />
      {source && (
        <div className={'flex items-end flex-col'}>
          {source.last_import_time && (
            <p>
              {`Last import time: ${formatDate(new Date(source.last_import_time))}`}{' '}
            </p>
          )}
          {source.next_import_time && (
            <p>{`Next import time:${formatDate(new Date(source.next_import_time))}`}</p>
          )}
        </div>
      )}
      <Form
        className="space-y-4"
        method="post"
        encType="multipart/form-data"
        role="rss_form"
      >
        <div className={'flex gap-10 flex-wrap lg:flex-nowrap'}>
          <Card width={'w-3/4'} gap>
            <FormField
              name="id"
              htmlFor="id"
              label="Id"
              value={sourceId}
              required
              hidden
              aria-label="Id input"
            />

            <FormField
              name="name"
              htmlFor="name"
              label="Name"
              value={name}
              required
              onChange={setName}
              aria-label="Name input"
              errorMessage={actionData?.errors?.fieldErrors?.name}
            />

            <FormField
              name="url"
              htmlFor="url"
              label="Source url"
              value={url}
              required
              onChange={setUrl}
              aria-label="Source url input"
              errorMessage={actionData?.errors?.fieldErrors?.url}
            />

            <FormField
              name="import_interval"
              htmlFor="import_interval"
              label="Import interval (in minutes)"
              value={interval}
              type={'number'}
              required
              onChange={setInterval}
              aria-label="Import interval input"
              errorMessage={actionData?.errors?.fieldErrors?.import_interval}
            />
          </Card>

          <Card width={'w-1/4'} gap>
            <Checkbox
              name={'has_title'}
              htmlFor={'has_title'}
              label={'Should has title?'}
              checked={hasTitle}
              onChange={() => setHasTitle((prevState) => !prevState)}
              aria-label="Has title checkbox"
            />

            <Checkbox
              name={'has_content'}
              htmlFor={'has_content'}
              label={'Should has content?'}
              checked={hasContent}
              onChange={() => setHasContent((prevState) => !prevState)}
              aria-label="Has content checkbox"
            />

            <Checkbox
              name={'has_author'}
              htmlFor={'has_author'}
              label={'Should has author name?'}
              checked={hasAuthor}
              onChange={() => setHasAuthor((prevState) => !prevState)}
              aria-label="Has author checkbox"
            />

            <Checkbox
              name={'has_pub_date'}
              htmlFor={'has_pub_date'}
              label={'Should has publication date?'}
              checked={hasPubDate}
              onChange={() => setHasPubDate((prevState) => !prevState)}
              aria-label="Has publication date checkbox"
            />

            <Checkbox
              name={'is_active'}
              htmlFor={'is_active'}
              label={'Pause mode'}
              checked={pause}
              onChange={() => setPause((prevState) => !prevState)}
              aria-label="Pause mode checkbox"
            />

            <Select
              label={'Tags'}
              name={'tags'}
              options={tags}
              value={selectedTags}
              onSelect={setSelectedTags}
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
          </Card>
        </div>
        <div className={'flex justify-between'}>
          <Button
            label={'Delete'}
            onClick={() => handleDelete(sourceId)}
            tone={'critical'}
            disabled={!source || !isAdmin}
            aria-label="Delete source"
          />
          <Button
            type={'submit'}
            label={'Save'}
            aria-label="Save source changes"
            disabled={!isAdmin}
          />
        </div>
      </Form>
    </div>
  );
}
