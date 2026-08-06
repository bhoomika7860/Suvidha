export default function UdhaarTable({
  entries,
  onRepay,
  isOwner = false,
}) {
  if (!entries.length) {
    return (
      <div className="rounded-xl border bg-white p-10 text-center text-gray-500">
        No active udhaar.
      </div>
    );
  }

  const totalOutstanding = entries.reduce(
    (sum, entry) => sum + (entry.amount - entry.paid_amount),
    0
  );

  return (
    <div className="overflow-hidden rounded-xl border bg-white">

      <table className="min-w-full">

        <thead className="bg-slate-100">
  <tr>

    <th className="px-6 py-4 text-left">
      Bill No.
    </th>

    <th className="px-6 py-4 text-right">
      Total
    </th>

    <th className="px-6 py-4 text-right">
      Paid
    </th>

    <th className="px-6 py-4 text-right">
      Remaining
    </th>

    {!isOwner && (
      <th className="px-6 py-4 text-center">
        Action
      </th>
    )}

  </tr>
</thead>

        <tbody>

          {entries.map((entry) => {

            const remaining =
              entry.amount - entry.paid_amount;

            return (
              <tr
  key={entry.id}
  className="border-t hover:bg-gray-50 transition"
>

  <td className="px-6 py-4 font-medium">
    {entry.bill_number}
  </td>

  <td className="px-6 py-4 text-right">
    ₹{entry.amount.toLocaleString("en-IN")}
  </td>

  <td className="px-6 py-4 text-right text-green-600">
    ₹{entry.paid_amount.toLocaleString("en-IN")}
  </td>

  <td className="px-6 py-4 text-right font-semibold text-red-600">
    ₹{remaining.toLocaleString("en-IN")}
  </td>

  {!isOwner && (
    <td className="px-6 py-4 text-center">

      <button
        onClick={() => onRepay(entry)}
        className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Repay
      </button>

    </td>
  )}

</tr>
            );
          })}

        </tbody>

      </table>

      {/* Footer */}

      <div className="flex justify-end border-t bg-slate-50 px-6 py-5">

        <div className="text-right">

          <p className="text-sm text-gray-500">
            Total Outstanding Udhaar
          </p>

          <h2 className="mt-1 text-3xl font-bold text-blue-600">
            ₹{totalOutstanding.toLocaleString("en-IN")}
          </h2>

        </div>

      </div>

    </div>
  );
}