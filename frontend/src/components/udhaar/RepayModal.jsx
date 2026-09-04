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
      className="fixed inset-0 z-[70] bg-black/40"
      onClick={onClose}
    >

      {/* =====================================================
          DESKTOP
      ===================================================== */}

      <div className="hidden h-full items-center justify-center p-4 lg:flex">

        <div
          onClick={(e) =>
            e.stopPropagation()
          }
          className="w-full max-w-md rounded-xl bg-white p-6"
        >

          <h2 className="text-xl font-bold text-gray-900">
            Repay Udhaar
          </h2>


          <p className="mt-4 text-sm text-gray-500">
            Bill Number
          </p>

          <div className="text-lg font-semibold text-gray-900">
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

      <div className="flex h-full items-end lg:hidden">

        <div
          onClick={(e) =>
            e.stopPropagation()
          }
          className="w-full rounded-t-2xl bg-white px-5 pb-6 pt-5 shadow-2xl"
        >

          {/* HEADER */}

          <div className="flex items-center justify-between">

            <h2 className="text-xl font-bold text-gray-900">
              Repay Udhaar
            </h2>

          </div>


          {/* BILL NUMBER */}

          <div className="mt-5">

            <p className="text-sm font-medium text-gray-500">
              Bill Number
            </p>

            <p className="mt-1 text-base font-semibold text-gray-900">
              {entry.bill_number}
            </p>

          </div>


          {/* REMAINING */}

          <div className="mt-5">

            <p className="text-sm font-medium text-gray-500">
              Remaining Amount
            </p>

            <p className="mt-1 text-2xl font-bold text-red-600">
              ₹{remaining.toLocaleString("en-IN")}
            </p>

          </div>


          {/* AMOUNT */}

          <div className="mt-5">

            <label
              htmlFor="repay-amount"
              className="text-sm font-medium text-gray-700"
            >
              Amount Paid
            </label>

            <input
              id="repay-amount"
              type="number"
              min="0"
              step="0.01"
              placeholder="Enter amount"
              value={amount}
              disabled={saving}
              onChange={(e) =>
                setAmount(e.target.value)
              }
              className="mt-2 h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-900 outline-none placeholder:text-gray-400 focus:border-blue-500 disabled:bg-gray-100"
            />

          </div>


          {/* ACTIONS */}

          <div className="mt-5 flex gap-3">

            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="h-12 flex-1 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 transition hover:bg-gray-50 active:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>


            <button
              type="button"
              onClick={submit}
              disabled={saving}
              className="h-12 flex-1 rounded-xl bg-green-600 text-sm font-semibold text-white transition hover:bg-green-700 active:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {saving
                ? "Submitting..."
                : "Submit"}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}