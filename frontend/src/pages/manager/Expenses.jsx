import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import ExpenseStats from "../../components/expenses/ExpenseStats";
import ExpenseToolbar from "../../components/expenses/ExpenseToolbar";
import ExpenseTable from "../../components/expenses/ExpenseTable";
import AddExpenseModal from "../../components/expenses/AddExpenseModal";

import dailyReportsService from "../../services/dailyReportsService";
import expenseService from "../../services/expenseService";

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

      // If no report was supplied in the URL,
      // use today's report.
      if (!id) {
        const report =
          await dailyReportsService.getTodayReport();

        id = report.id;
      }

      id = Number(id);

      setReportId(id);

      await loadExpenses(id);

    } catch (err) {
      console.error(
        "Failed to initialize expenses page:",
        err
      );

      console.log(
        "Status:",
        err.response?.status
      );

      console.log(
        "Backend response:",
        err.response?.data
      );
    }
  }

  // --------------------------------------------------
  // Load expenses for selected report
  // --------------------------------------------------

  async function loadExpenses(id = reportId) {
    if (!id) return;

    try {
      const data =
        await expenseService.getExpenses(
          Number(id)
        );

      setExpenses(data);

    } catch (err) {
      console.error(
        "Failed to load expenses:",
        err
      );

      console.log(
        "Status:",
        err.response?.status
      );

      console.log(
        "Backend response:",
        err.response?.data
      );
    }
  }

  // --------------------------------------------------
  // Save expense
  // --------------------------------------------------

  async function handleSave(expense) {
    if (!reportId) {
      console.error(
        "Cannot save expense: report ID is missing."
      );
      return;
    }

    try {
      if (expense.id) {
        // Update existing expense.
        // daily_report_id is included because
        // the backend ExpenseCreate schema requires it.
        await expenseService.updateExpense(
          expense.id,
          {
            ...expense,
            daily_report_id: Number(reportId),
          }
        );

      } else {
        // Create new expense for the
        // currently selected report.
        await expenseService.createExpense({
          ...expense,
          daily_report_id: Number(reportId),
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

      console.log(
        "Status:",
        err.response?.status
      );

      console.log(
        "Backend response:",
        err.response?.data
      );
    }
  }

  // --------------------------------------------------
  // Delete expense
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

      console.log(
        "Status:",
        err.response?.status
      );

      console.log(
        "Backend response:",
        err.response?.data
      );
    }
  }

  // --------------------------------------------------
  // Edit expense
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

      return (
        expenseType
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||

        createdBy
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
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