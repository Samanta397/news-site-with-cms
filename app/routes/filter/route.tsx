import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/node';
import { SiteLayout } from '~/components/SiteLayout';
import { getUserSession } from '~/api/auth.server';
import { redirect, useLoaderData } from '@remix-run/react';
import { getNews } from '~/api/news.server';
import React from 'react';
import { Pagination } from '~/components/Pagination';
import { NewsList } from '~/components/NewsList';
import { getObject } from '~/api/minio.server';
import process from 'node:process';
import { getSettings } from '~/api/settings.server';
import { PrismaNewWithEntities } from '~/types/new.types';
import { Jsonify } from '@remix-run/server-runtime/dist/jsonify';

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getUserSession(request);

  const url = new URL(request.url);
  const page = Number(url.searchParams.get('page')) || 1;
  const tag = url.searchParams.get('tags') || '';

  const { news, paginationInfo } = await getNews({
    page,
    onlyPublished: true,
    inNotHidden: true,
    tag,
  });

  const newsWithMedia = await Promise.all(
    news.map(async (item) => {
      let mediaFile = null;

      if (item.media) {
        mediaFile = await getObject(
          process.env.MINIO_BUCKET_NAME || '',
          item.media?.file_name || '',
        );
      }

      // if (item.ads?.length > 0) {
      //   for (const ad of item.ads) {
      //     if (ad.media) {
      //       const adsMediaFile = await getObject(
      //         process.env.MINIO_BUCKET_NAME || '',
      //         ad.media?.file_name || '',
      //       );
      //       newsAdsWithMedia.push({ ...ad, mediaFile: adsMediaFile });
      //     } else {
      //       newsAdsWithMedia.push(ad);
      //     }
      //   }
      // }

      return {
        ...item,
        mediaFile,
      };
    }),
  );

  const settings = await getSettings();

  // const { advertisements } = await getAds(
  //   page,
  //   settings?.amount_per_page || 0,
  //   true,
  //   true,
  // );
  //
  // const adsWithMedia = await Promise.all(
  //   advertisements.map(async (item) => {
  //     if (!item.media) {
  //       return item;
  //     }
  //     const media = await getObject(
  //       process.env.MINIO_BUCKET_NAME || '',
  //       item.media?.file_name || '',
  //     );
  //
  //     return {
  //       ...item,
  //       mediaFile: media,
  //     };
  //   }),
  // );

  return {
    news: newsWithMedia,
    paginationInfo,
    // adsPerPage: settings?.amount_per_page || 0,
    // ads: adsWithMedia,
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
      content: 'News site main page',
    },
    {
      name: 'robots',
      content: `Page ${data?.paginationInfo.page}`,
    },
  ];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const session = await getUserSession(request);
  const formData = await request.formData();
  const fields = Object.fromEntries(formData.entries());

  if (fields && 'search' in fields) {
    return redirect(`/search?query=${fields.search}`);
  }

  return null;
};

export default function FilterPage() {
  const { news, paginationInfo } = useLoaderData<typeof loader>();
  return (
    <SiteLayout>
      {news.length > 0 && (
        <>
          <NewsList
            list={news as Jsonify<PrismaNewWithEntities>[]}
            // ads={ads as Jsonify<PrismaAdvertisementWithEntities>[]}
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
