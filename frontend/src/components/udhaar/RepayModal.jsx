import { useState } from "react";

export default function RepayModal({
  open,
  entry,
  onClose,
  onRepay,
}) {
  const [amount, setAmount] =
    useState("");

  if (!open || !entry) return null;

  const remaining =
    entry.amount - entry.paid_amount;

  async function submit() {

    await onRepay(
      entry.id,
      Number(amount)
    );

    setAmount("");

    onClose();
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">

      <div className="w-full max-w-md rounded-xl bg-white p-6">

        <h2 className="text-xl font-bold">
          Repay Udhaar
        </h2>

        <p className="mt-4">
          Customer
        </p>

        <div className="font-semibold">
          {entry.customer_name}
        </div>

        <p className="mt-4">
          Remaining
        </p>

        <div className="font-bold text-red-600">
          ₹{remaining}
        </div>

        <input
          type="number"
          placeholder="Amount Paid"
          value={amount}
          onChange={(e)=>setAmount(e.target.value)}
          className="mt-5 w-full rounded-lg border p-3"
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
            className="rounded-lg bg-green-600 px-4 py-2 text-white"
          >
            Submit
          </button>

        </div>

      </div>

    </div>
  );
}