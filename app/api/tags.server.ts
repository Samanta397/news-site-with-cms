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

export async function getTags() {
  try {
    const tags = await prisma.tag.findMany();
    return tags;
  } catch (error) {
    console.log('GET TAG ERROR', error);
  }
}
