import {
  Form,
  json,
  redirect,
  useActionData,
  useLoaderData,
} from '@remix-run/react';
import { Card } from '~/components/Card';
import { FormField } from '~/components/FormField';
import { Button } from '~/components/Button';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/node';
import { getUserSession } from '~/api/auth.server';
import { getUser } from '~/api/user.server';
import { capitalize } from '~/utils/capitalize';
import { Role } from '~/types/user.types';
import { createOrUpdateSettings, getSettings } from '~/api/settings.server';
import {
  SettingsFields,
  SettingsFieldsErrors,
} from '~/utils/validation/schema';
import { useState } from 'react';
import { Breadcrumbs } from '~/components/Breadcrumbs';

export const meta: MetaFunction = () => {
  return [
    { title: `Settings page | News CMS` },
    {
      property: 'og:title',
      content: 'News CMS',
    },
    {
      name: 'description',
      content: 'Settings page',
    },
  ];
};

type ActionData = {
  fields: SettingsFields;
  errors?: SettingsFieldsErrors & {
    error: string;
    status: number;
  };
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getUserSession(request);

  const sessionUser = await getUser(Number(session.get('userId')));
  const isAdmin = sessionUser
    ? capitalize(sessionUser.role) === Role.ADMIN
    : false;

  const settings = await getSettings();

  return json({
    settings,
    isAdmin,
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const fields = Object.fromEntries(formData.entries()) as SettingsFields;
  const result = SettingsFields.safeParse(fields);

  if (!result.success) {
    return json({
      fields,
      errors: result.error.flatten(),
    });
  }

  const data = {
    amount_per_page: Number(fields.amount_per_page),
  };

  await createOrUpdateSettings(data);
  return redirect(`/dashboard/settings`);
};

export default function Settings() {
  const { settings, isAdmin } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>() as ActionData;
  const [amount, setAmount] = useState<number>(settings?.amount_per_page || 0);

  return (
    <div className={'flex flex-col gap-10'}>
      <Breadcrumbs
        aria-label="Breadcrumbs"
        breadcrumbs={[
          { href: '/dashboard/ads', label: 'Advertisements' },
          {
            href: `/dashboard/settings`,
            label: `Settings`,
          },
        ]}
      />
      <Form
        className="space-y-4"
        method="post"
        encType="multipart/form-data"
        role="advertisement_settings_form"
      >
        <div className={'flex gap-10'}>
          <Card width={'w-3/4'} gap>
            <FormField
              name="amount_per_page"
              htmlFor="amount_per_page"
              label="Advertisement amount per page"
              value={amount}
              type={'number'}
              onChange={setAmount}
              aria-label="Amount per page input"
              errorMessage={actionData?.errors?.fieldErrors?.amount_per_page}
            />
          </Card>
        </div>
        <div className={'flex justify-between'}>
          <Button
            type={'submit'}
            label={`Save`}
            aria-label="Save settings changes"
            disabled={!isAdmin}
          />
        </div>
      </Form>
    </div>
  );
}
