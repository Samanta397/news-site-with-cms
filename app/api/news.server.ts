import { prisma } from './prisma.server';
import { NewType, PrismaNewsWhereInput } from '~/types/new.types';

export async function createNew(data: Omit<NewType, 'id'>) {
  try {
    const tags = data.tags?.map((item) => ({
      tag: {
        connect: {
          id: Number(item),
        },
      },
    }));
    const news = await prisma.news.create({
      data: {
        ...data,
        pubDate: data.is_graft ? null : new Date(),
        tags: {
          create: tags,
        },
      },
    });
    return news;
  } catch (error) {
    console.log('CREATE NEW ERROR', error);
  }
}

export async function publishNew(id: number) {
  try {
    const news = await prisma.news.update({
      where: {
        id,
      },
      data: {
        pubDate: new Date(),
        is_graft: false,
      },
    });
    return news;
  } catch (error) {
    console.log('CREATE NEW ERROR', error);
  }
}

export async function updateNew(
  id: number,
  data: Partial<Omit<NewType, 'id'>>,
) {
  try {
    const tags = data.tags?.map((item) => ({
      where: {
        new_id_tag_id: {
          new_id: id,
          tag_id: Number(item),
        },
      },
      update: {
        tag: {
          connect: {
            id: Number(item),
          },
        },
      },
      create: {
        tag: {
          connect: {
            id: Number(item),
          },
        },
      },
    }));

    const news = await prisma.news.update({
      where: {
        id,
      },
      data: {
        ...data,
        pubDate: data.is_graft ? null : new Date(),
        tags: {
          upsert: tags,
        },
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return news;
  } catch (error) {
    console.log('UPDATE NEW ERROR', error);
  }
}

export async function deleteNew(id: number) {
  try {
    await prisma.news.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    console.log('DELETE NEW ERROR', error);
  }
}

export async function softDeleteNew(id: number) {
  try {
    await prisma.news.update({
      where: {
        id,
      },
      data: {
        is_deleted: true,
      },
    });
  } catch (error) {
    console.log('SOFT DELETE NEW ERROR', error);
  }
}

export async function restoreNew(id: number) {
  try {
    await prisma.news.update({
      where: {
        id,
      },
      data: {
        is_deleted: false,
      },
    });
  } catch (error) {
    console.log('RESTORE NEW ERROR', error);
  }
}

export async function getNew(id: number) {
  try {
    const news = await prisma.news.findUnique({
      where: {
        id: id,
      },
      include: {
        media: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
    return news;
  } catch (error) {
    console.log('GET NEW ERROR', error);
  }
}
export async function getNews(
  page: number = 1,
  onlyPublished = false,
  inNotHidden = false,
  query = '',
) {
  try {
    const pageSize = 10;
    const offset = (page - 1) * pageSize;

    const whereQuery: PrismaNewsWhereInput = {
      AND: [
        onlyPublished
          ? {
              pubDate: {
                not: null,
              },
            }
          : {},

        inNotHidden
          ? {
              is_hidden: false,
            }
          : {},

        query
          ? {
              title: {
                mode: 'insensitive',
                contains: query,
              },
            }
          : {},
      ],
    };
    const news = await prisma.news.findMany({
      where: whereQuery,
      take: pageSize,
      skip: offset,
      include: {
        media: true,
        ads: {
          include: {
            media: true,
          },
        },
      },
    });

    const count = await prisma.news.count({
      where: whereQuery,
    });

    if (!news || !count) {
      return {
        news: [],
        paginationInfo: {
          pages: 1,
          page: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
    }

    const pages = Math.ceil(count / pageSize);

    return {
      news,
      paginationInfo: {
        pages,
        page,
        hasNextPage: page < pages,
        hasPreviousPage: page > 1,
      },
    };
  } catch (error) {
    console.log('GET NEWS ERROR', error);
    return {
      news: [],
      paginationInfo: {
        pages: 1,
        page: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
  }
}

export async function getRssNews(title?: string, guid?: string) {
  try {
    const news = await prisma.news.findFirst({
      where: {
        title: title,
        source_guid: guid,
      },
    });
    return news;
  } catch (error) {
    console.log('GET RSS NEW ERROR', error);
  }
}
