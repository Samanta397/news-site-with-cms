import React from 'react';
import { SingleNew } from '~/components/SingleNew';
import { SingleAdvertisement } from '~/components/SingleAdvertisement';
import { PrismaNewWithEntities } from '~/types/new.types';
import { Jsonify } from '@remix-run/server-runtime/dist/jsonify';
import { PrismaAdvertisementWithEntities } from '~/types/ads.types';

type NewsListType = {
  list: Jsonify<PrismaNewWithEntities>[];
  ads?: Jsonify<PrismaAdvertisementWithEntities>[];
};

export function NewsList({ list, ads }: NewsListType) {
  return (
    <div className={'flex p-4 flex-col'}>
      {list.map((item, idx) => (
        <React.Fragment key={`news-${idx}`}>
          <SingleNew item={item} />
          {item.ads.length > 0 && (
            <>
              <hr />
              {item.ads.map((ad: any, adIdx: number) => (
                <React.Fragment key={`ad-${adIdx}`}>
                  <SingleAdvertisement item={ad} />
                  <hr />
                </React.Fragment>
              ))}
            </>
          )}

          {ads && ads.length > 0 && ads[idx] && (
            <React.Fragment key={`ads-${ads[idx]}`}>
              <hr />
              <SingleAdvertisement item={ads[idx]} />
              <hr />
            </React.Fragment>
          )}

          <hr />
        </React.Fragment>
      ))}
    </div>
  );
}
