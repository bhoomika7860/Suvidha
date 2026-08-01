import { Pencil, Trash2 } from "lucide-react";

export default function ExpenseTable({
  expenses,
  onEdit,
  onDelete,
}) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">

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
              ₹{Number(expense.amount).toLocaleString("en-IN")}
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
                onClick={() => onEdit(expense)}
                className="rounded-lg bg-amber-500 p-2 text-white transition hover:bg-amber-600"
                title="Edit Expense"
              >
                <Pencil size={16} />
              </button>

              <button
                onClick={() => onDelete(expense.id)}
                className="rounded-lg bg-red-600 p-2 text-white transition hover:bg-red-700"
                title="Delete Expense"
              >
                <Trash2 size={16} />
              </button>

            </div>

          </div>

        ))

      )}

    </div>
  );
}