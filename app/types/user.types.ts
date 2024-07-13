import { Prisma } from '@prisma/client';

export type RegisterForm = {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: Role;
};

export type User = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type UpdateUserData = {
  id: string;
  role: Role;
} & Partial<User>;

export type LoginForm = {
  email: string;
  password: string;
};

export enum Role {
  USER = 'User',
  ADMIN = 'Admin',
}

export type PrismaUser = Prisma.UserGetPayload<Prisma.UserDefaultArgs>;
