import { useState } from "react";
import { Upload, X } from "lucide-react";

export default function ReceiveBillModal({
  isOpen,
  onClose,
  onSave,
}) {

  const [party, setParty] = useState("");
  const [billNo, setBillNo] = useState("");
  const [amount, setAmount] = useState("");

  if (!isOpen) return null;

  function handleSubmit() {

    if (!party || !billNo || !amount) return;

    onSave({

      party,

      billNo,

      amount: Number(amount),

      receivedBy: "Current User",

      checkedBy: "-",

      enteredBy: "-",

      status: "received",

    });

    setParty("");
    setBillNo("");
    setAmount("");

  }

  return (
    <>
      {/* Overlay */}

      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/30 z-40"
      />

      {/* Modal */}

      <div className="fixed inset-0 flex items-center justify-center z-50">

        <div className="w-[650px] bg-white rounded-2xl shadow-xl">

          {/* Header */}

          <div className="flex justify-between items-center border-b px-6 py-5">

            <h2 className="text-2xl font-bold">

              Receive Purchase Bill

            </h2>

            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100"
            >

              <X />

            </button>

          </div>

          {/* Body */}

          <div className="p-6 space-y-5">

            <div>

              <label className="block text-sm font-medium mb-2">

                Party Name

              </label>

              <input
                value={party}
                onChange={(e) => setParty(e.target.value)}
                placeholder="Enter supplier name"
                className="w-full h-11 border border-gray-200 rounded-xl px-4"
              />

            </div>

            <div className="grid grid-cols-2 gap-4">

              <div>

                <label className="block text-sm font-medium mb-2">

                  Bill Number

                </label>

                <input
                  value={billNo}
                  onChange={(e) => setBillNo(e.target.value)}
                  placeholder="Enter bill number"
                  className="w-full h-11 border border-gray-200 rounded-xl px-4"
                />

              </div>

              <div>

                <label className="block text-sm font-medium mb-2">

                  Amount

                </label>

                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="₹"
                  className="w-full h-11 border border-gray-200 rounded-xl px-4"
                />

              </div>

            </div>

            <div>

              <label className="block text-sm font-medium mb-2">

                Upload Bill

              </label>

              <div className="h-40 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center">

                <Upload
                  size={36}
                  className="text-gray-400"
                />

                <p className="text-sm text-gray-500 mt-3">

                  Image upload will be connected to the backend later

                </p>

              </div>

            </div>

            <button
              onClick={handleSubmit}
              className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
            >

              Submit Bill

            </button>

          </div>

        </div>

      </div>

    </>
  );
}