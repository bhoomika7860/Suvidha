import { useState } from "react";
import { X } from "lucide-react";

export default function AddStoreModal({
  open,
  onClose,
  onSave,
}) {
  const [form, setForm] = useState({
    name: "",
    code: "",
    address: "",
  });

  if (!open) return null;

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSave() {
    if (
      !form.name ||
      !form.code ||
      !form.address
    ) {
      alert("Please fill all fields.");
      return;
    }

    onSave(form);

    setForm({
      name: "",
      code: "",
      address: "",
    });
  }

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 z-40"
      />

      <div className="fixed inset-0 flex justify-center items-center z-50">

        <div className="w-[520px] bg-white rounded-2xl shadow-xl">

          <div className="flex justify-between items-center px-6 py-5 border-b">

            <h2 className="text-2xl font-bold">
              Add Store
            </h2>

            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <X size={22} />
            </button>

          </div>

          <div className="p-6 space-y-5">

            <input
              name="name"
              placeholder="Store Name"
              value={form.name}
              onChange={handleChange}
              className="w-full h-11 border rounded-xl px-4"
            />

            <input
              name="code"
              placeholder="Store Code"
              value={form.code}
              onChange={handleChange}
              className="w-full h-11 border rounded-xl px-4"
            />

            <textarea
              rows={4}
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={handleChange}
              className="w-full border rounded-xl p-3 resize-none"
            />

          </div>

          <div className="border-t p-5 flex justify-end gap-3">

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl border hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
            >
              Save Store
            </button>

          </div>

        </div>

      </div>
    </>
  );
}