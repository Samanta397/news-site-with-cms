import { LoaderFunctionArgs } from '@remix-run/node';
import { getUserSession } from '~/api/auth.server';
import { redirect } from '@remix-run/react';
import { destroySession } from '~/session';

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getUserSession(request);
  return redirect('/login', {
    headers: {
      'Set-Cookie': await destroySession(session),
    },
  });
}
