import { Layout } from '~/components/Layout';
import { FormField } from '~/components/FormField';
import { Card } from '~/components/Card';
import { Form, json, Link, redirect, useActionData } from '@remix-run/react';
import { Button } from '~/components/Button';
import { useState } from 'react';
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { LoginFields, LoginFieldsErrors } from '~/utils/validation/schema';
import { Alert, AlertStatus } from '~/components/Alert';
import { getUserSession, login } from '~/api/auth.server';
import { commitSession, getSession } from '~/session';

type ActionData = {
  fields: LoginFields;
  errors?: LoginFieldsErrors & {
    error: string;
    status: number;
  };
};

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getUserSession(request);

  if (session.has('userId')) {
    // Redirect to the home page if they are already signed in.
    return redirect('/dashboard');
  }

  const data = { error: session.get('error') };
  return json(data, {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const session = await getUserSession(request);

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

  if (loginData && 'error' in loginData) {
    return json({
      fields,
      errors: loginData,
    });
  }

  if (loginData && 'id' in loginData) {
    session.set('userId', loginData.id.toString());
  }

  return redirect('/dashboard', {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
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
              fullWidth
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
