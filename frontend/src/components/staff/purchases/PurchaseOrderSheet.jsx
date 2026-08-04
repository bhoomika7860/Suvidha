import {
  X,
  Building2,
  Calendar,
  Package,
  CheckCircle2,
  Clock3,
} from "lucide-react";

import { formatDate } from "../../../utils/formatDate";

export default function PurchaseOrderSheet({
  order,
  isOpen,
  onClose,
  onReceiveBill,
}) {
  if (!isOpen || !order) return null;

  return (
    <>
      {/* Backdrop */}

      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 z-40"
      />

      {/* Bottom Sheet */}

      <div className="fixed inset-0 z-50 flex items-end">

        <div className="w-full h-[96vh] bg-white rounded-t-[30px] flex flex-col animate-slide-up">

          {/* Handle */}

          <div className="flex justify-center pt-3 pb-2">
            <div className="w-14 h-1.5 rounded-full bg-gray-300" />
          </div>

          {/* Header */}

          <div className="px-6 pb-5 border-b flex justify-between items-start">

            <div>

              <h1 className="text-3xl font-bold">
                Purchase Order
              </h1>

              <p className="text-gray-500 mt-2">
                Supplier Information
              </p>

            </div>

            <button
              onClick={onClose}
              className="w-11 h-11 rounded-full hover:bg-gray-100 flex items-center justify-center"
            >
              <X size={24} />
            </button>

          </div>

          {/* Body */}

          <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8">

            {/* Supplier */}

            <div className="flex gap-5">

              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">

                <Building2
                  size={20}
                  className="text-blue-600"
                />

              </div>

              <div>

                <p className="text-sm text-gray-500">
                  Supplier
                </p>

                <p className="font-semibold text-lg">
                  {order.supplier_name}
                </p>

              </div>

            </div>

            {/* Expected Date */}

            <div className="flex gap-5">

              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">

                <Calendar
                  size={20}
                  className="text-blue-600"
                />

              </div>

              <div>

                <p className="text-sm text-gray-500">
                  Expected Delivery
                </p>

                <p className="font-semibold text-lg">
                  {formatDate(order.expected_date)}
                </p>

              </div>

            </div>

            {/* Items */}

            <div className="flex gap-5">

              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">

                <Package
                  size={20}
                  className="text-blue-600"
                />

              </div>

              <div>

                <p className="text-sm text-gray-500">
                  Total Items
                </p>

                <p className="font-semibold text-lg">
                  {order.items?.length || 0}
                </p>

              </div>

            </div>

            {/* Status */}

            <div>

              <p className="text-sm text-gray-500 mb-3">
                Status
              </p>

              <span
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                  order.status === "Pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
              >

                {order.status === "Pending" ? (
                  <Clock3 size={16} />
                ) : (
                  <CheckCircle2 size={16} />
                )}

                {order.status}

              </span>

            </div>

          </div>

          {/* Footer */}

          <div className="border-t bg-white px-5 pt-5 pb-[calc(env(safe-area-inset-bottom)+20px)] space-y-3">

            {order.status === "Pending" && (

              <button
                onClick={() => {
                  onReceiveBill(order);
                  onClose();
                }}
                className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                Receive Bill
              </button>

            )}

            <button
              onClick={onClose}
              className="w-full h-14 rounded-2xl border border-gray-300 font-medium"
            >
              Close
            </button>

          </div>

        </div>

      </div>

    </>
  );
}