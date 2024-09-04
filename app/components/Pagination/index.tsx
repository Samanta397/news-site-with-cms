import { useMemo } from 'react';
import { ArrowLeftIcon } from '~/icons/ArrowLeftIcon';
import { ArrowRightIcon } from '~/icons/ArrowRightIcon';
import { PaginationButton } from '~/components/Pagination/PaginationButton';

type PaginationType = {
  currentPage: number;
  totalPages: number;
  hasNext?: boolean;
  hasPrev?: boolean;
  url: string;
};

export function Pagination({
  currentPage,
  totalPages,
  hasNext,
  hasPrev,
  url,
}: PaginationType) {
  const pages = useMemo(() => {
    const pagesArr = [];
    for (let i = 1; i <= totalPages; i++) {
      pagesArr.push(
        <PaginationButton
          key={i}
          isActive={i === currentPage}
          label={i.toString()}
          to={`${url}?page=${i}`}
          aria-label={`Page number ${i}`}
        />,
      );
    }

    return pagesArr;
  }, [totalPages]);

  return (
    <nav aria-label="Page navigation example">
      <ul className="flex items-center -space-x-px h-8 text-sm justify-center">
        <PaginationButton
          icon={<ArrowLeftIcon />}
          isPrevious={true}
          disabled={!hasPrev}
          to={`${url}?page=${currentPage - 1}`}
          aria-label="Previous page"
        />
        {pages}
        <PaginationButton
          icon={<ArrowRightIcon />}
          isNext={true}
          disabled={!hasNext}
          to={`${url}?page=${currentPage + 1}`}
          aria-label="Next page"
        />
      </ul>
    </nav>
  );
}
