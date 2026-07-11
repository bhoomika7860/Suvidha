import {
  X,
  Wallet,
  IndianRupee,
  User,
  Clock3,
  FileText,
} from "lucide-react";

export default function ExpenseDrawer({
  expense,
  isOpen,
  onClose,
}) {

  if (!isOpen || !expense) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/30 z-40"
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-screen w-[500px] bg-white shadow-2xl z-50 overflow-y-auto">

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b">

          <div>

            <h2 className="text-2xl font-bold">
              Expense Details
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Daily Store Expense
            </p>

          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <X size={20} />
          </button>

        </div>

        {/* Body */}

        <div className="p-6 space-y-6">

          <div className="flex items-center gap-3">

            <Wallet
              size={20}
              className="text-orange-600"
            />

            <div>

              <p className="text-xs text-gray-500">
                Expense Type
              </p>

              <p className="font-medium">
                {expense.type}
              </p>

            </div>

          </div>

          <div className="flex items-center gap-3">

            <IndianRupee
              size={20}
              className="text-green-600"
            />

            <div>

              <p className="text-xs text-gray-500">
                Amount
              </p>

              <p className="font-medium">
                ₹{expense.amount.toLocaleString()}
              </p>

            </div>

          </div>

          <div className="flex items-center gap-3">

            <User
              size={20}
              className="text-blue-600"
            />

            <div>

              <p className="text-xs text-gray-500">
                Added By
              </p>

              <p className="font-medium">
                {expense.addedBy}
              </p>

            </div>

          </div>

          <div className="flex items-center gap-3">

            <Clock3
              size={20}
              className="text-violet-600"
            />

            <div>

              <p className="text-xs text-gray-500">
                Time
              </p>

              <p className="font-medium">
                {expense.time}
              </p>

            </div>

          </div>

          <div>

            <div className="flex items-center gap-2 mb-3">

              <FileText
                size={18}
                className="text-gray-500"
              />

              <h3 className="font-semibold">
                Remarks
              </h3>

            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-gray-700">

              {expense.remarks}

            </div>

          </div>

          <button
            onClick={onClose}
            className="w-full h-11 rounded-xl border border-gray-200 hover:bg-gray-50 transition"
          >
            Close
          </button>

        </div>

      </div>

    </>
  );
}