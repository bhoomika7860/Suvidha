import { useEffect, useState } from "react";
import {
  Eye,
  Wallet,
  Pencil,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";

import SectionCard from "./SectionCard";
import AddExpenseModal from "../expenses/AddExpenseModal";

import dailyReportsService from "../../services/dailyReportsService";
import expenseService from "../../services/expenseService";

export default function ExpenseSection({
  report,
  refreshReport,
}) {
  const [expenses, setExpenses] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [selectedExpense, setSelectedExpense] =
    useState(null);

  async function loadExpenses() {
    if (!report?.id) return;

    try {
      const data =
        await dailyReportsService.getExpenses(
          report.id
        );

      setExpenses(data);
    } catch (err) {
      console.error(
        "Failed to load expenses:",
        err
      );
    }
  }

  useEffect(() => {
    loadExpenses();
  }, [report?.id]);

  const total = expenses.reduce(
    (sum, item) =>
      sum + Number(item.amount || 0),
    0
  );

  async function handleDelete(id) {
    if (
      !window.confirm(
        "Delete this expense?"
      )
    ) {
      return;
    }

    try {
      await expenseService.deleteExpense(id);

      await loadExpenses();
      await refreshReport();
    } catch (err) {
      console.error(err);
    }
  }

  function handleEdit(expense) {
    setSelectedExpense(expense);
    setShowModal(true);
  }

  async function handleSave(data) {
    try {
      if (data.id) {
        await expenseService.updateExpense(
          data.id,
          {
            ...data,
            daily_report_id: report.id,
          }
        );
      }

      setShowModal(false);
      setSelectedExpense(null);

      await loadExpenses();
      await refreshReport();

    } catch (err) {
      console.error(err);
    }
  }

  return (
    <SectionCard title="Expenses">

      <div className="mb-5 flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100">
            <Wallet
              size={18}
              className="text-orange-600"
            />
          </div>

          <div>

            <h3 className="font-semibold">
              Expenses
            </h3>

            <p className="text-sm text-gray-500">
              Expenses for this report.
            </p>

          </div>

        </div>

        <Link
          to={`/manager-expenses?report=${report.id}`}
          className="flex h-10 items-center gap-2 rounded-xl border border-gray-200 px-4 hover:bg-gray-50"
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

              <th className="px-5 py-3 text-center">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {expenses.length === 0 ? (

              <tr>
                <td
                  colSpan={4}
                  className="px-5 py-8 text-center text-gray-500"
                >
                  No expenses recorded for this report.
                </td>
              </tr>

            ) : (

              expenses.map((expense) => (

                <tr
                  key={expense.id}
                  className="border-t"
                >

                  <td className="px-5 py-3">
                    {expense.expense_type}
                  </td>

                  <td className="px-5 py-3 font-medium">
                    ₹
                    {Number(
                      expense.amount || 0
                    ).toLocaleString("en-IN")}
                  </td>

                  <td className="px-5 py-3">
                    {expense.created_by_name || "-"}
                  </td>

                  <td className="px-5 py-3">

                    <div className="flex justify-center gap-2">

                      <button
                        onClick={() =>
                          handleEdit(expense)
                        }
                        disabled={report.is_locked}
                        className="rounded-lg bg-amber-500 p-2 text-white hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(expense.id)
                        }
                        disabled={report.is_locked}
                        className="rounded-lg bg-red-600 p-2 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

      <div className="mt-5 flex justify-end">

        <div className="rounded-xl border border-orange-200 bg-orange-50 px-6 py-3">

          <p className="text-xs text-orange-700">
            Total Expenses
          </p>

          <h2 className="text-2xl font-bold text-orange-600">
            ₹{total.toLocaleString("en-IN")}
          </h2>

        </div>

      </div>

      <AddExpenseModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedExpense(null);
        }}
        onSave={handleSave}
        expense={selectedExpense}
        dailyReportId={report.id}
      />

    </SectionCard>
  );
}