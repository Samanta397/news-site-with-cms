import { PrismaClient } from '@prisma/client';
import CryptoJS from 'crypto-js';

const prisma = new PrismaClient();

const defaultUser = {
  email: 'default.user@gmail.com',
  first_name: 'Default',
  last_name: 'User',
  password: '123456',
  role: 'USER' as const,
};

async function seed() {
  try {
    const hashedPassword = CryptoJS.SHA256(defaultUser.password).toString();

    const isExisted = await prisma.user.findUnique({
      where: {
        email: defaultUser.email,
      },
    });

    if (isExisted) {
      console.log('Default user already existed');
      return;
    }

    await prisma.user.create({
      data: {
        ...defaultUser,
        password: hashedPassword,
      },
    });

    console.log('Seed data has been inserted successfully.');
  } catch (error) {
    console.error('Error seeding data:', error);
    await prisma.$disconnect();
  }
}

seed().then(async () => {
  await prisma.$disconnect();
});
