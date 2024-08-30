import { SiteLayout } from '~/components/SiteLayout';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/node';
import { getUserSession } from '~/api/auth.server';
import { NewsList } from '~/components/NewsList';
import { Pagination } from '~/components/Pagination';
import React from 'react';
import { useLoaderData } from '@remix-run/react';
import { getNews } from '~/api/news.server';
import { getObject } from '~/api/minio.server';
import process from 'node:process';
import { Jsonify } from '@remix-run/server-runtime/dist/jsonify';
import { PrismaNewWithEntities } from '~/types/new.types';

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getUserSession(request);

  const url = new URL(request.url);
  const page = Number(url.searchParams.get('page')) || 1;
  const query = url.searchParams.get('query') || '';

  const { news, paginationInfo } = await getNews(page, true, true, query);

  const newsWithMedia = await Promise.all(
    news.map(async (item) => {
      if (!item.media) {
        return item;
      }
      const media = await getObject(
        process.env.MINIO_BUCKET_NAME || '',
        item.media?.file_name || '',
      );

      return {
        ...item,
        mediaFile: media,
      };
    }),
  );

  return {
    news: newsWithMedia,
    paginationInfo,
  };
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `News site | News CMS` },
    {
      property: 'og:title',
      content: 'News site with CMS',
    },
    {
      name: 'description',
      content: `News site search page.`,
    },
    {
      name: 'robots',
      content: `Page ${data?.paginationInfo.page}`,
    },
  ];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const session = await getUserSession(request);

  return null;
};

export default function SearchPage() {
  const { news, paginationInfo } = useLoaderData<typeof loader>();

  return (
    <SiteLayout>
      {news.length > 0 && (
        <>
          <NewsList
            list={news as Jsonify<PrismaNewWithEntities>[]}
            aria-label="News list"
          />

          <Pagination
            currentPage={paginationInfo.page}
            totalPages={paginationInfo.pages}
            hasNext={paginationInfo.hasNextPage}
            hasPrev={paginationInfo.hasPreviousPage}
            url={'/'}
            aria-label="News list pagination"
          />
        </>
      )}

      {!news.length && (
        <p className={'text-center text-2xl font-bold'}>No news found</p>
      )}
    </SiteLayout>
  );
}
