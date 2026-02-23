import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  handleNextPage: () => void;
  handlePrevPage: () => void;
  onPageChange: (page: number) => void;
}

export default function PaginationComponent({
  currentPage,
  totalPages,
  handleNextPage,
  handlePrevPage,
  onPageChange,
}: PaginationProps) {
  const generatePageNumbers = () => {
    const pageNumbers = [];
    // const maxPagesToShow = 5;
    const startPage = Math.max(currentPage - 2, 1);
    const endPage = Math.min(currentPage + 2, totalPages);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <Pagination className={`py-5 ${totalPages <= 1 ? "hidden" : ""}`}>
      <PaginationContent>
        {/* Previous Button */}
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={handlePrevPage}
            className={
              currentPage === 1 ? "opacity-50 pointer-events-none" : ""
            }
          />
        </PaginationItem>

        {/* First Page + Ellipsis */}
        {currentPage > 3 && (
          <>
            <PaginationItem>
              <PaginationLink href="#" onClick={() => onPageChange(1)}>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationEllipsis />
          </>
        )}

        {/* Page Numbers */}
        {pageNumbers.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href="#"
              onClick={() => onPageChange(page)}
              isActive={page === currentPage}
              className={`${
                page === currentPage
                  ? "bg-gray-300 rounded-full px-3 py-1"
                  : ""
              }`}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* Last Page + Ellipsis */}
        {currentPage < totalPages - 2 && (
          <>
            <PaginationEllipsis />
            <PaginationItem>
              <PaginationLink
                href="#"
                onClick={() => onPageChange(totalPages)}
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        {/* Next Button */}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={handleNextPage}
            className={
              currentPage === totalPages ? "opacity-50 pointer-events-none" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
