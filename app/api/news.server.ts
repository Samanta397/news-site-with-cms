import { prisma } from './prisma.server';
import { NewType } from '~/types/new.types';

export async function createNew(data: NewType) {
  try {
    const news = await prisma.news.create({
      data,
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
      },
    });
    return news;
  } catch (error) {
    console.log('CREATE NEW ERROR', error);
  }
}

export async function updateNew(id: number, data: Partial<NewType>) {
  try {
    const news = await prisma.news.update({
      where: {
        id,
      },
      data,
    });
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
        id,
      },
    });
    return news;
  } catch (error) {
    console.log('GET NEW ERROR', error);
  }
}
export async function getNews() {
  //TODO: add pagination, filtering, searching
  const news = await prisma.news.findMany();

  return news;
  try {
  } catch (error) {
    console.log('GET NEWS ERROR', error);
  }
}
