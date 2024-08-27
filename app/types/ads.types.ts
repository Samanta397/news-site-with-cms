import { Prisma } from '@prisma/client';

export type PrismaAdvertisement =
  Prisma.AdvertisementGetPayload<Prisma.AdvertisementDefaultArgs>;

export type PrismaAdvertisementWithEntities = Prisma.AdvertisementGetPayload<{
  include: { media: true; new: true };
}> & { mediaFile: string };

export type PrismaAdvertisementWhereInput = Prisma.AdvertisementWhereInput;
