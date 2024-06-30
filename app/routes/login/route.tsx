import { Layout } from '~/components/Layout';
import { FormField } from '~/components/FormField';
import { Card } from '~/components/Card';
import { Form, json, Link, redirect, useActionData } from '@remix-run/react';
import { Button } from '~/components/Button';
import { useState } from 'react';
import { ActionFunctionArgs } from '@remix-run/node';
import { LoginFields, LoginFieldsErrors } from '~/utils/validation/schema';
import { createUser, login } from '~/api/user.server';
import { Alert, AlertStatus } from '~/components/Alert';

type ActionData = {
  fields: LoginFields;
  errors?: LoginFieldsErrors & {
    error: string;
    status: number;
  };
};
export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const fields = Object.fromEntries(formData.entries()) as LoginFields;
  const result = LoginFields.safeParse(fields);

  if (!result.success) {
    return json({
      fields,
      errors: result.error.flatten(),
    });
  }

  const loginData = await login(fields);

  if ('error' in loginData) {
    return json({
      fields,
      errors: loginData,
    });
  }

  return redirect('/dashboard');
};

export default function Login() {
  const actionData = useActionData<typeof action>() as ActionData;

  const [state, setState] = useState('login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  //TODO: add error state to FormField

  return (
    <Layout>
      <Card>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        {actionData?.errors && (
          <div className="mt-4">
            <Alert
              title={'Something happened during login'}
              description={actionData?.errors?.error}
              status={
                actionData?.errors?.status === 500
                  ? AlertStatus.ERROR
                  : AlertStatus.WARNING
              }
            />
          </div>
        )}

        <div className="mt-6 min-w-80 sm:mx-auto sm:w-full sm:max-w-sm">
          <Form className="space-y-4" method="post">
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

            <Button
              type={'submit'}
              label={'Sign in'}
              onClick={() => console.log('Sing in')}
            />
          </Form>

          <p className="mt-10 text-center text-sm text-gray-500">
            {state === 'login' ? 'Not a member?' : 'Login to account'}
            <Link
              to={state === 'login' ? '/register' : '/login'}
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
