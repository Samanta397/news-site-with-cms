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

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get('page')) || 1;
  const sortBy = url.searchParams.get('sortBy') || 'desc';
  const searchQuery = url.searchParams.get('query') || '';

  const { news, paginationInfo } = await getNews(page);

  return json({ news: prepareNews(news || []), paginationInfo });
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

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const fields = Object.fromEntries(formData.entries());

  // if ('actionType' in fields && fields.actionType === 'delete') {
  //   await deleteUser(Number(fields.id));
  //
  //   return redirect('/dashboard/users');
  // } else {
  //   const result = RegisterFields.safeParse(fields);
  //   if (!result.success) {
  //     return json({
  //       fields,
  //       errors: result.error.flatten(),
  //     });
  //   }
  //
  //   await updateUser(fields);
  // }

  return null;
};

export default function News() {
  const { news, paginationInfo } = useLoaderData<typeof loader>();
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
        <Button label={'Create new'} onClick={() => navigate('create')} />
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
          onNext: () =>
            navigate(`/dashboard/news?page=${paginationInfo.page + 1}`),
          onPrevious: () =>
            navigate(`/dashboard/news?page=${paginationInfo.page - 1}`),
        }}
      />
    </div>
  );
}
