import { Wallet } from "lucide-react";

export default function ExpenseStats({
  expenses = [],
}) {
  const total = expenses.reduce(
    (sum, expense) =>
      sum + Number(expense.amount || 0),
    0
  );

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 lg:p-5 shadow-sm">

      <div className="flex justify-between items-center gap-3">

        <div className="min-w-0">

          <p className="text-sm text-gray-500">
            Today's Expenses
          </p>

          <h2 className="text-2xl lg:text-3xl font-bold mt-1 lg:mt-2">
            ₹{total.toLocaleString("en-IN")}
          </h2>

        </div>

        <div className="w-11 h-11 rounded-full bg-orange-100 flex items-center justify-center shrink-0">

          <Wallet
            size={20}
            className="text-orange-600"
          />

        </div>

      </div>

    </div>
  );
}