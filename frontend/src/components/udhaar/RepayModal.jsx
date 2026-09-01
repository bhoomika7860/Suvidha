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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">

      <div className="w-full rounded-t-2xl bg-white p-5 sm:max-w-md sm:rounded-2xl sm:p-6">

        {/* Header */}

        <h2 className="text-xl font-bold text-gray-900">
          Repay Udhaar
        </h2>


        {/* Bill Number */}

        <p className="mt-4 text-sm text-gray-500">
          Bill Number
        </p>

        <div className="text-lg font-semibold text-gray-900">
          {entry.bill_number}
        </div>


        {/* Remaining */}

        <p className="mt-5 text-sm text-gray-500">
          Remaining Amount
        </p>

        <div className="text-2xl font-bold text-red-600">
          ₹
          {remaining.toLocaleString(
            "en-IN"
          )}
        </div>


        {/* Amount */}

        <label className="mt-5 block text-sm font-medium text-gray-700">
          Amount Paid
        </label>

        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="Enter amount"
          value={amount}
          disabled={saving}
          onChange={(e) =>
            setAmount(
              e.target.value
            )
          }
          className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500 disabled:bg-gray-100"
        />


        {/* Actions */}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 disabled:opacity-50 sm:w-auto sm:py-2"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={submit}
            disabled={saving}
            className="w-full rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-400 sm:w-auto sm:py-2"
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