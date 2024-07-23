import { Prisma } from '@prisma/client';

export type NewType = {
  id: string;
  title: string;
  content: string;
  author?: string;
  is_graft?: boolean;
  is_hidden?: boolean;
};

export type PrismaNew = Prisma.NewsGetPayload<Prisma.NewsDefaultArgs>;
