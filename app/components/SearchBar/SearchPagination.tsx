import React from 'react';
import { Button } from '~/components/Button';
import { ArrowLeftIcon } from '~/icons/ArrowLeftIcon';
import { ArrowRightIcon } from '~/icons/ArrowRightIcon';
import { PaginationType } from '~/components/Table';

export function SearchPagination({
  hasNext,
  hasPrevious,
  onNext,
  onPrevious,
}: PaginationType) {
  return (
    <div
      className={
        'p-2 text-slate-800 border border-gray-300 rounded-lg bg-gray-50'
      }
    >
      <div className={'flex justify-center gap-2'}>
        <Button
          icon={<ArrowLeftIcon />}
          tone={'primary'}
          disabled={!hasPrevious}
          onClick={onPrevious}
        />
        <Button
          icon={<ArrowRightIcon />}
          tone={'primary'}
          disabled={!hasNext}
          onClick={onNext}
        />
      </div>
    </div>
  );
}
