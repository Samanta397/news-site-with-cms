import { format } from 'date-fns/format';
import { PrismaNew } from '~/types/new.types';

export const prepareNews = (news: PrismaNew[]) => {
  return news.map((item) => ({
    id: item.id.toString(),
    title: item.title,
    author: item.author || '',
    status: item.is_deleted ? 'Deleted' : item.pubDate ? 'Published' : 'Draft',
    date: format(new Date(item.updatedAt), 'dd.mm.yyyy'),
  }));
};
