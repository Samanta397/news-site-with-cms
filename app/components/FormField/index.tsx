import { ChangeEvent, ChangeEventHandler } from 'react';

interface FormFieldProps {
  name: string;
  htmlFor: string;
  label: string;
  type?: string;
  value: any;
  onChange?: (value: string) => void;
  required?: boolean;
}
export function FormField({
  name,
  htmlFor,
  label,
  type = 'text',
  value,
  onChange = () => {},
  required = false,
}: FormFieldProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <div>
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
        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        value={value}
        required
      />
    </div>
  );
}
