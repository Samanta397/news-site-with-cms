import { PrismaNew } from '~/types/new.types';

export const prepareSelectItems = (tags: PrismaNew[]) => {
  return tags.map((tag) => ({
    id: tag.id.toString(),
    value: tag.title,
  }));
};
