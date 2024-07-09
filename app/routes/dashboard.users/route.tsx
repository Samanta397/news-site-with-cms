import { Link, useNavigate } from '@remix-run/react';

export default function Users() {
  const navigate = useNavigate();
  return (
    <>
      <div>Users page</div>
      <button onClick={() => navigate('/dashboard/users/1')}>
        Go to user 1
      </button>
    </>
  );
}
