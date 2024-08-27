import React from 'react';
import { Link } from '@remix-run/react';
import { ArrowRightIcon } from '~/icons/ArrowRightIcon';

type BreadcrumbType = {
  href: string;
  label: string;
};

type BreadcrumbsType = {
  breadcrumbs: BreadcrumbType[];
};

export function Breadcrumbs({ breadcrumbs = [] }: BreadcrumbsType) {
  return (
    <nav className="flex mb-8" aria-label="Breadcrumb">
      <ol className="inline-flex items-center rtl:space-x-reverse">
        {breadcrumbs.map((breadcrumb, i) => (
          <li className="inline-flex items-center" key={i}>
            {i !== 0 && <ArrowRightIcon />}
            <Link
              to={breadcrumb.href}
              className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              <span>{breadcrumb.label}</span>
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
