import { ActionFunctionArgs, json, LoaderFunctionArgs } from '@remix-run/node';
import { Form, redirect, useLoaderData, useSubmit } from '@remix-run/react';
import { FormField } from '~/components/FormField';
import { Button } from '~/components/Button';
import { Select } from '~/components/Select';
import { useState } from 'react';
import { Role } from '~/types/user.types';
import { deleteUser, getUser, updateUser } from '~/api/user.server';
import { getUserSession } from '~/api/auth.server';
import { RegisterFields } from '~/utils/validation/schema';
import { capitalize } from '~/utils/capitalize';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const session = await getUserSession(request);

  const { userId } = params;
  if (!userId) {
    //TODO: add logic when userId not exists
    return;
  }

  const user = await getUser(Number(userId));

  const sessionUser = await getUser(Number(session.get('userId')));

  const isAdmin = sessionUser
    ? capitalize(sessionUser.role) === Role.ADMIN
    : false;

  return json({ userId, user, isAdmin });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const fields = Object.fromEntries(formData.entries());

  if ('actionType' in fields && fields.actionType === 'delete') {
    await deleteUser(Number(fields.id));

    return redirect('/dashboard/users');
  } else {
    const result = RegisterFields.safeParse(fields);
    if (!result.success) {
      return json({
        fields,
        errors: result.error.flatten(),
      });
    }

    await updateUser(fields);
  }

  return null;
};

export default function User() {
  const { userId, user, isAdmin } = useLoaderData<typeof loader>();
  const submit = useSubmit();

  const [firstName, setFirstName] = useState(user?.first_name || '');
  const [lastName, setLastName] = useState(user?.last_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<string>(user?.role || Role.USER);

  const roles = [Role.ADMIN, Role.USER];

  const handleDelete = (id: string) => {
    submit(
      {
        id,
        actionType: 'delete',
      },
      {
        replace: true,
        method: 'POST',
      },
    );
  };

  return (
    <div className="mt-6 sm:mx-left min-w-80 sm:w-full sm:max-w-sm">
      <Form className="space-y-4" method="post">
        <FormField
          name="id"
          htmlFor="id"
          label="Id"
          value={userId}
          required
          hidden
        />

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
            onClick={() => handleDelete(userId)}
            tone={'critical'}
            // disabled={!isAdmin}
          />
          <Button type={'submit'} label={'Save'} />
        </div>
      </Form>
    </div>
  );
}
