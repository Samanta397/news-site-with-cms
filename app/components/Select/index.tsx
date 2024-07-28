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

type SelectProps = {
  label: string;
  name: string;
  options: { id: string; value: string }[];
  value: { id: string; value: string } | { id: string; value: string }[];
  onSelect: (
    value: { id: string; value: string } | { id: string; value: string }[],
  ) => void;
  multiple?: boolean;
};

export function Select({
  label,
  name,
  options,
  value,
  onSelect,
  multiple = false,
}: SelectProps) {
  const [selected, setSelected] = useState<
    { id: string; value: string } | { id: string; value: string }[]
  >(value);

  useEffect(() => {
    onSelect(selected);
  }, [selected]);

  return (
    <div>
      <label className="block text-sm font-medium leading-4 text-gray-900 mb-2">
        {label}
      </label>
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
        </ListboxOptions>
      </Listbox>
    </div>
  );
}
