import { LoginForm, RegisterForm } from '~/types/user.types';
import { prisma } from '~/api/prisma.server';
import { createUser, getUserByEmail } from '~/api/user.server';
import CryptoJS from 'crypto-js';
import { destroySession, getSession } from '~/session';
import { redirect } from '@remix-run/react';

export async function register(user: RegisterForm) {
  try {
    const exists = await prisma.user.count({ where: { email: user.email } });

    if (exists) {
      return {
        error: `User already exists with that email`,
        status: 400,
      };
    }

    const newUser = await createUser(user);

    if (!newUser) {
      return {
        error: `Something went wrong trying to create a new user.`,
        status: 400,
      };
    }

    return newUser;
  } catch (error) {
    console.log('REGISTER ERROR', error);
  }
}

export async function login({ email, password }: LoginForm) {
  try {
    const user = await getUserByEmail(email);
    const hashedPassword = CryptoJS.SHA256(password).toString();
    if (!user || user.password !== hashedPassword) {
      return {
        error: `Incorrect login or password`,
        status: 400,
      };
    }

    return user;
  } catch (error) {
    console.log('LOGIN ERROR', error);
  }
}

export async function logout(request: Request) {
  try {
    const session = await getUserSession(request);
    return redirect('/login', {
      headers: {
        'Set-Cookie': await destroySession(session),
      },
    });
  } catch (error) {
    console.log('LOGOUT ERROR', error);
  }
}

export async function getUserSession(request: Request) {
  return await getSession(request.headers.get('Cookie'));
}
