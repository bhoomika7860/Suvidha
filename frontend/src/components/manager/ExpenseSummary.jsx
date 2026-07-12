import { useEffect, useState } from "react";
import analyticsService from "../../services/analyticsService";

export default function ExpenseSummary() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const data = await analyticsService.getManagerDashboard();
        setExpenses(data.expenses || []);
      } catch (err) {
        console.error(err);
      }
    }

    load();
  }, []);

  const total = expenses.reduce(
    (sum, expense) => sum + Number(expense.amount || 0),
    0
  );

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">

      <h2 className="text-xl font-semibold mb-6">
        Today's Expenses
      </h2>

      {expenses.length === 0 ? (
        <p className="text-gray-500 text-sm">
          No expenses added today.
        </p>
      ) : (
        <div className="space-y-4">

          {expenses.map((expense, index) => (
            <div
              key={index}
              className="flex justify-between border-b pb-3"
            >
              <span className="text-gray-600">
                {expense.title}
              </span>

              <span className="font-semibold">
                ₹{Number(expense.amount).toLocaleString("en-IN")}
              </span>

            </div>
          ))}

        </div>
      )}

      <div className="flex justify-between mt-8">

        <span className="font-semibold">
          Total
        </span>

        <span className="text-2xl font-bold text-red-500">
          ₹{total.toLocaleString("en-IN")}
        </span>

      </div>

    </div>
  );
}