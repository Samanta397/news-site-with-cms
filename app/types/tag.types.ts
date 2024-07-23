import { Prisma } from '@prisma/client';

export type Tag = {
  id: number;
  tagName: string;
};

export type PrismaTag = Prisma.TagGetPayload<Prisma.TagDefaultArgs>;
