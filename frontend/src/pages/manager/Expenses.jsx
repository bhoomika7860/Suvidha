import { useEffect, useState } from "react";

import ExpenseStats from "../../components/expenses/ExpenseStats";
import ExpenseToolbar from "../../components/expenses/ExpenseToolbar";
import ExpenseTable from "../../components/expenses/ExpenseTable";
import AddExpenseModal from "../../components/expenses/AddExpenseModal";

import expenseService from "../../services/expenseService";

export default function Expenses() {
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [expenses, setExpenses] = useState([]);

  const [selectedExpense, setSelectedExpense] =
    useState(null);

  useEffect(() => {
    loadExpenses();
  }, []);

  async function loadExpenses() {
    try {
      const data =
        await expenseService.getExpenses();

      setExpenses(data);

    } catch (err) {
      console.error(err);
    }
  }

  async function handleSave(expense) {
    try {
      if (expense.id) {
        await expenseService.updateExpense(
          expense.id,
          expense
        );
      } else {
        await expenseService.createExpense(
          expense
        );
      }

      await loadExpenses();

      setShowModal(false);

      setSelectedExpense(null);

    } catch (err) {
      console.error(err);
    }
  }

  async function handleDelete(id) {
    if (
      !window.confirm(
        "Delete this expense?"
      )
    )
      return;

    try {
      await expenseService.deleteExpense(id);

      await loadExpenses();

    } catch (err) {
      console.error(err);
    }
  }

  function handleEdit(expense) {
    setSelectedExpense(expense);

    setShowModal(true);
  }

  const filteredExpenses = expenses.filter(
    (expense) =>
      expense.expense_type
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      expense.created_by_name
        .toLowerCase()
        .includes(search.toLowerCase())
  );

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

      <ExpenseStats expenses={expenses} />

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
      />

    </div>
  );
}