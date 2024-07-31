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

export async function updateNewsSource(id: number, data: Omit<RssType, 'id'>) {
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

export async function getNewsSources() {
  try {
    const sources = await prisma.newsSource.findMany();

    return sources;
  } catch (error) {
    console.log('UPDATE NEWS SOURCE ERROR', error);
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
