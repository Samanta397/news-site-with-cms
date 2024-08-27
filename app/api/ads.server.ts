import { prisma } from '~/api/prisma.server';

export async function createAd(data: any) {
  try {
    console.log('data.is_graft', data);
    const advertisement = await prisma.advertisement.create({
      data: {
        ...data,
        pubDate: data.is_draft ? null : new Date(),
      },
    });
    return advertisement;
  } catch (error) {
    console.log('CREATE AD ERROR', error);
  }
}

export async function updateAd(id: number, data: any) {
  try {
    const advertisement = await prisma.advertisement.update({
      where: {
        id,
      },
      data: {
        ...data,
        pubDate: data.is_draft ? null : new Date(),
      },
      include: {
        new: true,
        media: true,
      },
    });
    return advertisement;
  } catch (error) {
    console.log('UPDATE AD ERROR');
  }
}

export async function deleteAd(id: number) {
  try {
    const advertisement = await prisma.advertisement.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    console.log('DELETE AD ERROR');
  }
}

export async function getAd(id: number) {
  try {
    const advertisement = await prisma.advertisement.findFirst({
      where: {
        id,
      },
      include: {
        new: true,
        media: true,
      },
    });

    return advertisement;
  } catch (error) {
    console.log('GET AD ERROR');
  }
}

export async function getAds(
  page: number = 1,
  pageSize = 10,
  onlyPublished = false,
  listPage = false,
  searchPage = false,
  query = '',
) {
  try {
    // const pageSize = 10;
    const offset = (page - 1) * pageSize;

    const advertisements = await prisma.advertisement.findMany({
      where: {
        AND: [
          onlyPublished
            ? {
                pubDate: {
                  not: null,
                },
                is_draft: false,
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
      },
      take: pageSize,
      skip: offset,
      include: {
        new: true,
        media: true,
      },
      orderBy: {
        priority: 'desc',
      },
    });

    const count = await prisma.advertisement.count({
      where: {
        AND: [
          onlyPublished
            ? {
                pubDate: {
                  not: null,
                },
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
      },
    });

    if (!advertisements || !count) {
      return {
        advertisements: [],
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
      advertisements,
      paginationInfo: {
        pages,
        page,
        hasNextPage: page < pages,
        hasPreviousPage: page > 1,
      },
    };
  } catch (error) {
    console.log('GEt ADS ERROR');
    return {
      advertisements: [],
      paginationInfo: {
        pages: 1,
        page: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
  }
}
