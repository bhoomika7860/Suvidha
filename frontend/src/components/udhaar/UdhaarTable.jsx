export default function UdhaarTable({
  entries,
  onRepay,
}) {
  if (!entries.length) {
    return (
      <div className="rounded-xl border bg-white p-10 text-center text-gray-500">
        No active udhaar.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-white">

      <table className="min-w-full">

        <thead className="bg-slate-100">
          <tr>

            <th className="px-4 py-3 text-left">
              Customer
            </th>

            <th className="px-4 py-3 text-left">
              Phone
            </th>

            <th className="px-4 py-3 text-left">
              Total
            </th>

            <th className="px-4 py-3 text-left">
              Paid
            </th>

            <th className="px-4 py-3 text-left">
              Remaining
            </th>

            <th className="px-4 py-3 text-center">
              Action
            </th>

          </tr>
        </thead>

        <tbody>

          {entries.map((entry) => {

            const remaining =
              entry.amount - entry.paid_amount;

            return (
              <tr
                key={entry.id}
                className="border-t"
              >

                <td className="px-4 py-3">
                  {entry.customer_name}
                </td>

                <td className="px-4 py-3">
                  {entry.customer_phone}
                </td>

                <td className="px-4 py-3">
                  ₹{entry.amount}
                </td>

                <td className="px-4 py-3">
                  ₹{entry.paid_amount}
                </td>

                <td className="px-4 py-3 font-semibold text-red-600">
                  ₹{remaining}
                </td>

                <td className="px-4 py-3 text-center">

                  <button
                    onClick={() => onRepay(entry)}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                  >
                    Repay
                  </button>

                </td>

              </tr>
            );
          })}

        </tbody>

      </table>

    </div>
  );
}