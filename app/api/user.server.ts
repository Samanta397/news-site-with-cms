import { prisma } from './prisma.server';
import { RegisterForm, UpdateUserData } from '~/types/user.types';
import CryptoJS from 'crypto-js';

export async function createUser(data: RegisterForm) {
  try {
    const exists = await prisma.user.count({ where: { email: data.email } });

    if (exists) {
      return {
        error: `User already exists with that email`,
        status: 400,
      };
    }

    const hashedPassword = CryptoJS.SHA256(data.password).toString();
    await prisma.user.create({
      data: {
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        password: hashedPassword,
        role: data.role.toUpperCase(), //TODO: fix with enum
      },
    });

    return true;
  } catch (error) {
    console.log('CREATE USER ERROR', error);
    return {
      error: `Server error`,
      status: 500,
    };
  }
}

export async function updateUser(data: Partial<UpdateUserData>) {
  try {
    await prisma.user.update({
      where: {
        id: data.id,
      },
      data: { ...data },
    });
  } catch (error) {
    console.log('UPDATE USER ERROR', error);
  }
}

export async function getUser(id: number) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id,
      },
    });

    return user;
  } catch (error) {
    console.log('GET USER ERROR', error);
  }
}

export async function deleteUser(id: number) {
  try {
    await prisma.user.delete({
      where: {
        id,
      },
    });

    return true;
  } catch (error) {
    console.log('DELETE USER ERROR', error);
  }
}
