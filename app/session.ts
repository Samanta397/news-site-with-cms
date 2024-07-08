import { createCookieSessionStorage } from '@remix-run/node'; // or cloudflare/deno

type SessionData = {
  userId: string;
};

type SessionFlashData = {
  error: string;
};

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error('SESSION_SECRET must be set');
}

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
    cookie: {
      name: 'admin-session',
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
      sameSite: 'lax',
      secrets: [sessionSecret],
      secure: process.env.NODE_ENV === 'production',
    },
  });

export { getSession, commitSession, destroySession };
