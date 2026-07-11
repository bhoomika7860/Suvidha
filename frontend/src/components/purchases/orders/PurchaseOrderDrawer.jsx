import {
  Building2,
  Calendar,
  IndianRupee,
  Package,
  X,
} from "lucide-react";

export default function PurchaseOrderDrawer({
  order,
  isOpen,
  onClose,
}) {

  if (!isOpen || !order) return null;

  return (

    <>

      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/30 z-40"
      />

      <div className="fixed top-0 right-0 h-screen w-full sm:w-[420px] bg-white shadow-2xl z-50 flex flex-col">

        <div className="flex items-center justify-between px-6 py-5 border-b">

          <h2 className="text-2xl font-bold">
            Purchase Order
          </h2>

          <button onClick={onClose}>
            <X />
          </button>

        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">

          <div className="flex gap-4">

            <Building2 className="text-blue-600" />

            <div>

              <p className="text-gray-500 text-sm">
                Supplier
              </p>

              <p className="font-semibold">
                {order.party}
              </p>

            </div>

          </div>

          <div className="flex gap-4">

            <Package className="text-blue-600" />

            <div>

              <p className="text-gray-500 text-sm">
                Total Items
              </p>

              <p className="font-semibold">
                {order.items}
              </p>

            </div>

          </div>

          <div className="flex gap-4">

            <IndianRupee className="text-blue-600" />

            <div>

              <p className="text-gray-500 text-sm">
                Expected Amount
              </p>

              <p className="font-semibold">
                ₹{order.expectedAmount.toLocaleString()}
              </p>

            </div>

          </div>

          <div className="flex gap-4">

            <Calendar className="text-blue-600" />

            <div>

              <p className="text-gray-500 text-sm">
                Expected Delivery
              </p>

              <p className="font-semibold">
                {order.expectedDate}
              </p>

            </div>

          </div>

          <div>

            <p className="text-gray-500 text-sm mb-2">
              Status
            </p>

            <span className="px-4 py-2 rounded-full bg-yellow-100 text-yellow-700">

              {order.status}

            </span>

          </div>

        </div>

        <div className="border-t p-6">

          <button
            onClick={onClose}
            className="w-full h-11 rounded-xl border"
          >
            Close
          </button>

        </div>

      </div>

    </>

  );

}