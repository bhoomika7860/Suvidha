import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  page,
  total,
  pageSize,
  onPageChange,
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">

      <p className="text-sm text-slate-500">
        Page {page} of {totalPages}
      </p>

      <div className="flex gap-2">

        <button
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-lg border px-3 py-2 disabled:opacity-40"
        >
          <ChevronLeft size={18} />
        </button>

        <button
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded-lg border px-3 py-2 disabled:opacity-40"
        >
          <ChevronRight size={18} />
        </button>

      </div>
    </div>
  );
}