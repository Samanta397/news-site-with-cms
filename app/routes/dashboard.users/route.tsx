import { json, useLoaderData, useNavigate } from '@remix-run/react';
import { Table } from '~/components/Table';
import { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { getUser, getUsers } from '~/api/user.server';
import { prepareUsers } from '~/utils/prepareUsers';
import { getUserSession } from '~/api/auth.server';
import { capitalize } from '~/utils/capitalize';
import { Role } from '~/types/user.types';

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getUserSession(request);
  const sessionUser = await getUser(Number(session.get('userId')));
  const isAdmin = sessionUser
    ? capitalize(sessionUser.role) === Role.ADMIN
    : false;

  const url = new URL(request.url);
  const page = Number(url.searchParams.get('page')) || 1;

  const { users, paginationInfo } = await getUsers(page);

  return json({
    users: prepareUsers(users || []),
    paginationInfo,
    isAdmin,
  });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `Users page | News CMS` },
    {
      property: 'og:title',
      content: 'News CMS',
    },
    {
      name: 'description',
      content: 'Users page',
    },
    {
      name: 'robots',
      content: `Page ${data?.paginationInfo.page}`,
    },
  ];
};

export default function Users() {
  const navigate = useNavigate();
  const { users, paginationInfo, isAdmin } = useLoaderData<typeof loader>();

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
        aria-label="Users table"
        disabled={!isAdmin}
      />
    </>
  );
}
