import React, { useState } from 'react';
import { SearchBar } from '~/components/SearchBar';

type SiteLayout = {
  children: React.ReactNode;
};
export function SiteLayout({ children }: SiteLayout) {
  const [query, setQuery] = useState('');
  return (
    <>
      <nav className="fixed top-0  w-full bg-white border-b-2 border-gray-200 ">
        <div className="my-0 mx-auto max-w-6xl">
          <div className="flex items-center justify-center my-2 sm:justify-between">
            <img
              src="https://tailwindui.com/img/logos/mark.svg"
              alt="Your Company"
              className="h-8 w-auto max-sm:hidden"
            />
            <div className="flex  shrink-0 items-center ml-4">
              <SearchBar query={query} onChange={setQuery} />
            </div>
          </div>
        </div>
      </nav>

      <div className="my-0 mx-auto max-w-6xl">
        <div className="py-4 mt-16 ">{children}</div>
      </div>
    </>
  );
}
