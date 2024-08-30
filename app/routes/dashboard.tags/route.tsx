import { Button } from '~/components/Button';
import { Table } from '~/components/Table';
import React, { useEffect, useState } from 'react';
import { Modal } from '~/components/Modal';
import {
  Form,
  json,
  useActionData,
  useLoaderData,
  useNavigate,
  useSubmit,
} from '@remix-run/react';
import { FormField } from '~/components/FormField';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/node';
import { getUserSession } from '~/api/auth.server';
import { getUser } from '~/api/user.server';
import { capitalize } from '~/utils/capitalize';
import { Role } from '~/types/user.types';
import { createTag, deleteTags, getTags, updateTag } from '~/api/tags.server';
import { prepareTags } from '~/utils/prepareTags';
import { TagsFields, TagsFieldsErrors } from '~/utils/validation/schema';
import { ToastifyRoot } from '~/utils/toastifies';

type ActionData = {
  fields: TagsFields;
  errors?: TagsFieldsErrors & {
    error: string;
    status: number;
  };
  toast?: {
    message: string;
    type: 'success' | 'error';
  };
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const session = await getUserSession(request);

  const sessionUser = await getUser(Number(session.get('userId')));
  const isAdmin = sessionUser
    ? capitalize(sessionUser.role) === Role.ADMIN
    : false;

  const url = new URL(request.url);
  const page = Number(url.searchParams.get('page')) || 1;
  const { tags, paginationInfo } = await getTags(page);

  return json({ tags: prepareTags(tags || []), isAdmin, paginationInfo });
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `Tags page | News CMS` },
    {
      property: 'og:title',
      content: 'News CMS',
    },
    {
      name: 'description',
      content: 'Tags page',
    },
    {
      name: 'robots',
      content: `Page ${data?.paginationInfo.page}`,
    },
  ];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const fields = Object.fromEntries(formData.entries()) as TagsFields;
  const result = TagsFields.safeParse(fields);

  if (
    'actionType' in fields &&
    fields.actionType === 'delete' &&
    'ids' in fields
  ) {
    const ids = fields.ids as string;
    await deleteTags(ids.split(',').map((item) => Number(item)));
    return json({ toast: { message: 'Tags deleted', type: 'success' } });
  }

  if (!result.success) {
    return json({
      fields,
      errors: result.error.flatten(),
    });
  }

  if (fields.id === 'create') {
    const createdTag = await createTag(fields.tagName);
    if (createdTag) {
      return json({ toast: { message: 'Tag created', type: 'success' } });
    } else {
      return json({ toast: { message: 'Tag not created', type: 'error' } });
    }
  } else {
    const updatedTag = await updateTag({
      id: Number(fields.id),
      tagName: fields.tagName,
    });
    if (updatedTag) {
      return json({ toast: { message: 'Tag updated', type: 'success' } });
    } else {
      return json({ toast: { message: 'Tag not updated', type: 'error' } });
    }
  }

  return null;
};

export default function Tags() {
  const { tags, isAdmin, paginationInfo } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>() as ActionData;
  const submit = useSubmit();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [tagName, setTagName] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [editTag, setEditTag] = useState<string>('');

  const headings = [{ title: 'Tag name' }];

  const handleDelete = (ids: string[]) => {
    submit(
      {
        ids,
        actionType: 'delete',
      },
      {
        replace: true,
        method: 'POST',
      },
    );

    setSelectedTags([]);
  };

  useEffect(() => {
    if (actionData && actionData.toast) {
      // notify on a toast message
      ToastifyRoot.toast(actionData.toast.message, {
        type: actionData.toast.type,
      });
    }
    setIsOpen(false);
    setTagName('');
  }, [actionData]);

  return (
    <div className="flex gap-6 flex-col ">
      <div className={'flex justify-end'}>
        <Button
          label={'Create tags'}
          onClick={() => setIsOpen(true)}
          aria-label="Create tag"
          disabled={!isAdmin}
        />
      </div>

      <Table
        headings={headings}
        rows={tags}
        onClick={(to: string) => {
          setEditTag(to);
          setIsOpen(true);
        }}
        entityName={'Tags'}
        emptyMessage={'No tags yet'}
        selectable={true}
        selected={selectedTags}
        onSelect={setSelectedTags}
        bulkAction={{
          label: 'Delete',
          onAction: handleDelete,
        }}
        pagination={{
          hasNext: paginationInfo.hasNextPage,
          hasPrevious: paginationInfo.hasPreviousPage,
          onNext: () =>
            navigate(`/dashboard/tags?page=${paginationInfo.page + 1}`),
          onPrevious: () =>
            navigate(`/dashboard/tags?page=${paginationInfo.page - 1}`),
        }}
        aria-label="Tags table"
        disabled={!isAdmin}
      />

      <Modal isOpen={isOpen} onClose={setIsOpen} aria-label="Tags modal">
        <Form className="space-y-4" method="post" role={'tags_form'}>
          <FormField
            name="id"
            htmlFor="id"
            label="Id"
            value={editTag || 'create'}
            required
            hidden
            aria-label="Id input"
          />
          <FormField
            name="tagName"
            htmlFor="tagName"
            label="Tag name"
            value={
              tagName || tags.find((item) => item.id === editTag)?.value || ''
            }
            required
            onChange={setTagName}
            aria-label="Tag name input"
            errorMessage={actionData?.errors?.fieldErrors?.tagName}
          />

          <div className={'flex justify-end'}>
            <Button
              type={'submit'}
              label={'Save'}
              aria-label="Save tag changes"
              disabled={!isAdmin}
            />
          </div>
        </Form>
      </Modal>
    </div>
  );
}
