import { PrismaSource } from '~/types/rss.types';

export const prepareSources = (sources: PrismaSource[]) => {
  return sources.map((source) => ({
    id: source.id.toString(),
    name: source.name,
    status: source.is_active ? 'Active' : 'Paused',
  }));
};
