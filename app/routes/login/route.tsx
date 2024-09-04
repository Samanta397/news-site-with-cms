import { Layout } from '~/components/Layout';
import { FormField } from '~/components/FormField';
import { Card } from '~/components/Card';
import { Form, json, Link, redirect, useActionData } from '@remix-run/react';
import { Button } from '~/components/Button';
import { useReducer, useState } from 'react';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/node';
import { LoginFields, LoginFieldsErrors } from '~/utils/validation/schema';
import { Alert, AlertStatus } from '~/components/Alert';
import { getUserSession, login } from '~/api/auth.server';
import { commitSession } from '~/session';
import { LoginActionKind, loginReducer } from '~/utils/reducers/login';

export const meta: MetaFunction = () => {
  return [
    { title: 'Login | News CMS' },
    {
      property: 'og:title',
      content: 'News CMS',
    },
    {
      name: 'description',
      content: 'Login to News CMS admin panel',
    },
  ];
};

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
    return redirect('/dashboard/news');
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

  return redirect('/dashboard/news', {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
};

export default function Login() {
  const actionData = useActionData<typeof action>() as ActionData;
  const [loginState, dispatch] = useReducer(loginReducer, {
    email: '',
    password: '',
  });

  const [state, setState] = useState('login');

  return (
    <Layout>
      <Card centered>
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
          <Form className="space-y-4" method="post" role={'login_form'}>
            <FormField
              name="email"
              htmlFor="email"
              type="email"
              label="Email"
              value={loginState.email}
              required
              onChange={(e) =>
                dispatch({ type: LoginActionKind.EMAIL, payload: e })
              }
              aria-label="Email input"
              errorMessage={actionData?.errors?.fieldErrors?.email}
            />

            <FormField
              name="password"
              htmlFor="password"
              type="password"
              label="Password"
              value={loginState.password}
              required
              onChange={(e) =>
                dispatch({ type: LoginActionKind.PASSWORD, payload: e })
              }
              aria-label="Password input"
              errorMessage={actionData?.errors?.fieldErrors?.password}
            />

            <Button
              type={'submit'}
              label={'Sign in'}
              onClick={() => console.log('Sing in')}
              fullWidth
              aria-label="Login"
            />
          </Form>

          <p className="mt-10 text-center text-sm text-gray-500">
            {state === 'login' ? 'Not a member?' : 'Login to account'}
            <Link
              to={state === 'login' ? '/register' : '/login'}
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 ml-1"
              onClick={() => setState(state == 'login' ? 'register' : 'login')}
              aria-label={
                state === 'login' ? 'Go to register account' : 'Go to login'
              }
            >
              {state === 'login' ? 'Sign up' : 'Sign in'}
            </Link>
          </p>
        </div>
      </Card>
    </Layout>
  );
}
