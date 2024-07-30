import { prisma } from '~/api/prisma.server';

export async function saveMedia(fileName: string | null) {
  try {
    if (fileName) {
      const media = await prisma.media.create({
        data: {
          file_name: fileName,
        },
      });
      return media;
    }
    return null;
  } catch (error) {
    console.log('SAVE MEDIA ERROR', error);
    return null;
  }
}
