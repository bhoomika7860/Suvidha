import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  if (totalPages <= 1) {
    return null;
  }

  // Keep the desktop pagination useful without rendering
  // hundreds of page buttons when there are many pages.
  const getPages = () => {
    if (totalPages <= 7) {
      return Array.from(
        { length: totalPages },
        (_, index) => index + 1
      );
    }

    const pages = [1];

    if (currentPage > 4) {
      pages.push("...");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(
      totalPages - 1,
      currentPage + 1
    );

    for (let page = start; page <= end; page += 1) {
      pages.push(page);
    }

    if (currentPage < totalPages - 3) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  };

  const pages = getPages();

  return (
    <div className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3.5 sm:justify-center sm:gap-3 sm:p-4">
      {/* Mobile */}
      <div className="flex w-full items-center justify-between sm:hidden">
        <p className="text-xs font-medium text-slate-500">
          Page {currentPage} of {totalPages}
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() =>
              onPageChange(currentPage - 1)
            }
            aria-label="Previous page"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={18} />
          </button>

          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() =>
              onPageChange(currentPage + 1)
            }
            aria-label="Next page"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden items-center justify-center gap-3 sm:flex">
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() =>
            onPageChange(currentPage - 1)
          }
          className={`flex h-10 items-center gap-2 rounded-xl border px-4 transition ${
            currentPage === 1
              ? "cursor-not-allowed opacity-50"
              : "hover:bg-gray-50"
          }`}
        >
          <ChevronLeft size={18} />
          Previous
        </button>

        <div className="flex items-center gap-2">
          {pages.map((page, index) =>
            page === "..." ? (
              <span
                key={`ellipsis-${index}`}
                className="flex h-10 w-10 items-center justify-center text-sm text-gray-500"
              >
                ...
              </span>
            ) : (
              <button
                key={page}
                type="button"
                onClick={() =>
                  onPageChange(page)
                }
                className={`h-10 w-10 rounded-xl font-medium transition ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            )
          )}
        </div>

        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() =>
            onPageChange(currentPage + 1)
          }
          className={`flex h-10 items-center gap-2 rounded-xl border px-4 transition ${
            currentPage === totalPages
              ? "cursor-not-allowed opacity-50"
              : "hover:bg-gray-50"
          }`}
        >
          Next
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
