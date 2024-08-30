import {
  ChangeEvent,
  HTMLInputTypeAttribute,
  InputHTMLAttributes,
} from 'react';
import { twMerge } from 'tailwind-merge';

interface FormFieldProps {
  name: string;
  htmlFor: string;
  label: string;
  type?: HTMLInputTypeAttribute;
  value: string | number;
  onChange?: (value: any) => void;
  required?: boolean;
  hidden?: boolean;
}

export function FormField({
  name,
  htmlFor,
  label,
  type = 'text',
  value,
  onChange = () => {},
  required = false,
  hidden = false,
}: FormFieldProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (type === 'number') {
      onChange(Number(event.target.value));
    } else {
      onChange(event.target.value);
    }
  };

  const styles = twMerge('w-full', hidden && 'hidden');

  //TODO: add require state
  //TODO: add error state
  return (
    <div className={styles}>
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium leading-8 text-gray-900"
      >
        {label}
      </label>
      <input
        onChange={handleChange}
        type={type}
        id={htmlFor}
        name={name}
        className="block w-full rounded-md border-0 px-2.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        value={value}
        required
        role={name}
      />
    </div>
  );
}
