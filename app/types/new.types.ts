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
  tags?: string[];
};

export type PrismaNew = Prisma.NewsGetPayload<Prisma.NewsDefaultArgs>;
export type PrismaNewWithEntities = Prisma.NewsGetPayload<{
  include: {
    media: true;
    tags: { include: { tag: true } };
    ads: { include: { media: true } };
  };
}> & { mediaFile: string };

export type PrismaNewsWhereInput = Prisma.NewsWhereInput;
