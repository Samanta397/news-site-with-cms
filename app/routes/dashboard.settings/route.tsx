import { Form, json, redirect, useLoaderData } from '@remix-run/react';
import { Card } from '~/components/Card';
import { FormField } from '~/components/FormField';
import { Button } from '~/components/Button';
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
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

type ActionData = {
  fields: SettingsFields;
  errors?: SettingsFieldsErrors & {
    error: string;
    status: number;
  };
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
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

  const settings = await createOrUpdateSettings(data);
  return redirect(`/dashboard/settings`);
};

export default function Settings() {
  const { settings, isAdmin } = useLoaderData<typeof loader>();
  const [amount, setAmount] = useState<number>(settings?.amount_per_page || 0);

  return (
    <div className={'flex flex-col gap-10'}>
      <Form className="space-y-4" method="post" encType="multipart/form-data">
        <div className={'flex gap-10'}>
          <Card width={'w-3/4'} gap>
            <FormField
              name="amount_per_page"
              htmlFor="amount_per_page"
              label="Advertisement amount per page"
              value={amount}
              type={'number'}
              onChange={setAmount}
            />
          </Card>
        </div>
        <div className={'flex justify-between'}>
          <Button type={'submit'} label={`Save`} />
        </div>
      </Form>
    </div>
  );
}
