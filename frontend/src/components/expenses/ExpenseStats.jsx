import { Wallet } from "lucide-react";

export default function ExpenseStats({ expenses = [] }) {

  const total = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">

      <div className="flex justify-between items-center">

        <div>

          <p className="text-sm text-gray-500">
            Today's Expenses
          </p>

          <h2 className="text-3xl font-bold mt-2">
            ₹{total.toLocaleString()}
          </h2>

        </div>

        <div className="w-11 h-11 rounded-full bg-orange-100 flex items-center justify-center">

          <Wallet
            size={20}
            className="text-orange-600"
          />

        </div>

      </div>

    </div>
  );
}