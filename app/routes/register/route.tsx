import { Form, json, Link, redirect, useActionData } from '@remix-run/react';
import { useState } from 'react';
import { Layout } from '~/components/Layout';
import { Card } from '~/components/Card';
import { FormField } from '~/components/FormField';
import { Button } from '~/components/Button';
import { Select } from '~/components/Select';
import { Role } from '~/types/user.types';
import { ActionFunctionArgs } from '@remix-run/node';
import {
  RegisterFields,
  RegisterFieldsErrors,
} from '~/utils/validation/schema';
import { createUser } from '~/api/user.server';
import { Alert, AlertStatus } from '~/components/Alert';

type ActionData = {
  fields: RegisterFields;
  errors?: RegisterFieldsErrors & {
    error: string;
    status: number;
  };
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

  const registeredData = await createUser(fields);

  if (typeof registeredData === 'boolean' && registeredData) {
    return redirect('/dashboard');
  } else {
    return json({
      fields,
      errors: registeredData,
    });
  }

  return null;
};

export default function Register() {
  const actionData = useActionData<typeof action>() as ActionData;

  const [state, setState] = useState('register');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>(Role.USER);

  const roles = [Role.ADMIN, Role.USER];

  //TODO: add error state to FormField

  return (
    <Layout>
      <Card>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Create new account
          </h2>
        </div>

        {actionData?.errors && (
          <div className="mt-4">
            <Alert
              title={'Something happened during registration'}
              description={actionData?.errors?.error}
              status={
                actionData?.errors?.status === 500
                  ? AlertStatus.ERROR
                  : AlertStatus.WARNING
              }
            />
          </div>
        )}

        <div className="mt-6 sm:mx-auto min-w-80 sm:w-full sm:max-w-sm">
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

            <Button
              type={'submit'}
              label={'Sign in'}
              onClick={() => console.log('Sing in')}
            />
          </Form>

          <p className="mt-10 text-center text-sm text-gray-500">
            {state === 'login' ? 'Not a member?' : 'Login to account'}
            <Link
              to="/login"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 ml-1"
              onClick={() => setState(state == 'login' ? 'register' : 'login')}
            >
              {state === 'login' ? 'Sign up' : 'Sign in'}
            </Link>
          </p>
        </div>
      </Card>
    </Layout>
  );
}
