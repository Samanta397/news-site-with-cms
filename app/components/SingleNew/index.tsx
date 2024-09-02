import React from 'react';

import { format } from 'date-fns/format';
import { emptyImage } from '~/assets';
import { Jsonify } from '@remix-run/server-runtime/dist/jsonify';
import { PrismaNewWithEntities } from '~/types/new.types';
import { Link } from '@remix-run/react';

type SingleNewType = {
  item: Jsonify<PrismaNewWithEntities>;
};

export function SingleNew({ item }: SingleNewType) {
  console.log(item);
  return (
    <div className={'flex p-4 '} aria-label={`Single new: ${item.title}`}>
      <img
        src={item.media ? item.mediaFile : emptyImage}
        alt="News images"
        className={'w-52 h-32 object-cover md:min-w-96 md:h-48 md:object-cover'}
      />
      <div
        className={'flex flex-col justify-between  ml-3 align w-1/2 md:w-2/3'}
      >
        <div>
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

        <div>
          {item.tags.map((tag) => (
            <Link
              to={`/filter?tags=${tag.tag.tagName}`}
              className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 mr-2"
            >
              <span>{tag.tag.tagName}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
