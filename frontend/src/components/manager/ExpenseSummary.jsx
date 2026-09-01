import { useEffect, useState } from "react";
import analyticsService from "../../services/analyticsService";

export default function ExpenseSummary() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const data =
          await analyticsService.getManagerDashboard();

        setExpenses(data.expenses || []);
      } catch (err) {
        console.error(err);
      }
    }

    load();
  }, []);

  const total = expenses.reduce(
    (sum, expense) =>
      sum + Number(expense.amount || 0),
    0
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">

      <h2 className="mb-5 text-lg font-semibold">
        Today's Expenses
      </h2>

      {expenses.length === 0 ? (

        <p className="text-sm text-gray-500">
          No expenses added today.
        </p>

      ) : (

        <div className="space-y-1">

          {expenses.map((expense, index) => (

            <div
              key={index}
              className="flex items-center justify-between gap-3 border-b py-3"
            >

              <span className="truncate text-sm text-gray-600">
                {expense.title}
              </span>

              <span className="shrink-0 text-sm font-semibold">
                ₹
                {Number(
                  expense.amount
                ).toLocaleString("en-IN")}
              </span>

            </div>

          ))}

        </div>

      )}

      <div className="mt-6 flex justify-between">

        <span className="text-sm font-semibold">
          Total
        </span>

        <span className="text-xl font-bold text-red-500">
          ₹{total.toLocaleString("en-IN")}
        </span>

      </div>

    </div>
  );
}