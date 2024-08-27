import { json, useLoaderData, useNavigate } from '@remix-run/react';
import { Table } from '~/components/Table';
import { LoaderFunctionArgs } from '@remix-run/node';
import { getUsers } from '~/api/user.server';
import { prepareUsers } from '~/utils/prepareUsers';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get('page')) || 1;

  const { users, paginationInfo } = await getUsers(page);

  return json({
    users: prepareUsers(users || []),
    paginationInfo,
  });
}

export default function Users() {
  const navigate = useNavigate();
  const { users, paginationInfo } = useLoaderData<typeof loader>();

  const headings = [{ title: 'Name' }, { title: 'Role' }];

  return (
    <>
      <Table
        headings={headings}
        rows={users}
        onClick={(to: string) => navigate(to)}
        entityName={'Users'}
        emptyMessage={'No users yet'}
        pagination={{
          hasNext: paginationInfo.hasNextPage,
          hasPrevious: paginationInfo.hasPreviousPage,
          onNext: () =>
            navigate(`/dashboard/users?page=${paginationInfo.page + 1}`),
          onPrevious: () =>
            navigate(`/dashboard/users?page=${paginationInfo.page - 1}`),
        }}
      />
    </>
  );
}
