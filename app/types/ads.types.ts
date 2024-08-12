import { Prisma } from '@prisma/client';

export type PrismaAdvertisement =
  Prisma.AdvertisementGetPayload<Prisma.AdvertisementDefaultArgs>;
