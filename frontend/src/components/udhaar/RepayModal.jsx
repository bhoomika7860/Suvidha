import {
  useEffect,
  useState,
} from "react";

export default function RepayModal({
  open,
  entry,
  onClose,
  onRepay,
}) {
  const [amount, setAmount] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {
    if (!open) {
      setAmount("");
      setSaving(false);
    }
  }, [open]);

  if (!open || !entry) {
    return null;
  }

  const remaining =
    Number(entry.amount || 0) -
    Number(entry.paid_amount || 0);

  async function submit() {
    const repayment =
      Number(amount);

    if (
      !repayment ||
      repayment <= 0
    ) {
      alert(
        "Enter a valid repayment amount."
      );
      return;
    }

    if (repayment > remaining) {
      alert(
        "Repayment cannot exceed the remaining amount."
      );
      return;
    }

    try {
      setSaving(true);

      await onRepay(
        entry.id,
        repayment
      );

      setAmount("");

    } catch (err) {
      console.error(
        "Failed to repay Udhaar:",
        err
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

      <div className="w-full max-w-md rounded-xl bg-white p-6">

        <h2 className="text-xl font-bold">
          Repay Udhaar
        </h2>

        <p className="mt-4 text-sm text-gray-500">
          Bill Number
        </p>

        <div className="text-lg font-semibold">
          {entry.bill_number}
        </div>

        <p className="mt-5 text-sm text-gray-500">
          Remaining Amount
        </p>

        <div className="text-2xl font-bold text-red-600">
          ₹
          {remaining.toLocaleString(
            "en-IN"
          )}
        </div>

        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="Amount Paid"
          value={amount}
          disabled={saving}
          onChange={(e) =>
            setAmount(
              e.target.value
            )
          }
          className="mt-5 w-full rounded-lg border p-3 disabled:bg-gray-100"
        />

        <div className="mt-6 flex justify-end gap-3">

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg border px-4 py-2 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={submit}
            disabled={saving}
            className="rounded-lg bg-green-600 px-4 py-2 text-white disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {saving
              ? "Submitting..."
              : "Submit"}
          </button>

        </div>

      </div>

    </div>
  );
}