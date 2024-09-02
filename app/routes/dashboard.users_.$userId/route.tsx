import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/node';
import { Form, redirect, useLoaderData, useSubmit } from '@remix-run/react';
import { FormField } from '~/components/FormField';
import { Button } from '~/components/Button';
import { Select, SelectItemType } from '~/components/Select';
import { useReducer } from 'react';
import { RegisterForm, Role } from '~/types/user.types';
import { createUser, deleteUser, getUser, updateUser } from '~/api/user.server';
import { getUserSession } from '~/api/auth.server';
import { RegisterFields } from '~/utils/validation/schema';
import { capitalize } from '~/utils/capitalize';
import { Breadcrumbs } from '~/components/Breadcrumbs';
import { RegisterActionKind, registerReducer } from '~/utils/reducers/register';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const session = await getUserSession(request);

  const { userId } = params;
  if (!userId) {
    return;
  }

  const sessionUser = await getUser(Number(session.get('userId')));

  const isAdmin = sessionUser
    ? capitalize(sessionUser.role) === Role.ADMIN
    : false;

  if (userId === 'create') {
    return json({
      userId,
      user: null,
      isAdmin,
    });
  } else {
    const user = await getUser(Number(userId));

    return json({
      userId,
      user,
      isAdmin,
    });
  }
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `Single user page | News CMS` },
    {
      property: 'og:title',
      content: 'News CMS',
    },
    {
      name: 'description',
      content: `${data?.userId === 'create' ? 'Create user page' : `User id ${data?.userId}`}`,
    },
  ];
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

    if (fields.id === 'create') {
      const { id, ...createData } = fields;

      const createdUser = await createUser(createData as RegisterForm);
      if (createdUser) {
        return redirect(`/dashboard/users/${createdUser.id}`);
      }
    } else {
      const updatedUser = await updateUser(fields);
      if (updatedUser) {
        return redirect(`/dashboard/users/${updatedUser.id}`);
      }
    }
  }

  return null;
};

export default function User() {
  const { userId, user, isAdmin } = useLoaderData<typeof loader>();
  const submit = useSubmit();

  const [userState, dispatch] = useReducer(registerReducer, {
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    password: '',
    role: capitalize(user?.role) || Role.USER,
  });

  const roles = [
    { id: 'Admin', value: Role.ADMIN },
    { id: 'User', value: Role.USER },
  ];
  const handleSelectRole = (value: SelectItemType | SelectItemType[]) => {
    if (!Array.isArray(value)) {
      dispatch({
        type: RegisterActionKind.ROLE,
        payload:
          roles.find((item) => value.value === item.value)?.value || Role.USER,
      });
    }
  };

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
      <Breadcrumbs
        aria-label="Breadcrumbs"
        breadcrumbs={[
          { href: '/dashboard/users', label: 'Users' },
          {
            href: `/dashboard/users/${userId}`,
            label: `${user ? user.first_name.concat(` ${user.last_name}`) : 'create'}`,
          },
        ]}
      />
      <Form className="space-y-4" method="post" role={'user_data_form'}>
        <FormField
          name="id"
          htmlFor="id"
          label="Id"
          value={userId}
          required
          hidden
          aria-label="Id input"
        />

        <FormField
          name="first_name"
          htmlFor="firstName"
          label="First name"
          value={userState.first_name}
          required
          onChange={(e) =>
            dispatch({ type: RegisterActionKind.FIRST_NAME, payload: e })
          }
          aria-label="First name input"
        />
        <FormField
          name="last_name"
          htmlFor="lastName"
          label="Last name"
          value={userState.last_name}
          required
          onChange={(e) =>
            dispatch({ type: RegisterActionKind.LAST_NAME, payload: e })
          }
          aria-label="Last name input"
        />
        <FormField
          name="email"
          htmlFor="email"
          type="email"
          label="Email"
          value={userState.email}
          required
          onChange={(e) =>
            dispatch({ type: RegisterActionKind.EMAIL, payload: e })
          }
          aria-label="Email input"
        />

        <FormField
          name="password"
          htmlFor="password"
          type="password"
          label="Password"
          value={userState.password}
          required
          onChange={(e) =>
            dispatch({ type: RegisterActionKind.PASSWORD, payload: e })
          }
          aria-label="Password input"
        />

        <Select
          label={'Role'}
          name={'role'}
          options={roles}
          value={roles.find((item) => userState.role === item.id) || roles[1]}
          onSelect={handleSelectRole}
          aria-label="Role selector"
        />

        <div className={'flex justify-between'}>
          <Button
            label={'Delete'}
            onClick={() => handleDelete(userId)}
            tone={'critical'}
            disabled={!user || !isAdmin}
            aria-label="Delete user"
          />
          <Button
            type={'submit'}
            label={'Save'}
            aria-label="Save user changes"
            disabled={!isAdmin}
          />
        </div>
      </Form>
    </div>
  );
}
