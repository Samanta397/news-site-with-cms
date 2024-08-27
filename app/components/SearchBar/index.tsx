import { Button } from '~/components/Button';
import { Form } from '@remix-run/react';

export function SearchBar() {
  return (
    <Form method="post">
      <label
        htmlFor="default-search"
        className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
      >
        Search
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <input
          type="search"
          id="default-search"
          className="block w-full p-4 pr-20 ps-10 text-sm text-slate-800 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 focus-visible:ring focus-visible:outline focus-visible:outline-0 focus-visible:ring-indigo-300"
          placeholder="Search..."
          name="search"
          required
        />
        <Button
          type="submit"
          label={'Search'}
          customStyles={'absolute end-2.5 bottom-2.5'}
        />
      </div>
    </Form>
  );
}
