
import ExpenseStats from "../../components/expenses/ExpenseStats";
import ExpenseToolbar from "../../components/expenses/ExpenseToolbar";
import ExpenseTable from "../../components/expenses/ExpenseTable";
import AddExpenseModal from "../../components/expenses/AddExpenseModal";
import { useEffect, useState } from "react";
import expenseService from "../../services/expenseService";

export default function Expenses() {

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [expenses, setExpenses] = useState([]);

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

  async function addExpense(expense) {

  try {

    await expenseService.createExpense(
      expense
    );

    await loadExpenses();

    setShowModal(false);

  } catch (err) {

    console.error(err);

  }

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

        <p className="text-gray-500 mt-1">
          Manage daily store expenses.
        </p>

      </div>

      <ExpenseStats expenses={expenses} />

      <ExpenseToolbar
        search={search}
        setSearch={setSearch}
        onAddExpense={() => setShowModal(true)}
      />

      <ExpenseTable
        expenses={filteredExpenses}
      />

      <AddExpenseModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={addExpense}
      />

    </div>

  );

}