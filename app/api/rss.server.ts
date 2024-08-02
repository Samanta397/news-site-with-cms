import { prisma } from './prisma.server';
import { RssType } from '~/types/rss.types';
export async function createNewsSource(data: Omit<RssType, 'id'>) {
  try {
    const source = await prisma.newsSource.create({
      data,
    });

    return source;
  } catch (error) {
    console.log('CREATE NEWS SOURCE ERROR', error);
  }
}

export async function updateNewsSource(
  id: number,
  data: Partial<Omit<RssType, 'id'>>,
) {
  try {
    const source = await prisma.newsSource.update({
      where: {
        id,
      },
      data,
    });

    return source;
  } catch (error) {
    console.log('UPDATE NEWS SOURCE ERROR', error);
  }
}

export async function deleteNewsSource(id: number) {
  try {
    const source = await prisma.newsSource.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    console.log('UPDATE NEWS SOURCE ERROR', error);
  }
}

export async function getNewsSource(id: number) {
  try {
    const source = await prisma.newsSource.findUnique({
      where: {
        id,
      },
    });

    return source;
  } catch (error) {
    console.log('UPDATE NEWS SOURCE ERROR', error);
  }
}

export async function getNewsSources(page: number = 1) {
  try {
    const pageSize = 10;
    const offset = (page - 1) * pageSize;
    const sources = await prisma.newsSource.findMany({
      take: pageSize,
      skip: offset,
    });

    const count = await prisma.newsSource.count();

    if (!sources || !count) {
      return {
        sources: [],
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
      sources,
      paginationInfo: {
        pages,
        page,
        hasNextPage: page < pages,
        hasPreviousPage: page > 1,
      },
    };
  } catch (error) {
    console.log('UPDATE NEWS SOURCE ERROR', error);
    return {
      sources: [],
      paginationInfo: {
        pages: 1,
        page: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
  }
}

export async function getActiveNewsSources() {
  try {
    const sources = await prisma.newsSource.findMany({
      where: {
        is_active: true,
      },
    });

    return sources;
  } catch (error) {
    console.log('UPDATE NEWS SOURCE ERROR', error);
  }
}
