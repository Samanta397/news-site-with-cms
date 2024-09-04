import { PrismaTag } from '~/types/tag.types';

export const prepareTags = (tags: PrismaTag[]) => {
  return tags.map((tag) => ({
    id: tag.id.toString(),
    value: tag.tagName,
  }));
};
