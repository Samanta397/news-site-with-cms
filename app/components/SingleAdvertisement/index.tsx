import { emptyImage } from '~/assets';
import { format } from 'date-fns/format';
import React from 'react';
import { PrismaAdvertisementWithEntities } from '~/types/ads.types';
import { Jsonify } from '@remix-run/server-runtime/dist/jsonify';

type SingleAdvertisementType = {
  item: Jsonify<PrismaAdvertisementWithEntities & { mediaFile: string }>;
};

export function SingleAdvertisement({ item }: SingleAdvertisementType) {
  return (
    <div className={'flex p-4 '}>
      <img
        src={item.media ? item.mediaFile : emptyImage}
        alt="sdfsdf"
        className={
          'min-w-52 max-w-52 h-32 object-cover md:min-w-96 md:max-w-96 md:h-48 md:object-cover'
        }
      />
      <div className={'ml-3'}>
        <h2 className={'font-bold text-xl  md:text-2xl '}>{item.title}</h2>
        <p className={'text-sm text-slate-500 my-2 sm:text-base'}>
          {item.pubDate ? format(new Date(item.pubDate), 'LLL L, yyyy') : ''}
        </p>
        <p className={'max-md:hidden'}>{item.content}</p>
      </div>
    </div>
  );
}
