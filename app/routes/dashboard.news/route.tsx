import { Table } from '~/components/Table';
import { Button } from '~/components/Button';
import { useLoaderData, useNavigate } from '@remix-run/react';
import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/node';
import { getNews } from '~/api/news.server';
import { prepareNews } from '~/utils/prepareNews';
import { getUserSession } from '~/api/auth.server';
import { getUser } from '~/api/user.server';
import { capitalize } from '~/utils/capitalize';
import { Role } from '~/types/user.types';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getUserSession(request);
  const sessionUser = await getUser(Number(session.get('userId')));
  const isAdmin = sessionUser
    ? capitalize(sessionUser.role) === Role.ADMIN
    : false;

  const url = new URL(request.url);
  const page = Number(url.searchParams.get('page')) || 1;

  const { news, paginationInfo } = await getNews({ page });

  return json({ news: prepareNews(news || []), paginationInfo, isAdmin });
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `News page | News CMS` },
    {
      property: 'og:title',
      content: 'News CMS',
    },
    {
      name: 'description',
      content: 'News page',
    },
    {
      name: 'robots',
      content: `Page ${data?.paginationInfo.page}`,
    },
  ];
};

export const action = async () => {
  // const formData = await request.formData();
  // const fields = Object.fromEntries(formData.entries());

  return null;
};

export default function News() {
  const { news, paginationInfo, isAdmin } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const headings = [
    { title: 'Title' },
    { title: 'Author' },
    { title: 'Status' }, //Draft/Published
    { title: 'Date' },
  ];

  return (
    <div className="flex gap-6 flex-col ">
      <div className={'flex justify-end'}>
        <Button
          label={'Create new'}
          onClick={() => navigate('create')}
          aria-label="Create news"
          disabled={!isAdmin}
        />
      </div>

      <Table
        headings={headings}
        rows={news}
        onClick={(to: string) => navigate(to)}
        entityName={'News'}
        emptyMessage={'No news yet'}
        pagination={{
          hasNext: paginationInfo.hasNextPage,
          hasPrevious: paginationInfo.hasPreviousPage,
          onNext: () => {
            console.log(`/dashboard/news?page=${paginationInfo.page + 1}`);
            navigate(`/dashboard/news?page=${paginationInfo.page + 1}`);
          },
          onPrevious: () =>
            navigate(`/dashboard/news?page=${paginationInfo.page - 1}`),
        }}
        aria-label="News table"
        disabled={!isAdmin}
      />
    </div>
  );
}
