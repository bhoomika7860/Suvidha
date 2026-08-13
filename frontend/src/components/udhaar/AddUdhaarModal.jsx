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

  const [
    saving,
    setSaving,
  ] = useState(false);

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
      const updated =
        [...previous];

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

      <div className="w-full max-w-2xl rounded-2xl bg-white p-6">

        <h2 className="text-2xl font-bold">
          Add Udhaar Entries
        </h2>

        <p className="mt-1 text-gray-500">
          Enter Udhaar bills for the selected business date.
        </p>

        <div className="mt-6 overflow-hidden rounded-xl border">

          <div className="grid grid-cols-[2fr_1fr_60px] bg-gray-100">

            <div className="px-4 py-3 font-semibold">
              Bill Number
            </div>

            <div className="px-4 py-3 font-semibold">
              Amount
            </div>

            <div />

          </div>

          {rows.map(
            (row, index) => (

              <div
                key={index}
                className="grid grid-cols-[2fr_1fr_60px] border-t"
              >

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
                  className="border-r px-4 py-3 outline-none disabled:bg-gray-100"
                />

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
                  className="border-r px-4 py-3 outline-none disabled:bg-gray-100"
                />

                <button
                  type="button"
                  onClick={() =>
                    removeRow(index)
                  }
                  disabled={saving}
                  className="text-red-500 hover:bg-red-50 disabled:opacity-50"
                >
                  ✕
                </button>

              </div>

            )
          )}

        </div>

        <button
          type="button"
          onClick={addRow}
          disabled={saving}
          className="mt-4 rounded-xl border px-4 py-2 hover:bg-gray-50 disabled:opacity-50"
        >
          + Add Row
        </button>

        <div className="mt-8 flex justify-end gap-3">

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-xl border px-5 py-2 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={submit}
            disabled={saving}
            className="rounded-xl bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
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