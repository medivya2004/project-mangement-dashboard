import React, { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const DOTS = "...";

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const paginationRange = useMemo(() => {
    const siblingCount = 1;
    const totalPageNumbers = siblingCount * 2 + 5;

    if (totalPages <= totalPageNumbers) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPages - 2;

    const pages: (number | string)[] = [];

    if (!showLeftDots && showRightDots) {
      const leftRange = Array.from({ length: 3 }, (_, i) => i + 1);
      pages.push(...leftRange, DOTS, totalPages);
    }

    else if (showLeftDots && !showRightDots) {
      const rightRange = Array.from(
        { length: 3 },
        (_, i) => totalPages - 2 + i
      );
      pages.push(1, DOTS, ...rightRange);
    }

    else if (showLeftDots && showRightDots) {
      pages.push(
        1,
        DOTS,
        ...Array.from(
          { length: rightSiblingIndex - leftSiblingIndex + 1 },
          (_, i) => leftSiblingIndex + i
        ),
        DOTS,
        totalPages
      );
    }

    return pages;
  }, [currentPage, totalPages]);

  if (totalPages <= 1) return null;

  const handleChange = (page: number) => {
    if (page === currentPage) return;
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8">

      {/* Previous */}
      <button
        onClick={() => handleChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 border rounded-lg disabled:opacity-50"
      >
        <ChevronLeft size={20} />
      </button>

      {/* Page Numbers */}
      {paginationRange.map((page, index) => {
        if (page === DOTS) {
          return (
            <span key={index} className="px-2 text-gray-400">
              ...
            </span>
          );
        }

        return (
          <button
            key={page}
            onClick={() => handleChange(page as number)}
            className={`min-w-[40px] h-[40px] rounded-lg font-medium ${
              currentPage === page
                ? "bg-blue-600 text-white"
                : "border hover:bg-gray-50"
            }`}
          >
            {page}
          </button>
        );
      })}

      {/* Next */}
      <button
        onClick={() => handleChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 border rounded-lg disabled:opacity-50"
      >
        <ChevronRight size={20} />
      </button>

    </div>
  );
};