import {
  useEffect,
  useState,
} from "react";

import {
  X,
} from "lucide-react";

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
  const [type, setType] =
    useState("Tea/Snacks");

  const [amount, setAmount] =
    useState("");

  const [remarks, setRemarks] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {
    if (expense) {
      setType(
        expense.expense_type ||
          "Tea/Snacks"
      );

      setAmount(
        expense.amount ?? ""
      );

      setRemarks(
        expense.remarks || ""
      );
    } else {
      setType("Tea/Snacks");
      setAmount("");
      setRemarks("");
    }
  }, [expense, isOpen]);

  if (!isOpen) {
    return null;
  }

  async function handleSave() {
    const numericAmount =
      Number(amount);

    if (
      !amount ||
      numericAmount <= 0
    ) {
      alert(
        "Enter a valid expense amount."
      );
      return;
    }

    if (!reportId) {
      alert(
        "Daily report is not selected."
      );
      return;
    }

    try {
      setSaving(true);

      await onSave({
        ...(expense && {
          id: expense.id,
        }),

        expense_type: type,
        amount: numericAmount,
        remarks,
      });

      setType("Tea/Snacks");
      setAmount("");
      setRemarks("");

    } catch (err) {
      /*
       * Parent already displays the
       * backend error.
       */
      return;
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div
        onClick={
          saving
            ? undefined
            : onClose
        }
        className="fixed inset-0 z-40 bg-black/30"
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

        <div className="w-full max-w-[600px] rounded-2xl bg-white shadow-xl">

          <div className="flex items-center justify-between border-b p-6">

            <h2 className="text-2xl font-bold">
              {expense
                ? "Edit Expense"
                : "Add Expense"}
            </h2>

            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-lg p-2 hover:bg-gray-100 disabled:opacity-50"
            >
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
                disabled={saving}
                onChange={(e) =>
                  setType(
                    e.target.value
                  )
                }
                className="h-11 w-full rounded-xl border px-4 disabled:bg-gray-100"
              >
                {expenseTypes.map(
                  (item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  )
                )}
              </select>

            </div>

            <div>

              <label className="mb-2 block font-medium">
                Amount
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                disabled={saving}
                onChange={(e) =>
                  setAmount(
                    e.target.value
                  )
                }
                className="h-11 w-full rounded-xl border px-4 disabled:bg-gray-100"
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
                disabled={saving}
                onChange={(e) =>
                  setRemarks(
                    e.target.value
                  )
                }
                className="w-full rounded-xl border p-4 disabled:bg-gray-100"
                placeholder="Remarks"
              />

            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="h-11 w-full rounded-xl bg-blue-600 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {saving
                ? "Saving..."
                : expense
                ? "Update Expense"
                : "Save Expense"}
            </button>

          </div>

        </div>

      </div>
    </>
  );
}