import { json, LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { userId } = params;
  return json({ userId });
};
export default function User() {
  const { userId } = useLoaderData<typeof loader>();
  return <div>Single11111 user page: {userId}</div>;
}
