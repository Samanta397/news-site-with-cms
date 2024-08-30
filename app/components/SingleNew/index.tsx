import React from 'react';

import { format } from 'date-fns/format';
import { emptyImage } from '~/assets';
import { Jsonify } from '@remix-run/server-runtime/dist/jsonify';
import { PrismaNewWithEntities } from '~/types/new.types';

type SingleNewType = {
  item: Jsonify<PrismaNewWithEntities>;
};

export function SingleNew({ item }: SingleNewType) {
  return (
    <div className={'flex p-4 '} aria-label={`Single new: ${item.title}`}>
      <img
        src={item.media ? item.mediaFile : emptyImage}
        alt="sdfsdf"
        className={
          'min-w-52 h-32 object-cover md:min-w-96 md:h-48 md:object-cover'
        }
      />
      <div className={'ml-3'}>
        {item.source_guid ? (
          <a
            href={item.source_guid}
            target="_blank"
            className={'font-bold text-xl  md:text-2xl hover:underline'}
          >
            {item.title}
          </a>
        ) : (
          <h2 className={'font-bold text-xl  md:text-2xl '}>{item.title}</h2>
        )}
        <p className={'text-sm text-slate-500 my-2 sm:text-base'}>
          {item.pubDate ? format(new Date(item.pubDate), 'LLL L, yyyy') : ''}
        </p>
        <p className={'max-md:hidden'}>{item.content}</p>
      </div>
    </div>
  );
}
