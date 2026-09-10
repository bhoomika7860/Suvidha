import { Pencil, Power, Truck } from "lucide-react";

export default function SupplierTable({
  suppliers,
  loading,
  onEdit,
  onToggle,
}) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
        Loading suppliers...
      </div>
    );
  }

  if (!suppliers.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
        No suppliers found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Desktop */}
      <div className="hidden lg:block">
        <div className="divide-y divide-slate-100">
          {suppliers.map((supplier) => (
            <div
              key={supplier.id}
              className="flex min-h-[64px] items-center justify-between gap-4 px-6 py-3 transition-colors hover:bg-slate-50"
            >
              <div className="flex min-w-0 items-center gap-3">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {supplier.name}
                </p>

                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                    supplier.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {supplier.is_active ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => onEdit?.(supplier)}
                  className="flex h-9 items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  <Pencil size={15} />
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => onToggle?.(supplier)}
                  className={`flex h-9 items-center gap-2 rounded-xl px-3 text-sm font-medium transition ${
                    supplier.is_active
                      ? "border border-red-200 text-red-600 hover:bg-red-50"
                      : "border border-green-200 text-green-600 hover:bg-green-50"
                  }`}
                >
                  <Power size={15} />
                  {supplier.is_active ? "Deactivate" : "Activate"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile */}
      <div className="divide-y divide-slate-100 lg:hidden">
        {suppliers.map((supplier) => (
          <div
            key={supplier.id}
            className="px-4 py-3.5"
          >
            <div className="flex min-h-[40px] items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2.5">
                <p className="min-w-0 truncate text-sm font-semibold text-slate-900">
                  {supplier.name}
                </p>

                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                    supplier.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {supplier.is_active ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="flex shrink-0 items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onEdit?.(supplier)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition active:bg-slate-50"
                  aria-label={`Edit ${supplier.name}`}
                >
                  <Pencil size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => onToggle?.(supplier)}
                  className={`flex h-9 w-9 items-center justify-center rounded-xl border transition active:bg-slate-50 ${
                    supplier.is_active
                      ? "border-red-200 text-red-600"
                      : "border-green-200 text-green-600"
                  }`}
                  aria-label={
                    supplier.is_active
                      ? `Deactivate ${supplier.name}`
                      : `Activate ${supplier.name}`
                  }
                >
                  <Power size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
