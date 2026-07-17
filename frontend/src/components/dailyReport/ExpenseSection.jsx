import { useEffect, useState } from "react";
import { Eye, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import SectionCard from "./SectionCard";
import dailyReportsService from "../../services/dailyReportsService";

export default function ExpenseSection() {
  const [expenses, setExpenses] = useState([]);
  const [reportId, setReportId] = useState(null);

  useEffect(() => {
    async function load() {
      const report =
        await dailyReportsService.getTodayReport();

      setReportId(report.id);

      const data =
        await dailyReportsService.getExpenses(report.id);

      setExpenses(data);
    }

    load();
  }, []);

  const total = expenses.reduce(
    (sum, item) => sum + Number(item.amount),
    0
  );

  return (
    <SectionCard title="Expenses">

      <div className="flex items-center justify-between mb-5">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">

            <Wallet
              size={18}
              className="text-orange-600"
            />

          </div>

          <div>

            <h3 className="font-semibold">
              Today's Expenses
            </h3>

            <p className="text-sm text-gray-500">
              Automatically synced from the Expenses module.
            </p>

          </div>

        </div>

        <Link
          to="/manager-expenses"
          className="flex items-center gap-2 h-10 px-4 rounded-xl border border-gray-200 hover:bg-gray-50"
        >
          <Eye size={17} />
          View Expenses
        </Link>

      </div>

      <div className="overflow-hidden rounded-xl border">

        <table className="w-full">

          <thead className="bg-gray-50">

            <tr>

              <th className="px-5 py-3 text-left">
                Expense
              </th>

              <th className="px-5 py-3 text-left">
                Amount
              </th>

              <th className="px-5 py-3 text-left">
                Added By
              </th>

            </tr>

          </thead>

          <tbody>

            {expenses.map((expense) => (

              <tr
                key={expense.id}
                className="border-t"
              >

                <td className="px-5 py-3">
  {expense.expense_type}
</td>

                <td className="px-5 py-3 font-medium">
                  ₹{expense.amount}
                </td>

                <td className="px-5 py-3">
                  {expense.created_by}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      <div className="mt-5 flex justify-end">

        <div className="bg-orange-50 border border-orange-200 rounded-xl px-6 py-3">

          <p className="text-xs text-orange-700">
            Total Expenses
          </p>

          <h2 className="text-2xl font-bold text-orange-600">
            ₹{total.toLocaleString("en-IN")}
          </h2>

        </div>

      </div>

    </SectionCard>
  );
}