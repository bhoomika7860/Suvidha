import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  page,
  total,
  pageSize,
  onPageChange,
}) {
  const totalPages = Math.max(
    1,
    Math.ceil(Number(total || 0) / Number(pageSize || 10))
  );

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3.5 sm:p-4">
      <p className="text-xs font-medium text-slate-500 sm:text-sm">
        Page {page} of {totalPages}
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 sm:h-10 sm:w-10"
        >
          <ChevronLeft size={18} />
        </button>

        <button
          type="button"
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 sm:h-10 sm:w-10"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
