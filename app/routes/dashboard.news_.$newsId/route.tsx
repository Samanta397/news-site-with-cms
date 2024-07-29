import { Card } from '~/components/Card';
import { Button } from '~/components/Button';
import { FormField } from '~/components/FormField';
import { useState } from 'react';
import { Select } from '~/components/Select';
import {
  Form,
  json,
  redirect,
  useActionData,
  useLoaderData,
  useSubmit,
} from '@remix-run/react';
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
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
  if (!newsId) {
    //TODO: add logic when newsId not exists
    return;
  }

  const sessionUser = await getUser(Number(session.get('userId')));
  const isAdmin = sessionUser
    ? capitalize(sessionUser.role) === Role.ADMIN
    : false;

  const tags = await getTags();

  if (newsId === 'create') {
    return json({ newsId, news: null, tags: prepareTags(tags || []), isAdmin });
  } else {
    const news = await getNew(Number(newsId));
    return json({ newsId, news, tags: prepareTags(tags || []), isAdmin });
  }
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const fields = Object.fromEntries(formData.entries()) as NewsFields;
  const result = NewsFields.safeParse(fields);
  if ('actionType' in fields && fields.actionType === 'delete') {
    await softDeleteNew(Number(fields.id));
  }

  // if ('actionType' in fields && fields.actionType === 'publish') {
  //   await publishNew(Number(fields.id));
  // }

  if ('actionType' in fields && fields.actionType === 'restore') {
    await restoreNew(Number(fields.id));
  }

  if (!result.success) {
    return json({
      fields,
      errors: result.error.flatten(),
    });
  }

  const data = {
    ...fields,
    is_graft: !fields.is_publish,
    is_hidden: !!fields.is_hidden,
  };

  if (fields.id === 'create') {
    const createdNew = await createNew(data);
    if (createdNew) {
      return redirect(`/dashboard/news/${createdNew.id}`);
    }
  } else {
    const updatedNew = await updateNew(Number(data.id), data);
    if (updatedNew) {
      return redirect(`/dashboard/news/${updatedNew.id}`);
    }
  }

  return null;
};

export default function New() {
  const { newsId, news, tags, isAdmin } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>() as ActionData;
  const submit = useSubmit();

  const [title, setTitle] = useState<string>(news?.title || '');
  const [content, setContent] = useState<string>(news?.content || '');
  const [author, setAuthor] = useState<string>(news?.author || '');
  const [isPublish, setIsPublish] = useState<boolean>(false);
  const [isHidden, setIsHidden] = useState<boolean>(false);
  // const [isDraft, setIsDraft] = useState<boolean>(false);
  const [selectedTags, setSelectedTags] = useState<
    { id: string; value: string }[]
  >([]);

  //TODO: add errors to form fields and disable buttons if user is not Admin

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

  // const handlePublish = (id: string) => {
  //   submit(
  //     {
  //       id,
  //       actionType: 'publish',
  //     },
  //     {
  //       replace: true,
  //       method: 'POST',
  //     },
  //   );
  // };

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
      {/*{news && (*/}
      {/*  <div className={'flex justify-end'}>*/}
      {/*    <Button label={'Publish'} onClick={() => handlePublish(newsId)} />*/}
      {/*  </div>*/}
      {/*)}*/}

      <Form className="space-y-4" method="post">
        <div className={'flex gap-10'}>
          <Card width={'w-3/4'} gap>
            <FormField
              name="id"
              htmlFor="id"
              label="Id"
              value={newsId}
              required
              hidden
            />

            <FormField
              name="title"
              htmlFor="title"
              label="Title"
              value={title}
              required
              onChange={setTitle}
            />
            <FormField
              name="content"
              htmlFor="content"
              label="Content"
              value={content}
              required
              onChange={setContent}
            />
          </Card>

          <Card width={'w-1/4'} gap>
            <FormField
              name="author"
              htmlFor="author"
              label="Author"
              value={author}
              required
              onChange={setAuthor}
            />

            <Select
              label={'Tags'}
              name={'tag'}
              options={tags}
              value={selectedTags}
              onSelect={setSelectedTags}
              multiple={true}
            />

            <Checkbox
              name={'is_publish'}
              htmlFor={'is_publish'}
              label={'Publish'}
              checked={isPublish}
              onChange={() => setIsPublish((prevState) => !prevState)}
            />
            <Checkbox
              name={'is_hidden'}
              htmlFor={'is_hidden'}
              label={'Hidden mode'}
              checked={isHidden}
              onChange={() => setIsHidden((prevState) => !prevState)}
            />
            {/*<Checkbox*/}
            {/*  name={'is_graft'}*/}
            {/*  htmlFor={'is_graft'}*/}
            {/*  label={'Draft mode'}*/}
            {/*/>*/}
          </Card>
        </div>
        <div className={'flex justify-between'}>
          <Button
            label={news?.is_deleted ? 'Restore' : 'Move to trash'}
            onClick={() =>
              news?.is_deleted ? handleRestore(newsId) : handleDelete(newsId)
            }
            tone={news?.is_deleted ? 'success' : 'critical'}
            disabled={!news} //!isAdmin
          />
          <Button
            type={'submit'}
            label={`${isPublish ? 'Save and publish' : 'Save to draft'} `}
          />
        </div>
      </Form>
    </div>
  );
}
