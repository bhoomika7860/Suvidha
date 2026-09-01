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
    <div
      className="fixed inset-0 z-40 bg-black/40"
      onClick={onClose}
    >

      {/* =====================================================
          DESKTOP
      ===================================================== */}

      <div
        className="hidden lg:flex h-full items-center justify-center p-4"
      >

        <div
          onClick={(e) =>
            e.stopPropagation()
          }
          className="w-full max-w-md rounded-xl bg-white p-6"
        >

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
            ₹{remaining.toLocaleString("en-IN")}
          </div>

          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Amount Paid"
            value={amount}
            disabled={saving}
            onChange={(e) =>
              setAmount(e.target.value)
            }
            className="mt-5 w-full rounded-lg border p-3 disabled:bg-gray-100"
          />

          <div className="mt-6 flex justify-end gap-3">

            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-lg border px-4 py-2"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={submit}
              disabled={saving}
              className="rounded-lg bg-green-600 px-4 py-2 text-white disabled:bg-gray-400"
            >
              {saving
                ? "Submitting..."
                : "Submit"}
            </button>

          </div>

        </div>

      </div>


      {/* =====================================================
          MOBILE — BOTTOM SHEET
      ===================================================== */}

      <div className="lg:hidden flex h-full items-end">

        <div
          onClick={(e) =>
            e.stopPropagation()
          }
          className="w-full rounded-t-2xl bg-white px-5 pb-5 pt-5"
        >

          <h2 className="text-xl font-bold text-gray-900">
            Repay Udhaar
          </h2>


          <p className="mt-5 text-sm text-gray-500">
            Bill Number
          </p>

          <div className="text-base font-semibold text-gray-900">
            {entry.bill_number}
          </div>


          <p className="mt-5 text-sm text-gray-500">
            Remaining Amount
          </p>

          <div className="text-2xl font-bold text-red-600">
            ₹{remaining.toLocaleString("en-IN")}
          </div>


          <p className="mt-5 text-sm text-gray-700">
            Amount Paid
          </p>

          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Enter amount"
            value={amount}
            disabled={saving}
            onChange={(e) =>
              setAmount(e.target.value)
            }
            className="mt-2 h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-blue-500 disabled:bg-gray-100"
          />


          <button
            type="button"
            onClick={submit}
            disabled={saving}
            className="mt-5 h-11 w-full rounded-xl bg-green-600 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-gray-400"
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