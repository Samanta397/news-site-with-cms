import { Button } from '~/components/Button';
import { Table } from '~/components/Table';
import { json, LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';
import { getAds } from '~/api/ads.server';
import { prepareAds } from '~/utils/prepareAds';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get('page')) || 1;
  const sortBy = url.searchParams.get('sortBy') || 'desc';
  const searchQuery = url.searchParams.get('query') || '';

  const { advertisements, paginationInfo } = await getAds(page);

  return json({
    advertisements: prepareAds(advertisements || []),
    paginationInfo,
  });
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `Advertisements page | News CMS` },
    {
      property: 'og:title',
      content: 'News CMS',
    },
    {
      name: 'description',
      content: 'Advertisements page',
    },
    {
      name: 'robots',
      content: `Page ${data?.paginationInfo.page}`,
    },
  ];
};

export default function Ads() {
  const { advertisements, paginationInfo } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const headings = [
    { title: 'Title' },
    { title: 'Status' }, //Draft/Published
    { title: 'Date' },
  ];

  return (
    <div className="flex gap-6 flex-col ">
      <div className={'flex justify-end gap-2'}>
        <Button
          label={'Display settings'}
          onClick={() => navigate('/dashboard/settings')}
        />
        <Button label={'Create'} onClick={() => navigate('create')} />
      </div>

      <Table
        headings={headings}
        rows={advertisements}
        onClick={(to: string) => navigate(to)}
        entityName={'Advertisements'}
        emptyMessage={'No advertisements yet'}
        pagination={{
          hasNext: paginationInfo.hasNextPage,
          hasPrevious: paginationInfo.hasPreviousPage,
          onNext: () =>
            navigate(`/dashboard/ads?page=${paginationInfo.page + 1}`),
          onPrevious: () =>
            navigate(`/dashboard/ads?page=${paginationInfo.page - 1}`),
        }}
      />
    </div>
  );
}
