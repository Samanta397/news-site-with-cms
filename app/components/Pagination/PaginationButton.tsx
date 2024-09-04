import React from 'react';
import { twMerge } from 'tailwind-merge';

type PaginationButtonType = {
  label?: string;
  icon?: React.JSX.Element;
  isActive?: boolean;
  isPrevious?: boolean;
  isNext?: boolean;
  to?: string;
  disabled?: boolean;
};

export function PaginationButton({
  label,
  icon,
  isActive = false,
  isPrevious = false,
  isNext = false,
  to,
  disabled,
}: PaginationButtonType) {
  const styles = twMerge(
    'flex items-center justify-center px-3 h-8 leading-tight border',
    isActive &&
      'z-10 text-indigo-600 border-indigo-300 bg-indigo-50 hover:bg-indigo-100 hover:text-indigo-700',
    !isActive &&
      'text-gray-700 bg-white  border-gray-300 hover:bg-gray-100 hover:text-gray-700 ',
    isPrevious && 'rounded-s-lg',
    isNext && 'rounded-e-lg',
    disabled && 'pointer-events-none text-gray-300 border-gray-200',
  );
  return (
    <li>
      <a href={to} className={styles}>
        <span className="sr-only" />
        {label}
        {icon}
      </a>
    </li>
  );
}
