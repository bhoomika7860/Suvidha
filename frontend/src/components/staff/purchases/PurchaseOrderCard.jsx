import {
  Building2,
  Calendar,
  ChevronRight,
} from "lucide-react";

import { formatDate } from "../../../utils/formatDate";

export default function PurchaseOrderCard({
  order,
  onClick,
}) {
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

          <div className="text-left min-w-0 flex-1">

            <h3 className="font-semibold text-base break-words">
              {order.supplier_name}
            </h3>

            <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">

              <Calendar size={15} />

              <span>
                {formatDate(order.expected_date)}
              </span>

            </div>

            <span
              className={`inline-flex mt-3 px-3 py-1 rounded-full text-xs font-medium ${
                order.status === "Pending"
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {order.status}
            </span>

          </div>

        </div>

        {/* Right */}

        <ChevronRight
          size={20}
          className="text-gray-400 shrink-0 ml-3"
        />

      </div>
    </button>
  );
}