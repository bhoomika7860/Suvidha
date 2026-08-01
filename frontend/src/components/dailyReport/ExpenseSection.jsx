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

export default function ExpenseSection() {
  const [expenses, setExpenses] = useState([]);
  const [reportId, setReportId] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedExpense, setSelectedExpense] =
    useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const report =
        await dailyReportsService.getTodayReport();

      setReportId(report.id);

      const data =
        await dailyReportsService.getExpenses(
          report.id
        );

      setExpenses(data);

    } catch (err) {
      console.error(err);
    }
  }

  const total = expenses.reduce(
    (sum, item) => sum + Number(item.amount),
    0
  );

  async function handleDelete(id) {
    if (
      !window.confirm(
        "Delete this expense?"
      )
    )
      return;

    try {
      await expenseService.deleteExpense(id);

      await load();

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
          data
        );
      }

      setShowModal(false);
      setSelectedExpense(null);

      await load();

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
              Today's Expenses
            </h3>

            <p className="text-sm text-gray-500">
              Automatically synced from the Expenses
              module.
            </p>

          </div>

        </div>

        <Link
          to="/manager-expenses"
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

            {expenses.map((expense) => (

              <tr
                key={expense.id}
                className="border-t"
              >

                <td className="px-5 py-3">
                  {expense.expense_type}
                </td>

                <td className="px-5 py-3 font-medium">
                  ₹{Number(
                    expense.amount
                  ).toLocaleString("en-IN")}
                </td>

                <td className="px-5 py-3">
                  {expense.created_by_name}
                </td>

                <td className="px-5 py-3">

                  <div className="flex justify-center gap-2">

                    <button
                      onClick={() =>
                        handleEdit(expense)
                      }
                      className="rounded-lg bg-amber-500 p-2 text-white hover:bg-amber-600"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(expense.id)
                      }
                      className="rounded-lg bg-red-600 p-2 text-white hover:bg-red-700"
                    >
                      <Trash2 size={16} />
                    </button>

                  </div>

                </td>

              </tr>

            ))}

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
      />

    </SectionCard>
  );
}