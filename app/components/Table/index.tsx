type HeadingType = {
  title: string;
};

type RowType = {
  id: string;
  [key: string]: string;
};

type TableProps = {
  headings: HeadingType[];
  rows: RowType[];
  onClick: (value: string) => void;
};

export function Table({ headings, rows, onClick }: TableProps) {
  return (
    <div className="relative overflow-x-auto bg-gray-300 shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500  border-2  overflow-hidden rounded-lg">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
          <tr className="border-b">
            {headings.map((item, idx) => (
              <th scope="col" className="px-6 py-3 " key={`table_head_${idx}`}>
                {item.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(({ id, ...row }) => (
            <tr
              className="bg-white border-b hover:bg-gray-50"
              key={`table_tr_${id}`}
              onClick={() => onClick(`${id}`)}
            >
              {Object.entries(row).map(([key, value]) => (
                <td className="px-6 py-4" key={`table_td_${key}`}>
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
