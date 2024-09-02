import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/node';
import { getUserSession } from '~/api/auth.server';
import { getUser } from '~/api/user.server';
import { capitalize } from '~/utils/capitalize';
import { Role } from '~/types/user.types';
import { json, useLoaderData, useNavigate, useSubmit } from '@remix-run/react';
import { deleteNewsSources, getNewsSources } from '~/api/rss.server';
import { prepareSources } from '~/utils/prepareSources';
import { Button } from '~/components/Button';
import { Table } from '~/components/Table';
import React, { useState } from 'react';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const session = await getUserSession(request);

  const sessionUser = await getUser(Number(session.get('userId')));
  const isAdmin = sessionUser
    ? capitalize(sessionUser.role) === Role.ADMIN
    : false;

  const url = new URL(request.url);
  const page = Number(url.searchParams.get('page')) || 1;

  const { sources, paginationInfo } = await getNewsSources(page);

  return json({
    sources: prepareSources(sources || []),
    isAdmin,
    paginationInfo,
  });
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `RSS page | News CMS` },
    {
      property: 'og:title',
      content: 'News CMS',
    },
    {
      name: 'description',
      content: 'RSS page',
    },
    {
      name: 'robots',
      content: `Page ${data?.paginationInfo.page}`,
    },
  ];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const fields = Object.fromEntries(formData.entries());

  if (
    'actionType' in fields &&
    fields.actionType === 'delete' &&
    'ids' in fields
  ) {
    const ids = fields.ids as string;
    await deleteNewsSources(ids.split(',').map((item) => Number(item)));
    return json({ toast: { message: 'Sources deleted', type: 'success' } });
  }

  return null;
};

export default function Rss() {
  const { sources, isAdmin, paginationInfo } = useLoaderData<typeof loader>();
  const [selectedRss, setSelectedRss] = useState<string[]>([]);

  const navigate = useNavigate();
  const submit = useSubmit();

  const headings = [{ title: 'Name' }, { title: 'Status' }];

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

    setSelectedRss([]);
  };

  return (
    <div className="flex gap-6 flex-col ">
      <div className={'flex justify-end'}>
        <Button
          label={'Create source'}
          onClick={() => navigate('create')}
          aria-label="Create a new rss"
          disabled={!isAdmin}
        />
      </div>

      <Table
        headings={headings}
        rows={sources}
        onClick={(to: string) => navigate(to)}
        entityName={'Sources'}
        emptyMessage={'No sources yet'}
        selectable={false}
        selected={selectedRss}
        onSelect={setSelectedRss}
        bulkAction={{
          label: 'Delete',
          onAction: handleDelete,
        }}
        pagination={{
          hasNext: paginationInfo.hasNextPage,
          hasPrevious: paginationInfo.hasPreviousPage,
          onNext: () =>
            navigate(`/dashboard/rss?page=${paginationInfo.page + 1}`),
          onPrevious: () =>
            navigate(`/dashboard/rss?page=${paginationInfo.page - 1}`),
        }}
        aria-label="RSS table"
        disabled={!isAdmin}
      />
    </div>
  );
}
