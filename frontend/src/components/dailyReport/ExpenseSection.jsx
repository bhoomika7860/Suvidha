import {
  Eye,
  Wallet,
  Pencil,
  Trash2,
} from "lucide-react";

import { Link } from "react-router-dom";
import {
  useEffect,
  useState,
} from "react";

import SectionCard from "./SectionCard";
import AddExpenseModal from "../expenses/AddExpenseModal";

import expenseService from "../../services/expenseService";

export default function ExpenseSection({
  report,
  refreshReport,
}) {
  const [expenses, setExpenses] =
    useState([]);

  const [showModal, setShowModal] =
    useState(false);

  const [selectedExpense, setSelectedExpense] =
    useState(null);

  useEffect(() => {
    if (!report) {
      setExpenses([]);
      return;
    }

    setExpenses(
      Array.isArray(report.expenses)
        ? report.expenses
        : []
    );
  }, [report]);

  const total =
    expenses.reduce(
      (sum, expense) =>
        sum +
        Number(
          expense.amount || 0
        ),
      0
    );

  async function handleDelete(id) {
    if (report.is_locked) {
      return;
    }

    if (
      !window.confirm(
        "Delete this expense?"
      )
    ) {
      return;
    }

    try {
      await expenseService.deleteExpense(
        id
      );

      await refreshReport();

    } catch (err) {
      console.error(
        "Failed to delete expense:",
        err
      );

      alert(
        err.response?.data?.detail ||
          "Failed to delete expense."
      );
    }
  }

  function handleEdit(expense) {
    if (report.is_locked) {
      return;
    }

    setSelectedExpense(expense);
    setShowModal(true);
  }

  async function handleSave(data) {
    try {
      if (!data.id) {
        return;
      }

      await expenseService.updateExpense(
        data.id,
        {
          expense_type:
            data.expense_type,

          amount:
            Number(
              data.amount
            ),

          remarks:
            data.remarks || null,
        }
      );

      setShowModal(false);
      setSelectedExpense(null);

      await refreshReport();

    } catch (err) {
      console.error(
        "Failed to update expense:",
        err
      );

      alert(
        err.response?.data?.detail ||
          "Failed to update expense."
      );

      throw err;
    }
  }

  if (!report) {
    return null;
  }

  return (
    <SectionCard title="Expenses">

      <div className="space-y-6">

        <div className="flex flex-wrap items-center justify-between gap-4">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100">

              <Wallet
                size={19}
                className="text-orange-600"
              />

            </div>

            <div>

              <h3 className="text-base font-semibold text-gray-900">
                Expenses
              </h3>

              <p className="text-sm text-gray-500">
                Expenses for this business date.
              </p>

            </div>

          </div>

          <Link
            to={`/manager-expenses?report=${report.id}`}
            className="flex h-10 items-center gap-2 rounded-xl border border-gray-200 px-4 text-sm hover:bg-gray-50"
          >
            <Eye size={17} />
            View Expenses
          </Link>

        </div>


        <div className="overflow-hidden rounded-xl border border-gray-200">

          <table className="w-full">

            <thead className="bg-gray-50">

              <tr>

                <th className="px-5 py-3 text-left text-sm font-medium text-gray-600">
                  Expense
                </th>

                <th className="px-5 py-3 text-left text-sm font-medium text-gray-600">
                  Amount
                </th>

                <th className="px-5 py-3 text-left text-sm font-medium text-gray-600">
                  Added By
                </th>

                <th className="px-5 py-3 text-center text-sm font-medium text-gray-600">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {expenses.length === 0 ? (

                <tr>

                  <td
                    colSpan={4}
                    className="px-5 py-9 text-center text-sm text-gray-500"
                  >
                    No expenses recorded for this report.
                  </td>

                </tr>

              ) : (

                expenses.map(
                  (expense) => (

                    <tr
                      key={expense.id}
                      className="border-t border-gray-100"
                    >

                      <td className="px-5 py-4">
                        {expense.expense_type || "-"}
                      </td>

                      <td className="px-5 py-4 font-medium">
                        ₹
                        {Number(
                          expense.amount || 0
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </td>

                      <td className="px-5 py-4">
                        {expense.created_by_name || "-"}
                      </td>

                      <td className="px-5 py-4">

                        <div className="flex justify-center gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(
                                expense
                              )
                            }
                            disabled={
                              report.is_locked
                            }
                            className="rounded-lg bg-amber-500 p-2 text-white hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                expense.id
                              )
                            }
                            disabled={
                              report.is_locked
                            }
                            className="rounded-lg bg-red-600 p-2 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Trash2 size={16} />
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>


        <div className="flex justify-end">

          <div className="rounded-xl border border-orange-200 bg-orange-50 px-6 py-4">

            <p className="text-sm text-orange-700">
              Total Expenses
            </p>

            <h2 className="mt-1 text-2xl font-bold text-orange-600">
              ₹
              {total.toLocaleString(
                "en-IN"
              )}
            </h2>

          </div>

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
        reportId={report.id}
      />

    </SectionCard>
  );
}