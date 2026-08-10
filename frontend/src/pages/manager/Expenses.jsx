import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import ExpenseStats from "../../components/expenses/ExpenseStats";
import ExpenseToolbar from "../../components/expenses/ExpenseToolbar";
import ExpenseTable from "../../components/expenses/ExpenseTable";
import AddExpenseModal from "../../components/expenses/AddExpenseModal";

import dailyReportsService from "../../services/dailyReportsService";
import expenseService from "../../services/expenseService";

const SELECTED_DATE_KEY =
  "pharmacore360_selected_report_date";

export default function Expenses() {
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] =
    useState(false);

  const [expenses, setExpenses] =
    useState([]);

  const [searchParams] =
    useSearchParams();

  const [reportId, setReportId] =
    useState(null);

  const [selectedExpense, setSelectedExpense] =
    useState(null);

  // --------------------------------------------------
  // Initialize page
  // --------------------------------------------------

  useEffect(() => {
    initializePage();
  }, [searchParams]);

  async function initializePage() {
    try {
      let id = searchParams.get("report");

      // --------------------------------------------------
      // If opened from "View Expenses" inside a
      // Daily Report, ALWAYS use that report.
      // --------------------------------------------------

      if (id) {
        id = Number(id);
      }

      // --------------------------------------------------
      // If opened directly from sidebar, use the
      // currently selected Daily Report date.
      // --------------------------------------------------

      if (!id) {
        const savedDate =
          localStorage.getItem(
            SELECTED_DATE_KEY
          );

        let reportDate = savedDate;

        // Fallback only if no date has ever been selected.
        if (!reportDate) {
          reportDate =
            new Date()
              .toISOString()
              .split("T")[0];
        }

        const report =
          await dailyReportsService.getOrCreateReport(
            reportDate
          );

        id = Number(report.id);
      }

      setReportId(id);

      await loadExpenses(id);

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
    }
  }

  // --------------------------------------------------
  // Load expenses for report
  // --------------------------------------------------

  async function loadExpenses(id) {
    if (!id) return;

    try {
      const data =
        await expenseService.getExpenses(
          Number(id)
        );

      console.log(
        "EXPENSE PAGE LOAD",
        {
          reportId: id,
          expenses: data,
        }
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

  // --------------------------------------------------
  // Save expense
  // --------------------------------------------------

  async function handleSave(expense) {
    if (!reportId) {
      console.error(
        "Cannot save expense: report ID missing."
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
          expense_type:
            expense.expense_type,

          amount:
            Number(expense.amount),

          remarks:
            expense.remarks || null,

          daily_report_id:
            Number(reportId),
        });
      }

      await loadExpenses(reportId);

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
    }
  }

  // --------------------------------------------------
  // Delete
  // --------------------------------------------------

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

      await loadExpenses(reportId);

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

  // --------------------------------------------------
  // Edit
  // --------------------------------------------------

  function handleEdit(expense) {
    setSelectedExpense(expense);
    setShowModal(true);
  }

  // --------------------------------------------------
  // Search
  // --------------------------------------------------

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

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold">
          Expenses
        </h1>

        <p className="mt-1 text-gray-500">
          Manage daily store expenses.
        </p>
      </div>

      <ExpenseStats
        expenses={expenses}
      />

      <ExpenseToolbar
        search={search}
        setSearch={setSearch}
        onAddExpense={() => {
          setSelectedExpense(null);
          setShowModal(true);
        }}
      />

      <ExpenseTable
        expenses={filteredExpenses}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <AddExpenseModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedExpense(null);
        }}
        onSave={handleSave}
        expense={selectedExpense}
        dailyReportId={reportId}
      />

    </div>
  );
}