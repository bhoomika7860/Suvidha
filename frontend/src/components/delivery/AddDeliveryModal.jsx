import { useState } from "react";
import { Upload, X } from "lucide-react";

export default function AddDeliveryModal({
  isOpen,
  onClose,
  onSave,
}) {

  const [form, setForm] = useState({
    customer: "",
    billNo: "",
    payment: "",
    paymentMethod: "Cash",
    notes: "",
  });

  if (!isOpen) return null;

  function handleSave() {

    onSave(form);

    setForm({
      customer: "",
      billNo: "",
      payment: "",
      paymentMethod: "Cash",
      notes: "",
    });

  }

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 z-40"
      />

      <div className="fixed inset-0 flex items-center justify-center z-50">

        <div className="w-full max-w-md mx-4 bg-white rounded-2xl shadow-xl">

          <div className="flex justify-between items-center border-b px-5 py-5">

            <h2 className="text-xl font-bold">
              Add Delivery
            </h2>

            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <X />
            </button>

          </div>

          <div className="p-5 space-y-4">

            <input
              placeholder="Customer Name"
              value={form.customer}
              onChange={(e) =>
                setForm({
                  ...form,
                  customer: e.target.value,
                })
              }
              className="w-full h-11 border rounded-xl px-4"
            />

            <input
              placeholder="Bill Number"
              value={form.billNo}
              onChange={(e) =>
                setForm({
                  ...form,
                  billNo: e.target.value,
                })
              }
              className="w-full h-11 border rounded-xl px-4"
            />

            <input
              placeholder="Payment"
              value={form.payment}
              onChange={(e) =>
                setForm({
                  ...form,
                  payment: e.target.value,
                })
              }
              className="w-full h-11 border rounded-xl px-4"
            />

            <select
              value={form.paymentMethod}
              onChange={(e) =>
                setForm({
                  ...form,
                  paymentMethod: e.target.value,
                })
              }
              className="w-full h-11 border rounded-xl px-4"
            >

              <option>Cash</option>
              <option>UPI</option>
              <option>Card</option>

            </select>

            <div className="border-2 border-dashed rounded-2xl h-36 flex flex-col items-center justify-center">

              <Upload
                size={34}
                className="text-gray-400"
              />

              <p className="text-gray-500 mt-2 text-sm">
                Upload Bill Photo
              </p>

            </div>

            <textarea
              rows={3}
              placeholder="Notes"
              value={form.notes}
              onChange={(e) =>
                setForm({
                  ...form,
                  notes: e.target.value,
                })
              }
              className="w-full border rounded-xl p-3 resize-none"
            />

            <button
              onClick={handleSave}
              className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >

              Save Delivery

            </button>

          </div>

        </div>

      </div>

    </>
  );

}