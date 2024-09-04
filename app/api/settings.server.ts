import { prisma } from '~/api/prisma.server';
import { SettingsCreate } from '~/types/rss.types';

export async function createOrUpdateSettings(data: SettingsCreate) {
  try {
    const existedSettings = await getSettings();
    let settings = null;

    if (!existedSettings) {
      settings = await prisma.settings.create({
        data,
      });
    } else {
      settings = await prisma.settings.update({
        where: {
          id: existedSettings.id,
        },
        data,
      });
    }

    return settings;
  } catch (error) {
    console.log('CREATE SETTINGS ERROR', error);
  }
}

export async function getSettings() {
  try {
    const settings = await prisma.settings.findFirst();
    return settings;
  } catch (error) {
    console.log('UPDATE SETTINGS ERROR', error);
  }
}
