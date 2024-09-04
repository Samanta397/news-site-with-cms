import { useEffect, useState } from 'react';

import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react';
import { twMerge } from 'tailwind-merge';
import { CheckIcon } from '~/icons/CheckIcon';
import { ChevronDownIcon } from '~/icons/ChevronDownIcon';
import { SearchBar } from '~/components/SearchBar';
import { PaginationType } from '~/components/Table';
import { SearchPagination } from '~/components/SearchBar/SearchPagination';

export type SelectItemType = { id: string; value: string };

type SelectProps = {
  label: string;
  name: string;
  options: SelectItemType[];
  value: SelectItemType | SelectItemType[];
  onSelect: (value: SelectItemType | SelectItemType[]) => void;
  multiple?: boolean;
  searchable?: boolean;
  query?: string;
  onSearch?: (value: string) => void;
  pagination?: PaginationType;
};

export function Select({
  label,
  name,
  options,
  value,
  onSelect,
  multiple = false,
  searchable = false,
  query = '',
  onSearch = () => {},
  pagination,
}: SelectProps) {
  const [selected, setSelected] = useState<SelectItemType | SelectItemType[]>(
    value,
  );
  useEffect(() => {
    onSelect(selected);
  }, [selected]);

  // useEffect(() => {
  //   setSelected(value);
  // }, [value]);

  return (
    <div>
      <label className="block text-sm font-medium leading-4 text-gray-900 mb-2">
        {label}
      </label>
      <input
        type="text"
        hidden={true}
        name={name}
        className="hidden"
        value={
          multiple && Array.isArray(selected)
            ? selected.map((item) => item.id).join(',')
            : !Array.isArray(selected)
              ? selected.id
              : 'Select'
        }
        onChange={setSelected}
      />
      <Listbox value={selected} onChange={setSelected} multiple={multiple}>
        <ListboxButton
          className={twMerge(
            'relative flex justify-between w-full rounded-md border-0 shadow-sm bg-white  py-1.5 pr-3 pl-3 text-left text-sm/6 text-black ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6',
            'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25',
          )}
        >
          {multiple || Array.isArray(selected) ? 'Select' : selected.value}
          <ChevronDownIcon
            className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-white/60"
            aria-hidden="true"
          />
        </ListboxButton>
        <ListboxOptions
          anchor="bottom"
          transition
          className={twMerge(
            'w-[var(--button-width)] rounded-md border border-black/5 bg-slate-100 p-1 [--anchor-gap:var(--spacing-1)] focus:outline-none max-h-4 overflow-y-scroll scroll-smooth',
            'transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0',
          )}
        >
          {searchable && (
            <SearchBar query={query} onChange={onSearch} autoComplete={true} />
          )}
          {options.map((item) => (
            <ListboxOption
              key={item.id}
              value={item}
              className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:black/10 data-[selected]:bg-blue-100 hover:bg-blue-100"
            >
              <CheckIcon
                className={'invisible size-3 group-data-[selected]:visible'}
              />

              <div className="text-sm/6 black">{item.value}</div>
            </ListboxOption>
          ))}
          {pagination && (
            <SearchPagination
              hasNext={pagination.hasNext}
              hasPrevious={pagination.hasPrevious}
              onPrevious={pagination.onPrevious}
              onNext={pagination.onNext}
            />
          )}
        </ListboxOptions>
      </Listbox>
    </div>
  );
}
