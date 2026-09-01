import {
  useRef,
  useState,
} from "react";

export default function AddUdhaarModal({
  open,
  onClose,
  onSave,
  dailyReportId,
}) {
  const [rows, setRows] =
    useState([
      {
        bill_number: "",
        amount: "",
      },
    ]);

  const [saving, setSaving] =
    useState(false);

  const billRefs =
    useRef([]);

  const amountRefs =
    useRef([]);

  if (!open) {
    return null;
  }

  function updateRow(
    index,
    field,
    value
  ) {
    setRows((previous) => {
      const updated = [...previous];

      updated[index] = {
        ...updated[index],
        [field]: value,
      };

      return updated;
    });
  }

  function addRow() {
    setRows((previous) => [
      ...previous,
      {
        bill_number: "",
        amount: "",
      },
    ]);
  }

  function removeRow(index) {
    if (rows.length === 1) {
      return;
    }

    setRows(
      rows.filter(
        (_, i) => i !== index
      )
    );
  }

  function handleKeyDown(
    e,
    rowIndex,
    field
  ) {
    if (e.key !== "Enter") {
      return;
    }

    e.preventDefault();

    if (field === "bill") {
      amountRefs.current[
        rowIndex
      ]?.focus();

      return;
    }

    if (
      rowIndex ===
      rows.length - 1
    ) {
      addRow();

      setTimeout(() => {
        billRefs.current[
          rowIndex + 1
        ]?.focus();
      }, 0);

      return;
    }

    billRefs.current[
      rowIndex + 1
    ]?.focus();
  }

  async function submit() {
    const entries =
      rows
        .filter(
          (row) =>
            row.bill_number.trim() &&
            Number(row.amount) > 0
        )
        .map((row) => ({
          bill_number:
            row.bill_number.trim(),

          amount:
            Number(row.amount),
        }));

    if (!entries.length) {
      alert(
        "Add at least one valid Udhaar entry."
      );
      return;
    }

    if (!dailyReportId) {
      alert(
        "Daily report is not selected."
      );
      return;
    }

    try {
      setSaving(true);

      await onSave(entries);

      setRows([
        {
          bill_number: "",
          amount: "",
        },
      ]);

    } catch (err) {
      console.error(
        "Failed to save Udhaar:",
        err
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">

      <div className="w-full max-h-[92vh] overflow-y-auto rounded-t-2xl bg-white p-5 sm:max-w-2xl sm:rounded-2xl sm:p-6">

        {/* Header */}

        <div>

          <h2 className="text-2xl font-bold text-gray-900">
            Add Udhaar Entries
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Enter Udhaar bills for the selected business date.
          </p>

        </div>


        {/* Rows */}

        <div className="mt-5 overflow-hidden rounded-xl border border-gray-200">

          {/* Desktop/table header */}

          <div className="hidden grid-cols-[2fr_1fr_60px] bg-gray-100 sm:grid">

            <div className="px-4 py-3 text-sm font-semibold">
              Bill Number
            </div>

            <div className="px-4 py-3 text-sm font-semibold">
              Amount
            </div>

            <div />

          </div>


          {rows.map(
            (row, index) => (

              <div
                key={index}
                className="border-t border-gray-200 sm:grid sm:grid-cols-[2fr_1fr_60px]"
              >

                {/* Bill */}

                <div className="p-3 sm:p-0">

                  <label className="mb-1 block text-xs font-medium text-gray-500 sm:hidden">
                    Bill Number
                  </label>

                  <input
                    ref={(el) => {
                      billRefs.current[
                        index
                      ] = el;
                    }}
                    value={
                      row.bill_number
                    }
                    disabled={saving}
                    onChange={(e) =>
                      updateRow(
                        index,
                        "bill_number",
                        e.target.value
                      )
                    }
                    onKeyDown={(e) =>
                      handleKeyDown(
                        e,
                        index,
                        "bill"
                      )
                    }
                    placeholder="Bill Number"
                    className="w-full rounded-lg border border-gray-200 px-3 py-3 outline-none focus:border-blue-500 sm:rounded-none sm:border-0 sm:border-r"
                  />

                </div>


                {/* Amount */}

                <div className="px-3 pb-3 sm:p-0">

                  <label className="mb-1 block text-xs font-medium text-gray-500 sm:hidden">
                    Amount
                  </label>

                  <input
                    ref={(el) => {
                      amountRefs.current[
                        index
                      ] = el;
                    }}
                    type="number"
                    min="0"
                    step="0.01"
                    value={row.amount}
                    disabled={saving}
                    onChange={(e) =>
                      updateRow(
                        index,
                        "amount",
                        e.target.value
                      )
                    }
                    onKeyDown={(e) =>
                      handleKeyDown(
                        e,
                        index,
                        "amount"
                      )
                    }
                    placeholder="₹"
                    className="w-full rounded-lg border border-gray-200 px-3 py-3 outline-none focus:border-blue-500 sm:rounded-none sm:border-0 sm:border-r"
                  />

                </div>


                {/* Remove */}

                <div className="flex justify-end px-3 pb-3 sm:p-0">

                  <button
                    type="button"
                    onClick={() =>
                      removeRow(index)
                    }
                    disabled={saving}
                    className="rounded-lg px-4 py-2 text-sm text-red-500 hover:bg-red-50 disabled:opacity-50 sm:h-full sm:w-full sm:rounded-none"
                  >
                    ✕
                  </button>

                </div>

              </div>

            )
          )}

        </div>


        {/* Add Row */}

        <button
          type="button"
          onClick={addRow}
          disabled={saving}
          className="mt-4 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          + Add Row
        </button>


        {/* Actions */}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="w-full rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 disabled:opacity-50 sm:w-auto sm:py-2"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={submit}
            disabled={saving}
            className="w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400 sm:w-auto sm:py-2"
          >
            {saving
              ? "Saving..."
              : "Save All"}
          </button>

        </div>

      </div>

    </div>
  );
}