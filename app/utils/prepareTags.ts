import { PrismaTag } from '~/types/tag.types';

export const prepareTags = (tags: PrismaTag[]) => {
  return tags.map((tag) => tag.tagName);
};
