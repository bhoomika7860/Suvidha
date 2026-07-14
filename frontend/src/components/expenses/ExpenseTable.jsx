export default function ExpenseTable({
  expenses,
}) {
  return (
    <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">

      <div className="grid grid-cols-5 bg-gray-50 px-6 py-4 border-b font-semibold text-sm text-gray-600">
        <div>Expense Type</div>
        <div>Amount</div>
        <div>Created By</div>
        <div>Created At</div>
        <div>Remarks</div>
      </div>

      {expenses.length === 0 ? (
        <div className="py-20 text-center text-gray-500">
          No Expenses Found
        </div>
      ) : (
        expenses.map((expense) => (
          <div
            key={expense.id}
            className="grid grid-cols-5 px-6 py-4 border-b hover:bg-gray-50"
          >
            <div>{expense.expense_type}</div>

            <div className="font-semibold">
              ₹{expense.amount}
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
          </div>
        ))
      )}

    </div>
  );
}