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
import { getAds } from '~/api/ads.server';
import { PrismaNewWithEntities } from '~/types/new.types';
import { Jsonify } from '@remix-run/server-runtime/dist/jsonify';
import { PrismaAdvertisementWithEntities } from '~/types/ads.types';

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getUserSession(request);

  const url = new URL(request.url);
  const page = Number(url.searchParams.get('page')) || 1;

  const { news, paginationInfo } = await getNews(page, true, true);

  const newsWithMedia = await Promise.all(
    news.map(async (item) => {
      let mediaFile = null;
      let newsAdsWithMedia = [];

      if (item.media) {
        mediaFile = await getObject(
          process.env.MINIO_BUCKET_NAME || '',
          item.media?.file_name || '',
        );
      }

      if (item.ads.length > 0) {
        for (const ad of item.ads) {
          if (ad.media) {
            const adsMediaFile = await getObject(
              process.env.MINIO_BUCKET_NAME || '',
              ad.media?.file_name || '',
            );
            newsAdsWithMedia.push({ ...ad, mediaFile: adsMediaFile });
          } else {
            newsAdsWithMedia.push(ad);
          }
        }
      }

      return {
        ...item,
        mediaFile,
        ads: newsAdsWithMedia,
      };
    }),
  );

  const settings = await getSettings();

  const { advertisements } = await getAds(
    page,
    settings?.amount_per_page || 0,
    true,
    true,
  );

  const adsWithMedia = await Promise.all(
    advertisements.map(async (item) => {
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
    adsPerPage: settings?.amount_per_page || 0,
    ads: adsWithMedia,
  };
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const session = await getUserSession(request);
  const formData = await request.formData();
  const fields = Object.fromEntries(formData.entries());

  if (fields && 'search' in fields) {
    return redirect(`/search?query=${fields.search}`);
  }

  return null;
};

export default function Index() {
  const { news, paginationInfo, adsPerPage, ads } =
    useLoaderData<typeof loader>();
  return (
    <SiteLayout>
      {news.length > 0 && (
        <>
          <NewsList
            list={news as Jsonify<PrismaNewWithEntities>[]}
            ads={ads as Jsonify<PrismaAdvertisementWithEntities>[]}
          />

          <Pagination
            currentPage={paginationInfo.page}
            totalPages={paginationInfo.pages}
            hasNext={paginationInfo.hasNextPage}
            hasPrev={paginationInfo.hasPreviousPage}
            url={'/'}
          />
        </>
      )}

      {!news.length && (
        <p className={'text-center text-2xl font-bold'}>No news found</p>
      )}
    </SiteLayout>
  );
}
