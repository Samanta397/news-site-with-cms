import { Checkbox } from '~/components/Checkbox';
import { useEffect, useState } from 'react';
import { Button } from '~/components/Button';
import { ArrowRightIcon } from '~/icons/ArrowRightIcon';
import { ArrowLeftIcon } from '~/icons/ArrowLeftIcon';

type HeadingType = {
  title: string;
};

type RowType = {
  id: string;
  [key: string]: string;
};

export type PaginationType = {
  hasNext: boolean;
  hasPrevious: boolean;
  onPrevious: () => void;
  onNext: () => void;
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
  pagination?: PaginationType;
  disabled?: boolean;
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
  pagination,
  disabled = false,
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
        <thead
          className="text-xs text-gray-700 uppercase bg-gray-100"
          aria-label={'table head'}
        >
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
                    rows.length > 0 &&
                    (selectedAll ||
                      rows
                        .map((item) => item.id)
                        .every((item) => selected?.includes(item)))
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
                  aria-label="Bulk action"
                  disabled={disabled}
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
        <tbody aria-label={'table'}>
          {rows.map(({ id, ...row }) => (
            <tr
              className="bg-white border-b hover:bg-gray-50"
              key={`table_tr_${id}`}
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
                    aria-label={`Select item with id ${id}`}
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
                colSpan={selectable ? headings.length + 1 : headings.length}
                className={'text-center bg-white py-10 text-2xl font-bold'}
              >
                {emptyMessage ? emptyMessage : `${entityName} not found`}
              </td>
            </tr>
          )}
        </tbody>
        {pagination && (
          <tfoot className={'bg-slate-50'} aria-label={'Table pagination'}>
            <tr>
              <td
                className={'p-2'}
                colSpan={selectable ? headings.length + 1 : headings.length}
              >
                <div className={'flex justify-center gap-2'}>
                  <Button
                    icon={<ArrowLeftIcon />}
                    tone={'primary'}
                    disabled={!pagination.hasPrevious}
                    onClick={pagination.onPrevious}
                    aria-label={'Previous page'}
                  />
                  <Button
                    icon={<ArrowRightIcon />}
                    tone={'primary'}
                    disabled={!pagination.hasNext}
                    onClick={pagination.onNext}
                    aria-label={'Next page'}
                  />
                </div>
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}
