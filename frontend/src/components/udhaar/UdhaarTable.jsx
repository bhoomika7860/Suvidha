export default function UdhaarTable({
  entries,
  onRepay,
  isOwner = false,
}) {
  if (!entries.length) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-gray-500">
        No active udhaar.
      </div>
    );
  }

  const totalOutstanding = entries.reduce(
    (sum, entry) =>
      sum +
      (
        Number(entry.amount || 0) -
        Number(entry.paid_amount || 0)
      ),
    0
  );

  return (
    <>
      {/* =====================================================
          DESKTOP
      ===================================================== */}

      <div className="hidden lg:block overflow-hidden rounded-xl border bg-white">

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

              const amount =
                Number(entry.amount || 0);

              const paid =
                Number(entry.paid_amount || 0);

              const remaining =
                amount - paid;

              return (
                <tr
                  key={entry.id}
                  className="border-t transition hover:bg-gray-50"
                >

                  <td className="px-6 py-4 font-medium">
                    {entry.bill_number}
                  </td>

                  <td className="px-6 py-4 text-right">
                    ₹{amount.toLocaleString("en-IN")}
                  </td>

                  <td className="px-6 py-4 text-right text-green-600">
                    ₹{paid.toLocaleString("en-IN")}
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

        {/* Desktop Footer */}

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


      {/* =====================================================
          MOBILE
      ===================================================== */}

      <div className="lg:hidden space-y-3">

        {entries.map((entry) => {

          const amount =
            Number(entry.amount || 0);

          const paid =
            Number(entry.paid_amount || 0);

          const remaining =
            amount - paid;

          return (
            <div
              key={entry.id}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
            >

              {/* Bill + Repay */}

              <div className="flex items-center justify-between gap-3">

                <div className="min-w-0">

                  <p className="text-xs text-slate-500">
                    Bill No.
                  </p>

                  <p className="mt-0.5 truncate text-sm font-semibold text-gray-900">
                    {entry.bill_number}
                  </p>

                </div>

                {!isOwner && (
                  <button
                    onClick={() => onRepay(entry)}
                    className="shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white active:bg-blue-700"
                  >
                    Repay
                  </button>
                )}

              </div>


              {/* Amounts */}

              <div className="mt-4 grid grid-cols-3 gap-2 border-t border-gray-100 pt-3">

                <div>

                  <p className="text-xs text-slate-500">
                    Total
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-900">
                    ₹{amount.toLocaleString("en-IN")}
                  </p>

                </div>


                <div>

                  <p className="text-xs text-slate-500">
                    Paid
                  </p>

                  <p className="mt-1 text-sm font-medium text-green-600">
                    ₹{paid.toLocaleString("en-IN")}
                  </p>

                </div>


                <div>

                  <p className="text-xs text-slate-500">
                    Remaining
                  </p>

                  <p className="mt-1 text-sm font-semibold text-red-600">
                    ₹{remaining.toLocaleString("en-IN")}
                  </p>

                </div>

              </div>

            </div>
          );
        })}


        {/* Mobile Total */}

        <div className="rounded-xl border border-gray-200 bg-white px-4 py-4">

          <p className="text-sm text-gray-500">
            Total Outstanding Udhaar
          </p>

          <h2 className="mt-1 text-2xl font-bold text-blue-600">
            ₹{totalOutstanding.toLocaleString("en-IN")}
          </h2>

        </div>

      </div>
    </>
  );
}