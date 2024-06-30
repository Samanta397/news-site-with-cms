import { ChangeEvent, useState } from 'react';

type SelectProps = {
  label: string;
  name: string;
  options: string[];
  value: string;
  onSelect: (value: string) => void;
};

export function Select({ label, name, options, value, onSelect }: SelectProps) {
  const handleSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    onSelect(event.target.value);
  };

  return (
    <div>
      <label className="block text-sm font-medium leading-4 text-gray-900">
        {label}
      </label>
      <div className="mt-2">
        <select
          id={name}
          name={name}
          value={value}
          onChange={handleSelect}
          className="block w-full bg-white p-2.5 rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        >
          {options.map((item, id) => (
            <option key={`${item}_${id}`}>{item}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
