import { Prisma } from '@prisma/client';

export type NewType = {
  id: string;
  title: string;
  content?: string | null;
  author?: string | null;
  is_graft?: boolean;
  is_hidden?: boolean;
  media_id?: number | null;
  pubDate?: Date | null;
  link?: string | null;
  source_guid?: string | null;
};

export type PrismaNew = Prisma.NewsGetPayload<Prisma.NewsDefaultArgs>;
