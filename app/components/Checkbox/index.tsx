type CheckboxProps = {
  label: string;
  name: string;
  htmlFor: string;
};

export function Checkbox({ label, name, htmlFor }: CheckboxProps) {
  return (
    <div className="relative flex gap-x-3">
      <div className="flex h-6 items-center">
        <input
          id={htmlFor}
          name={name}
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
        />
      </div>
      <div className="text-sm leading-6">
        <label htmlFor={htmlFor} className="font-medium text-gray-900">
          {label}
        </label>
        {/*<p className="text-gray-500">*/}
        {/*  Get notified when someones posts a comment on a posting.*/}
        {/*</p>*/}
      </div>
    </div>
  );
}
