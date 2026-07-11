import { useState } from "react";
import { X } from "lucide-react";

const expenseTypes = [
  "Electricity",
  "Fuel",
  "Tea & Snacks",
  "Internet",
  "Packaging",
  "Cleaning",
  "Maintenance",
  "Courier",
  "Miscellaneous",
  "Other",
];

export default function AddExpenseModal({
  isOpen,
  onClose,
  onSave,
}) {

  const [type, setType] = useState("Electricity");
  const [amount, setAmount] = useState("");
  const [remarks, setRemarks] = useState("");

  if (!isOpen) return null;

  function handleSave() {

    if (!amount) return;

    onSave({

      type,

      amount: Number(amount),

      addedBy: "Current User",

      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),

      remarks,

    });

    setAmount("");
    setRemarks("");
    setType("Electricity");

  }

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/30 z-40"
      />

      <div className="fixed inset-0 flex items-center justify-center z-50">

        <div className="bg-white rounded-2xl shadow-xl w-[600px]">

          <div className="flex justify-between items-center p-6 border-b">

            <h2 className="text-2xl font-bold">

              Add Expense

            </h2>

            <button onClick={onClose}>

              <X />

            </button>

          </div>

          <div className="p-6 space-y-5">

            <div>

              <label className="block mb-2 font-medium">

                Expense Type

              </label>

              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full h-11 border rounded-xl px-4"
              >

                {expenseTypes.map((expense) => (

                  <option key={expense}>

                    {expense}

                  </option>

                ))}

              </select>

            </div>

            <div>

              <label className="block mb-2 font-medium">

                Amount

              </label>

              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full h-11 border rounded-xl px-4"
                placeholder="Enter amount"
              />

            </div>

            <div>

              <label className="block mb-2 font-medium">

                Remarks

              </label>

              <textarea
                rows={4}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full border rounded-xl p-4"
                placeholder="Remarks"
              />

            </div>

            <button
              onClick={handleSave}
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-medium"
            >

              Save Expense

            </button>

          </div>

        </div>

      </div>

    </>
  );

}