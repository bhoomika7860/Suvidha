import { useState } from "react";

import ExpenseStats from "../../components/expenses/ExpenseStats";
import ExpenseToolbar from "../../components/expenses/ExpenseToolbar";
import ExpenseTable from "../../components/expenses/ExpenseTable";
import AddExpenseModal from "../../components/expenses/AddExpenseModal";

export default function Expenses() {

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [expenses, setExpenses] = useState([
    {
      id: 1,
      type: "Electricity",
      amount: 1200,
      addedBy: "Rahul",
      time: "10:30 AM",
      remarks: "Monthly bill",
    },
    {
      id: 2,
      type: "Tea & Snacks",
      amount: 250,
      addedBy: "Amit",
      time: "12:15 PM",
      remarks: "Staff refreshments",
    },
    {
      id: 3,
      type: "Packaging",
      amount: 750,
      addedBy: "Rahul",
      time: "3:40 PM",
      remarks: "Carry bags",
    },
  ]);

  function addExpense(expense) {

    setExpenses((prev) => [
      {
        id: Date.now(),
        ...expense,
      },
      ...prev,
    ]);

    setShowModal(false);

  }

  const filteredExpenses = expenses.filter(
    (expense) =>
      expense.type.toLowerCase().includes(search.toLowerCase()) ||
      expense.addedBy.toLowerCase().includes(search.toLowerCase())
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