import React from 'react';
import { twMerge } from 'tailwind-merge';

type CardProps = {
  children: React.ReactNode;
  width?: 'w-1/4' | 'w-3/4';
  centered?: boolean;
  gap?: boolean;
};

export function Card({ children, width, centered, gap }: CardProps) {
  const wrapperStyles = twMerge(
    'flex border rounded-lg border-gray-300 p-0.5',
    width === 'w-1/4' && 'w-full lg:w-1/4',
    width === 'w-3/4' && 'w-full lg:w-3/4',
  );

  const styles = twMerge(
    'flex w-full h-full flex-col px-8 py-12 lg:px-8 bg-white',
    centered && 'justify-center',
    gap && 'gap-2',
  );

  return (
    <div className={wrapperStyles}>
      <div className={styles}>{children}</div>
    </div>
  );
}
