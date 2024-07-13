import { ActionFunctionArgs, json, LoaderFunctionArgs } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import { FormField } from '~/components/FormField';
import { Button } from '~/components/Button';
import { Select } from '~/components/Select';
import { useState } from 'react';
import { Role } from '~/types/user.types';
import { getUser } from '~/api/user.server';
import { getUserSession, register } from '~/api/auth.server';
import { RegisterFields } from '~/utils/validation/schema';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const session = await getUserSession(request);

  const { userId } = params;
  const user = await getUser(Number(userId));

  const sessionUser = await getUser(Number(session.get('userId')));

  const isAdmin = sessionUser ? sessionUser.role === 'ADMIN' : false;

  return json({ userId, user, isAdmin });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const fields = Object.fromEntries(formData.entries()) as RegisterFields;
  const result = RegisterFields.safeParse(fields);

  if (!result.success) {
    return json({
      fields,
      errors: result.error.flatten(),
    });
  }
  return null;
};

export default function User() {
  const { userId, user, isAdmin } = useLoaderData<typeof loader>();

  const [firstName, setFirstName] = useState(user?.first_name || '');
  const [lastName, setLastName] = useState(user?.last_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<string>(user?.role || Role.USER);

  const roles = [Role.ADMIN, Role.USER];

  return (
    <div className="mt-6 sm:mx-left min-w-80 sm:w-full sm:max-w-sm">
      <Form className="space-y-4" method="post">
        <FormField
          name="first_name"
          htmlFor="firstName"
          label="First name"
          value={firstName}
          required
          onChange={setFirstName}
        />
        <FormField
          name="last_name"
          htmlFor="lastName"
          label="Last name"
          value={lastName}
          required
          onChange={setLastName}
        />
        <FormField
          name="email"
          htmlFor="email"
          type="email"
          label="Email"
          value={email}
          required
          onChange={setEmail}
        />

        <FormField
          name="password"
          htmlFor="password"
          type="password"
          label="Password"
          value={password}
          required
          onChange={setPassword}
        />

        <Select
          label={'Role'}
          name={'role'}
          options={roles}
          value={role}
          onSelect={setRole}
        />

        <div className={'flex justify-between'}>
          <Button
            label={'Delete'}
            onClick={() => console.log('Sing in')}
            tone={'critical'}
            disabled={!isAdmin}
          />
          <Button
            type={'submit'}
            label={'Save'}
            onClick={() => console.log('Sing in')}
            disabled={!isAdmin}
          />
        </div>
      </Form>
    </div>
  );
}
