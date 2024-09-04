import { prisma } from './prisma.server';
import { RegisterForm, Role, UpdateUserData } from '~/types/user.types';
import CryptoJS from 'crypto-js';

export async function createUser(data: RegisterForm) {
  try {
    const hashedPassword = CryptoJS.SHA256(data.password).toString();
    const user = await prisma.user.create({
      data: {
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        password: hashedPassword,
        role: data.role.toUpperCase() as keyof typeof Role,
      },
    });

    return user;
  } catch (error) {
    console.log('CREATE USER ERROR', error);
    // return {
    //   error: `Server error`,
    //   status: 500,
    // };
  }
}

export async function updateUser({ id, ...data }: Partial<UpdateUserData>) {
  try {
    return await prisma.user.update({
      where: {
        id: Number(id),
      },
      data: {
        ...data,
        role: data.role?.toUpperCase() as keyof typeof Role,
      },
    });
  } catch (error) {
    console.log('UPDATE USER ERROR', error);
  }
}

export async function getUser(id: number) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: id,
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

export async function getUserByEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    return user;
  } catch (error) {
    console.log('LOGIN ERROR', error);
    // return {
    //   error: `Server error`,
    //   status: 500,
    // };
  }
}

export async function getUsers(page: number = 1) {
  try {
    const pageSize = 10;
    const offset = (page - 1) * pageSize;

    const users = await prisma.user.findMany({
      take: pageSize,
      skip: offset,
    });

    const count = await prisma.user.count();

    if (!users || !count) {
      return {
        users: [],
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
      users,
      paginationInfo: {
        pages,
        page,
        hasNextPage: page < pages,
        hasPreviousPage: page > 1,
      },
    };
  } catch (error) {
    console.log('GET USERS ERROR', error);
    return {
      users: [],
      paginationInfo: {
        pages: 1,
        page: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
  }
}
