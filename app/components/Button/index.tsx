import { twMerge } from 'tailwind-merge';
import React from 'react';

type ButtonProps = {
  type?: HTMLButtonElement['type'];
  label?: string;
  onClick?: () => void;
  fullWidth?: boolean;
  disabled?: boolean;
  tone?: 'default' | 'critical' | 'success' | 'none';
  bulk?: boolean;
  icon?: React.JSX.Element;
};

export function Button({
  type = 'button',
  label,
  onClick,
  fullWidth = false,
  disabled = false,
  tone = 'default',
  icon,
  bulk = false,
}: ButtonProps) {
  const styles = twMerge(
    'flex justify-center rounded-md  px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
    tone === 'default' &&
      'bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-indigo-600',
    tone === 'critical' &&
      'bg-red-600 hover:bg-red-500 focus-visible:outline-red-600',
    tone === 'success' &&
      'bg-emerald-600 hover:bg-emerald-500 focus-visible:outline-emerald-600',
    tone === 'none' &&
      'bg-transparent hover:bg-slate-200 text-slate-800 shadow-none',
    bulk && 'px-3 py-0',

    fullWidth && 'w-full',
    disabled && 'bg-gray-300 hover:bg-gray-300',
  );

  return (
    <button
      type={type}
      onClick={onClick}
      className={styles}
      disabled={disabled}
    >
      {label}
      {icon}
    </button>
  );
}
