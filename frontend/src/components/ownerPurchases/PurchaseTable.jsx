import { Package } from "lucide-react";

const STATUS_STYLES = {
  received: {
    label: "Received",
    className: "bg-emerald-50 text-emerald-700",
  },
  checking: {
    label: "Waiting Check",
    className: "bg-amber-50 text-amber-700",
  },
  entered: {
    label: "Waiting Entry",
    className: "bg-purple-50 text-purple-700",
  },
  completed: {
    label: "Completed",
    className: "bg-blue-50 text-blue-700",
  },
};

function getStatus(status) {
  return (
    STATUS_STYLES[status] || {
      label: status || "Unknown",
      className: "bg-gray-100 text-gray-700",
    }
  );
}

export default function PurchaseTable({
  purchases,
  loading,
  onRowClick,
}) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
        Loading purchases...
      </div>
    );
  }

  if (!purchases.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 sm:p-16">
        <div className="flex flex-col items-center text-center">
          <Package
            size={52}
            className="text-slate-300 sm:h-[60px] sm:w-[60px]"
          />

          <h2 className="mt-4 text-lg font-bold sm:mt-5 sm:text-xl">
            No Purchases Found
          </h2>

          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            Purchase bills will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Desktop: one row containing only purchase name and status */}
      <div className="hidden lg:block">
        <table className="w-full">
          <tbody>
            {purchases.map((purchase) => {
              const status = getStatus(purchase.status);

              return (
                <tr
                  key={purchase.id}
                  onClick={() => onRowClick?.(purchase)}
                  className="cursor-pointer border-b border-slate-100 transition-colors last:border-b-0 hover:bg-blue-50"
                >
                  <td className="px-6 py-4">
                    <p className="truncate font-semibold text-slate-900">
                      {purchase.supplier_name ||
                        purchase.product_name ||
                        "Unknown Purchase"}
                    </p>
                  </td>

                  <td className="w-40 px-6 py-4 text-right">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile: one line containing only purchase name and status */}
      <div className="divide-y divide-slate-100 lg:hidden">
        {purchases.map((purchase) => {
          const status = getStatus(purchase.status);

          return (
            <button
              key={purchase.id}
              type="button"
              onClick={() => onRowClick?.(purchase)}
              className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left transition active:bg-blue-50"
            >
              <p className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-900">
                {purchase.supplier_name ||
                  purchase.product_name ||
                  "Unknown Purchase"}
              </p>

              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${status.className}`}
              >
                {status.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
