import { LoaderFunctionArgs } from '@remix-run/node';
import { getUserSession } from '~/api/auth.server';
import { json, redirect, useNavigate } from '@remix-run/react';

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getUserSession(request);

  if (!session.has('userId')) {
    // Redirect to the home page if they are already signed in.
    return redirect('/login');
  }

  return null;
}
export default function Dashboard() {
  const navigate = useNavigate();
  return (
    <div>
      <div>Hi there</div>
      <button onClick={() => navigate('/logout')}>logout</button>
    </div>
  );
}
