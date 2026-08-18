import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import ExpenseStats from "../../components/expenses/ExpenseStats";
import ExpenseToolbar from "../../components/expenses/ExpenseToolbar";
import ExpenseTable from "../../components/expenses/ExpenseTable";
import AddExpenseModal from "../../components/expenses/AddExpenseModal";

import dailyReportsService from "../../services/dailyReportsService";
import expenseService from "../../services/expenseService";

import { useBusinessDate } from "../../contexts/BusinessDateContext";

export default function Expenses({
  isStaff = false,
}) {
  const { selectedDate } = useBusinessDate();

  const [searchParams] = useSearchParams();

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [report, setReport] = useState(null);
  const [selectedExpense, setSelectedExpense] = useState(null);

  useEffect(() => {
    initializePage();
  }, [selectedDate, searchParams]);

  async function initializePage() {
    try {
      setReport(null);
      setExpenses([]);

      const reportParam = searchParams.get("report");

      let selectedReport;

      if (reportParam) {
        selectedReport =
          await dailyReportsService.getReport(
            Number(reportParam)
          );
      } else {
        selectedReport =
          await dailyReportsService.getOrCreateReport(
            selectedDate
          );
      }

      setReport(selectedReport);

      await loadExpenses(selectedReport.id);
    } catch (err) {
      console.error(
        "Failed to initialize expenses page:",
        err
      );

      console.error(
        "Status:",
        err.response?.status
      );

      console.error(
        "Backend response:",
        err.response?.data
      );

      setReport(null);
      setExpenses([]);
    }
  }

  async function loadExpenses(reportId) {
    if (!reportId) return;

    try {
      const data =
        await expenseService.getExpenses(
          Number(reportId)
        );

      setExpenses(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      console.error(
        "Failed to load expenses:",
        err
      );

      console.error(
        "Status:",
        err.response?.status
      );

      console.error(
        "Backend response:",
        err.response?.data
      );

      setExpenses([]);
    }
  }

  async function handleSave(expense) {
    if (!report?.id) {
      console.error(
        "Cannot save expense: report missing."
      );
      return;
    }

    try {
      if (expense.id) {
        await expenseService.updateExpense(
          expense.id,
          {
            expense_type:
              expense.expense_type,

            amount:
              Number(expense.amount),

            remarks:
              expense.remarks || null,
          }
        );
      } else {
        await expenseService.createExpense({
          daily_report_id:
            Number(report.id),

          expense_type:
            expense.expense_type,

          amount:
            Number(expense.amount),

          remarks:
            expense.remarks || null,
        });
      }

      await loadExpenses(report.id);

      setShowModal(false);
      setSelectedExpense(null);
    } catch (err) {
      console.error(
        "Failed to save expense:",
        err
      );

      console.error(
        "Status:",
        err.response?.status
      );

      console.error(
        "Backend response:",
        err.response?.data
      );

      alert(
        err.response?.data?.detail ||
          "Failed to save expense."
      );

      throw err;
    }
  }

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

      await loadExpenses(report.id);
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
    if (report?.is_locked) {
      return;
    }

    setSelectedExpense(expense);
    setShowModal(true);
  }

  function openAddExpense() {
    if (report?.is_locked) {
      return;
    }

    setSelectedExpense(null);
    setShowModal(true);
  }

  const filteredExpenses =
    expenses.filter((expense) => {
      const expenseType =
        expense.expense_type || "";

      const createdBy =
        expense.created_by_name || "";

      const searchValue =
        search.toLowerCase();

      return (
        expenseType
          .toLowerCase()
          .includes(searchValue) ||
        createdBy
          .toLowerCase()
          .includes(searchValue)
      );
    });

  return (
    <div className="w-full">

      {/* =====================================================
          DESKTOP
      ===================================================== */}

      <div className="hidden lg:block space-y-6">

        {/* Header */}

        <div>

          <div className="flex flex-wrap items-center gap-3">

            <h1 className="text-3xl font-bold">
              Expenses
            </h1>

            {report?.is_locked && (
              <span className="rounded-full border border-green-200 bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                Report Locked
              </span>
            )}

          </div>

          <p className="mt-1 text-gray-500">
            Manage expenses for the selected business day.
          </p>

          {!isStaff && (
            <p className="mt-2 text-sm font-medium text-blue-600">
              Business Date:{" "}
              {report?.report_date || selectedDate}
            </p>
          )}

        </div>

        <ExpenseStats
          expenses={expenses}
        />

        <ExpenseToolbar
          search={search}
          setSearch={setSearch}
          onAddExpense={openAddExpense}
        />

        <ExpenseTable
          expenses={filteredExpenses}
          onEdit={handleEdit}
          onDelete={
            report?.is_locked
              ? undefined
              : handleDelete
          }
        />

      </div>


      {/* =====================================================
          MOBILE
      ===================================================== */}

      <div className="lg:hidden w-full min-h-screen bg-gray-50 pb-24 overflow-x-hidden">

        {/* Header */}

        <div className="w-full bg-white border-b px-5 pt-6 pb-5">

          <div className="flex items-center justify-between gap-3">

            <div className="min-w-0">

              <h1 className="text-3xl font-bold">
                Expenses
              </h1>

              <p className="text-gray-500 mt-1">
                Manage today's store expenses.
              </p>

            </div>

            {report?.is_locked && (
              <span className="shrink-0 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                Locked
              </span>
            )}

          </div>

        </div>


        {/* Content */}

        <div className="px-4 pt-5 space-y-4">

          {/* Total */}

          <ExpenseStats
            expenses={expenses}
          />

          {/* Search + Add */}

          <ExpenseToolbar
            search={search}
            setSearch={setSearch}
            onAddExpense={openAddExpense}
          />

          {/* Expenses */}

          <ExpenseTable
            expenses={filteredExpenses}
            onEdit={handleEdit}
            onDelete={
              report?.is_locked
                ? undefined
                : handleDelete
            }
          />

        </div>

      </div>


      {/* =====================================================
          MODAL
      ===================================================== */}

      <AddExpenseModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedExpense(null);
        }}
        onSave={handleSave}
        expense={selectedExpense}
        reportId={report?.id}
      />

    </div>
  );
}