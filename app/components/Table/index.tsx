import { Checkbox } from '~/components/Checkbox';
import { useEffect, useState } from 'react';
import { Button } from '~/components/Button';

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
  emptyMessage?: string;
  entityName: string;
  selectable?: boolean;
  selected?: string[];
  onSelect?: (value: string[]) => void;
  bulkAction?: { label: string; onAction: (value: string[]) => void };
};

export function Table({
  headings,
  rows,
  onClick,
  entityName,
  emptyMessage,
  selectable = false,
  selected = [],
  onSelect = () => {},
  bulkAction,
}: TableProps) {
  const [selectedAll, setSelectedAll] = useState<boolean>(false);

  useEffect(() => {
    if (selectedAll) {
      onSelect(rows.map((item) => item.id));
    } else {
      onSelect([]);
    }
  }, [selectedAll]);

  return (
    <div className="relative overflow-x-auto bg-gray-300 shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500  border-2  overflow-hidden rounded-lg">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
          <tr className="border-b">
            {selectable && (
              <th
                scope="col"
                className="w-1 px-6 py-3 "
                key={`table_head_select}`}
              >
                <Checkbox
                  name={'bulk-action'}
                  htmlFor={'bulk-action'}
                  checked={
                    selectedAll ||
                    rows
                      .map((item) => item.id)
                      .every((item) => selected?.includes(item))
                  }
                  onChange={() => setSelectedAll((prevState) => !prevState)}
                />
              </th>
            )}

            {selected?.length > 0 && (
              <th
                scope="col"
                className="px-6 py-3 flex justify-between items-center"
                key={`table_head_bulk_actions`}
              >
                {`${selected?.length} selected`}

                <Button
                  label={bulkAction?.label}
                  tone={'critical'}
                  bulk={true}
                  onClick={() => bulkAction?.onAction(selected)}
                />
              </th>
            )}

            {selected?.length === 0 &&
              headings.map((item, idx) => (
                <th
                  scope="col"
                  className="px-6 py-3 "
                  key={`table_head_${idx}`}
                >
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
              // onClick={() => onClick(`${id}`)}
            >
              {selectable && (
                <td
                  scope="col"
                  className=" px-6 py-3"
                  key={`table_head_select}`}
                >
                  <Checkbox
                    name={'bulk-action'}
                    htmlFor={'bulk-action'}
                    checked={selected?.includes(id)}
                    onChange={() =>
                      onSelect(
                        selected.includes(id)
                          ? selected.filter((item) => item !== id)
                          : [...selected, id],
                      )
                    }
                  />
                </td>
              )}
              {Object.entries(row).map(([key, value]) => (
                <td
                  className=" px-6 py-4"
                  key={`table_td_${key}`}
                  onClick={() => onClick(`${id}`)}
                >
                  {value}
                </td>
              ))}
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td
                colSpan={headings.length}
                className={'text-center bg-white py-10 text-2xl font-bold'}
              >
                {emptyMessage ? emptyMessage : `${entityName} not found`}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
