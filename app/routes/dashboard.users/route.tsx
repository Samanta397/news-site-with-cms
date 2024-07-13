import { json, useLoaderData, useNavigate } from '@remix-run/react';
import { Table } from '~/components/Table';
import { LoaderFunctionArgs } from '@remix-run/node';
import { getUsers } from '~/api/user.server';
import { prepareUsers } from '~/utils/prepareUsers';

export async function loader({ request }: LoaderFunctionArgs) {
  const users = await getUsers();

  return json({
    users: prepareUsers(users || []),
  });
}

export default function Users() {
  const navigate = useNavigate();
  const { users } = useLoaderData<typeof loader>();

  const headings = [{ title: 'Name' }, { title: 'Role' }];

  return (
    <>
      {/*<div>Users page</div>*/}
      {/*<button onClick={() => navigate('/dashboard/users/1')}>*/}
      {/*  Go to user 1*/}
      {/*</button>*/}
      <Table
        headings={headings}
        rows={users}
        onClick={(to: string) => navigate(to)}
        entityName={'Users'}
        emptyMessage={'No users yet'}
      />
    </>
  );
}
