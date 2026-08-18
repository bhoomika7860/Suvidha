import {
  Pencil,
  Trash2,
  Wallet,
  IndianRupee,
  User,
  Clock3,
} from "lucide-react";

export default function ExpenseTable({
  expenses,
  onEdit,
  onDelete,
}) {
  return (
    <div>

      {/* =====================================================
          DESKTOP TABLE
      ===================================================== */}

      <div className="hidden lg:block overflow-hidden rounded-2xl border bg-white shadow-sm">

        <div className="grid grid-cols-6 border-b bg-gray-50 px-6 py-4 text-sm font-semibold text-gray-600">

          <div>Expense Type</div>

          <div>Amount</div>

          <div>Created By</div>

          <div>Created At</div>

          <div>Remarks</div>

          <div className="text-center">
            Actions
          </div>

        </div>

        {expenses.length === 0 ? (

          <div className="py-20 text-center text-gray-500">
            No Expenses Found
          </div>

        ) : (

          expenses.map((expense) => (

            <div
              key={expense.id}
              className="grid grid-cols-6 items-center border-b px-6 py-4 hover:bg-gray-50"
            >

              <div>
                {expense.expense_type}
              </div>

              <div className="font-semibold">
                ₹
                {Number(
                  expense.amount
                ).toLocaleString("en-IN")}
              </div>

              <div>
                {expense.created_by_name}
              </div>

              <div>
                {new Date(
                  expense.created_at
                ).toLocaleString()}
              </div>

              <div>
                {expense.remarks || "-"}
              </div>

              <div className="flex justify-center gap-2">

                <button
                  onClick={() =>
                    onEdit(expense)
                  }
                  className="rounded-lg bg-amber-500 p-2 text-white transition hover:bg-amber-600"
                  title="Edit Expense"
                >
                  <Pencil size={16} />
                </button>

                {onDelete && (
                  <button
                    onClick={() =>
                      onDelete(expense.id)
                    }
                    className="rounded-lg bg-red-600 p-2 text-white transition hover:bg-red-700"
                    title="Delete Expense"
                  >
                    <Trash2 size={16} />
                  </button>
                )}

              </div>

            </div>

          ))

        )}

      </div>


      {/* =====================================================
          MOBILE LIST
      ===================================================== */}

      <div className="lg:hidden space-y-2">

        {expenses.length === 0 ? (

          <div className="bg-white border border-gray-200 rounded-2xl py-12 text-center text-sm text-gray-500">
            No Expenses Found
          </div>

        ) : (

          expenses.map((expense) => (

            <div
              key={expense.id}
              className="bg-white border border-gray-200 rounded-xl px-3 py-3 shadow-sm"
            >

              {/* Top Row */}

              <div className="flex items-start justify-between gap-3">

                <div className="flex items-start gap-3 min-w-0">

                  <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">

                    <Wallet
                      size={17}
                      className="text-orange-600"
                    />

                  </div>

                  <div className="min-w-0">

                    <p className="font-semibold text-sm text-gray-900 truncate">
                      {expense.expense_type}
                    </p>

                    <p className="text-xs text-gray-500 mt-0.5 truncate">
                      {expense.created_by_name || "-"}
                    </p>

                  </div>

                </div>


                {/* Amount */}

                <div className="shrink-0 text-right">

                  <p className="text-sm font-bold text-gray-900">
                    ₹
                    {Number(
                      expense.amount || 0
                    ).toLocaleString("en-IN")}
                  </p>

                </div>

              </div>


              {/* Bottom Information */}

              <div className="mt-2.5 pt-2.5 border-t border-gray-100 flex items-center justify-between gap-2">

                <div className="flex items-center gap-3 min-w-0">

                  <div className="flex items-center gap-1 text-xs text-gray-500">

                    <Clock3 size={13} />

                    <span>
                      {new Date(
                        expense.created_at
                      ).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                        }
                      )}
                    </span>

                  </div>

                  {expense.remarks && (
                    <span className="text-xs text-gray-500 truncate max-w-[120px]">
                      {expense.remarks}
                    </span>
                  )}

                </div>


                {/* Actions */}

                <div className="flex items-center gap-1.5 shrink-0">

                  <button
                    onClick={() =>
                      onEdit(expense)
                    }
                    className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center"
                    title="Edit Expense"
                  >
                    <Pencil size={14} />
                  </button>

                  {onDelete && (
                    <button
                      onClick={() =>
                        onDelete(expense.id)
                      }
                      className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center"
                      title="Delete Expense"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}

                </div>

              </div>

            </div>

          ))

        )}

      </div>

    </div>
  );
}