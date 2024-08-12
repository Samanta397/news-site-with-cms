import { format } from 'date-fns/format';
import { PrismaAdvertisement } from '~/types/ads.types';

export const prepareAds = (ads: PrismaAdvertisement[]) => {
  return ads.map((item) => ({
    id: item.id.toString(),
    title: item.title,
    status: item.pubDate ? 'Published' : 'Draft',
    date: format(new Date(item.updatedAt), 'dd.mm.yyyy'),
  }));
};
