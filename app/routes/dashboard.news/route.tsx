import { Table } from '~/components/Table';
import { Button } from '~/components/Button';
import { useLoaderData, useNavigate } from '@remix-run/react';
import { ActionFunctionArgs, json, LoaderFunctionArgs } from '@remix-run/node';
import { getNews } from '~/api/news.server';
import { prepareNews } from '~/utils/prepareNews';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const news = await getNews();

  return json({ news: prepareNews(news || []) });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const fields = Object.fromEntries(formData.entries());

  // if ('actionType' in fields && fields.actionType === 'delete') {
  //   await deleteUser(Number(fields.id));
  //
  //   return redirect('/dashboard/users');
  // } else {
  //   const result = RegisterFields.safeParse(fields);
  //   if (!result.success) {
  //     return json({
  //       fields,
  //       errors: result.error.flatten(),
  //     });
  //   }
  //
  //   await updateUser(fields);
  // }

  return null;
};

export default function News() {
  const { news } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const headings = [
    { title: 'Title' },
    { title: 'Author' },
    { title: 'Status' }, //Draft/Published
    { title: 'Date' },
  ];

  return (
    <div className="flex gap-6 flex-col ">
      <div className={'flex justify-end'}>
        <Button label={'Create new'} onClick={() => navigate('create')} />
      </div>

      <Table
        headings={headings}
        rows={news} //TODO: fix type
        onClick={(to: string) => navigate(to)}
        entityName={'News'}
        emptyMessage={'No news yet'}
      />
    </div>
  );
}
