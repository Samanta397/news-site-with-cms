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
import { DropZone } from '~/components/DropZone';
import { getObject, uploadImage } from '~/api/minio.server';
import * as process from 'node:process';
import { saveMedia } from '~/api/media.server';

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
    const media = await getObject(
      process.env.MINIO_BUCKET_NAME || '',
      news?.media?.file_name || '',
    );

    return json({
      newsId,
      news,
      tags: prepareTags(tags || []),
      isAdmin,
      media,
    });
  }
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const fields = Object.fromEntries(formData.entries()) as NewsFields;
  const result = NewsFields.safeParse(fields);

  if ('actionType' in fields && fields.actionType === 'delete') {
    await softDeleteNew(Number(fields.id));
  }

  if ('actionType' in fields && fields.actionType === 'restore') {
    await restoreNew(Number(fields.id));
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
    id: Number(fields.id),
    content: fields.content,
    title: fields.title,
    author: fields.author,
    is_graft: !fields.is_publish,
    is_hidden: !!fields.is_hidden,
    media_id: createdImage?.id || null,
  };

  if (fields.id === 'create') {
    const createdNew = await createNew(data);
    if (createdNew) {
      return redirect(`/dashboard/news/${createdNew.id}`);
    }
  } else {
    const updatedNew = await updateNew(data.id, data);
    if (updatedNew) {
      return redirect(`/dashboard/news/${updatedNew.id}`);
    }
  }

  return null;
};

export default function New() {
  const { newsId, news, tags, isAdmin, media } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>() as ActionData;
  const submit = useSubmit();

  const [title, setTitle] = useState<string>(news?.title || '');
  const [content, setContent] = useState<string>(news?.content || '');
  const [author, setAuthor] = useState<string>(news?.author || '');
  const [isPublish, setIsPublish] = useState<boolean>(false);
  const [isHidden, setIsHidden] = useState<boolean>(false);
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
      <Form className="space-y-4" method="post" encType="multipart/form-data">
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

            <DropZone
              name={'image'}
              label={'Image'}
              htmlFor={'image'}
              file={media}
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
