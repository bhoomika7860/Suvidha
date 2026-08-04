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
        return "bg-blue-100 text-blue-700";

      case "waiting-entry":
        return "bg-violet-100 text-violet-700";

      case "completed":
        return "bg-green-100 text-green-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  function getStatusText(status) {
    return status
      .replace("-", " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  return (
    <button
      onClick={onClick}
      className="w-full rounded-2xl border border-gray-200 bg-white shadow-sm p-4 active:scale-[0.99] transition"
    >
      <div className="flex justify-between items-start">

        {/* Left */}

        <div className="flex gap-4 flex-1">

          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <Building2
              size={22}
              className="text-blue-600"
            />
          </div>

          <div className="text-left flex-1 min-w-0">

            {/* Supplier */}

            <h3 className="font-semibold break-words">
              {purchase.supplier_name}
            </h3>

            {/* Bill */}

            <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">

              <Receipt size={15} />

              <span>
                {purchase.bill_number}
              </span>

            </div>

            {/* Amount */}

            <div className="flex items-center gap-2 mt-2">

              <IndianRupee
                size={15}
                className="text-green-600"
              />

              <span className="font-semibold">
                ₹
                {Number(
                  purchase.purchase_amount
                ).toLocaleString("en-IN")}
              </span>

            </div>

            {/* Status */}

            <span
              className={`inline-flex mt-3 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                purchase.status
              )}`}
            >
              {getStatusText(
                purchase.status
              )}
            </span>

          </div>

        </div>

        {/* Arrow */}

        <ChevronRight
          size={20}
          className="text-gray-400 shrink-0 ml-3"
        />

      </div>
    </button>
  );
}