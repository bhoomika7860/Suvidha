import { useEffect, useState } from "react";
import { X } from "lucide-react";

const expenseTypes = [
  "Tea/Snacks",
  "Petrol",
  "Water Bill",
  "Electricity Bill",
  "Bike Service/Repair",
  "Salary",
  "Local Purchase",
  "Repair & Maint",
  "Porter",
  "Staff Welfare",
];

export default function AddExpenseModal({
  isOpen,
  onClose,
  onSave,
  expense = null,
  reportId,
}) {
  const [type, setType] = useState("Tea/Snacks");
  const [amount, setAmount] = useState("");
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    if (expense) {
      setType(expense.expense_type);
      setAmount(expense.amount);
      setRemarks(expense.remarks || "");
    } else {
      setType("Tea/Snacks");
      setAmount("");
      setRemarks("");
    }
  }, [expense, isOpen]);

  if (!isOpen) return null;

  function handleSave() {
  if (!amount) return;

  onSave({
    ...(expense && { id: expense.id }),

    expense_type: type,
    amount: Number(amount),
    remarks,
  });

  setType("Tea/Snacks");
  setAmount("");
  setRemarks("");

  onClose();
}

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/30 z-40"
      />

      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="w-[600px] rounded-2xl bg-white shadow-xl">

          <div className="flex items-center justify-between border-b p-6">
            <h2 className="text-2xl font-bold">
              {expense ? "Edit Expense" : "Add Expense"}
            </h2>

            <button onClick={onClose}>
              <X />
            </button>
          </div>

          <div className="space-y-5 p-6">

            <div>
              <label className="mb-2 block font-medium">
                Expense Type
              </label>

              <select
                value={type}
                onChange={(e) =>
                  setType(e.target.value)
                }
                className="h-11 w-full rounded-xl border px-4"
              >
                {expenseTypes.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Amount
              </label>

              <input
                type="number"
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value)
                }
                className="h-11 w-full rounded-xl border px-4"
                placeholder="Enter amount"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Remarks
              </label>

              <textarea
                rows={4}
                value={remarks}
                onChange={(e) =>
                  setRemarks(e.target.value)
                }
                className="w-full rounded-xl border p-4"
                placeholder="Remarks"
              />
            </div>

            <button
              onClick={handleSave}
              className="h-11 w-full rounded-xl bg-blue-600 font-medium text-white hover:bg-blue-700"
            >
              {expense ? "Update Expense" : "Save Expense"}
            </button>

          </div>
        </div>
      </div>
    </>
  );
}