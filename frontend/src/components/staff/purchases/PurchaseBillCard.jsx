import {
  Building2,
  Receipt,
  IndianRupee,
  ChevronRight,
} from "lucide-react";

export default function PurchaseBillCard({
  purchase,
  onClick,
}) {
  function getStatusColor(status) {
    switch (status) {
      case "received":
        return "bg-blue-50 text-blue-600";

      case "waiting-entry":
        return "bg-violet-50 text-violet-600";

      case "completed":
        return "bg-green-50 text-green-600";

      default:
        return "bg-gray-50 text-gray-600";
    }
  }

  function getStatusText(status) {
    if (!status) return "-";

    return status
      .replace("-", " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  return (
    <button
      onClick={onClick}
      className="
        w-full
        bg-white
        border border-gray-200
        rounded-xl
        px-3
        py-3
        text-left
        active:bg-gray-50
        transition
      "
    >
      <div className="flex items-center gap-3">

        {/* Icon */}
        <div className="w-10 h-10 shrink-0 rounded-lg bg-blue-50 flex items-center justify-center">
          <Building2
            size={18}
            className="text-blue-600"
          />
        </div>

        {/* Main Information */}
        <div className="flex-1 min-w-0">

          {/* Supplier + Bill */}
          <div className="flex items-start justify-between gap-2">

            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 truncate">
                {purchase.supplier_name || "-"}
              </h3>

              <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500">
                <Receipt size={12} />

                <span>
                  {purchase.bill_number || "-"}
                </span>
              </div>
            </div>

            <ChevronRight
              size={17}
              className="text-gray-400 shrink-0 mt-1"
            />

          </div>

          {/* Bottom Row */}
          <div className="flex items-center justify-between gap-2 mt-2">

            <div className="flex items-center gap-1">

              <IndianRupee
                size={13}
                className="text-green-600"
              />

              <span className="text-sm font-semibold text-gray-900">
                {Number(
                  purchase.purchase_amount || 0
                ).toLocaleString("en-IN")}
              </span>

            </div>

            <span
              className={`
                inline-flex
                px-2.5
                py-1
                rounded-full
                text-[11px]
                font-medium
                ${getStatusColor(
                  purchase.status
                )}
              `}
            >
              {getStatusText(
                purchase.status
              )}
            </span>

          </div>

        </div>

      </div>
    </button>
  );
}