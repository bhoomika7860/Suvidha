import { useState } from "react";

export default function AddUdhaarModal({
  open,
  onClose,
  onSave,
  dailyReportId,
}) {
  const [customer_name, setCustomerName] =
    useState("");

  const [customer_phone, setCustomerPhone] =
    useState("");

  const [amount, setAmount] =
    useState("");
  
  const [billNumber, setBillNumber] = useState("");

  if (!open) return null;

  async function submit() {
    console.log({
  daily_report_id: dailyReportId,
  bill_number: billNumber,
  customer_name,
  customer_phone,
  amount: Number(amount),
});
    await onSave({
      daily_report_id: dailyReportId,
       bill_number: billNumber,
      customer_name,
      customer_phone,
      amount: Number(amount),
    });

    setCustomerName("");
    setCustomerPhone("");
    setAmount("");

    onClose();
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">

      <div className="w-full max-w-md rounded-xl bg-white p-6">

        <h2 className="text-xl font-bold">
          Add Udhaar
        </h2>

        <input
          placeholder="Customer Name"
          value={customer_name}
          onChange={(e)=>setCustomerName(e.target.value)}
          className="mt-4 w-full rounded-lg border p-3"
        />

        <input
          placeholder="Phone"
          value={customer_phone}
          onChange={(e)=>setCustomerPhone(e.target.value)}
          className="mt-3 w-full rounded-lg border p-3"
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e)=>setAmount(e.target.value)}
          className="mt-3 w-full rounded-lg border p-3"
        />
        <label className="block mb-2 font-medium">
  Bill Number
</label>

<input
  value={billNumber}
  onChange={(e) => setBillNumber(e.target.value)}
  placeholder="Enter Bill Number"
  className="w-full h-11 border rounded-xl px-4"
/>

        <div className="mt-6 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="rounded-lg border px-4 py-2"
          >
            Cancel
          </button>

          <button
            onClick={submit}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white"
          >
            Save
          </button>

        </div>

      </div>

    </div>
  );
}