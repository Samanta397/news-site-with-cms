import { Prisma } from '@prisma/client';

export type RssType = {
  id: string;
  url: string;
  name: string;
  has_title?: boolean;
  has_content?: boolean;
  has_author?: boolean;
  has_pub_date?: boolean;
  is_active?: boolean;
  import_interval: number;
  last_import_time?: Date;
  next_import_time?: Date;
  tags?: string[];
};

export type PrismaSource =
  Prisma.NewsSourceGetPayload<Prisma.NewsSourceDefaultArgs>;

export type SettingsCreate = Prisma.SettingsCreateInput;
