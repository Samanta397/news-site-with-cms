import { prisma } from './prisma.server';
import { Tag } from '~/types/tag.types';
export async function createTag(tagName: string) {
  try {
    const tag = await prisma.tag.create({
      data: {
        tagName,
      },
    });
    return tag;
  } catch (error) {
    console.log('CREATE TAG ERROR', error);
  }
}

export async function updateTag({ id, tagName }: Tag) {
  try {
    const tag = await prisma.tag.update({
      where: {
        id,
      },
      data: {
        tagName,
      },
    });
    return tag;
  } catch (error) {
    console.log('UPDATE TAG ERROR', error);
  }
}

export async function deleteTag(id: number) {
  try {
    await prisma.tag.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    console.log('DELETE TAG ERROR', error);
  }
}

export async function deleteTags(ids: number[]) {
  try {
    await prisma.tag.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  } catch (error) {
    console.log('DELETE TAG ERROR', error);
  }
}

export async function getTag(id: number) {
  try {
    const tag = await prisma.tag.delete({
      where: {
        id,
      },
    });
    return tag;
  } catch (error) {
    console.log('GET TAG ERROR', error);
  }
}

export async function getTags(page: number = 1, query = '') {
  try {
    const pageSize = 10;
    const offset = (page - 1) * pageSize;

    const tags = await prisma.tag.findMany({
      where: {
        AND: [
          query
            ? {
                tagName: {
                  mode: 'insensitive',
                  contains: query,
                },
              }
            : {},
        ],
      },
      take: pageSize,
      skip: offset,
    });

    const count = await prisma.tag.count({
      where: {
        AND: [
          query
            ? {
                tagName: {
                  mode: 'insensitive',
                  contains: query,
                },
              }
            : {},
        ],
      },
    });

    if (!tags || !count) {
      return {
        tags: [],
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
      tags,
      paginationInfo: {
        pages,
        page,
        hasNextPage: page < pages,
        hasPreviousPage: page > 1,
      },
    };
  } catch (error) {
    console.log('GET TAG ERROR', error);
    return {
      tags: [],
      paginationInfo: {
        pages: 1,
        page: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
  }
}
