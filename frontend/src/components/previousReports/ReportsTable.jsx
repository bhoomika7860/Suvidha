import {
  useEffect,
  useState,
} from "react";

import {
  CalendarDays,
  ChevronRight,
} from "lucide-react";

import dailyReportsService from "../../services/dailyReportsService";


/*
 * ---------------------------------------------------------
 * DATE HELPERS
 * ---------------------------------------------------------
 */

function getIndiaBusinessDate(value) {
  if (!value) {
    return null;
  }

  try {
    return new Intl.DateTimeFormat(
      "en-CA",
      {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }
    ).format(
      new Date(value)
    );
  } catch {
    return null;
  }
}


/*
 * ---------------------------------------------------------
 * SALES
 * ---------------------------------------------------------
 */

function getSalesTotal(report) {
  if (
    report.sales !== undefined &&
    report.sales !== null
  ) {
    return Number(
      report.sales || 0
    );
  }

  if (
    report.summary?.sales !== undefined &&
    report.summary?.sales !== null
  ) {
    return Number(
      report.summary.sales || 0
    );
  }

  return (
    Number(
      report.cash_sales || 0
    ) +
    Number(
      report.upi_sales || 0
    ) +
    Number(
      report.card_sales || 0
    ) +
    Number(
      report.udhaar_sales || 0
    )
  );
}


/*
 * ---------------------------------------------------------
 * BILLS
 * ---------------------------------------------------------
 */

function getBillsTotal(report) {
  if (
    report.bills !== undefined &&
    report.bills !== null
  ) {
    return Number(
      report.bills || 0
    );
  }

  if (
    report.summary?.bills !== undefined &&
    report.summary?.bills !== null
  ) {
    return Number(
      report.summary.bills || 0
    );
  }

  return Number(
    report.total_bills || 0
  );
}


/*
 * ---------------------------------------------------------
 * DELIVERIES
 * ---------------------------------------------------------
 */

function getDeliveriesTotal(report) {
  if (
    report.deliveries !== undefined &&
    report.deliveries !== null
  ) {
    return Number(
      report.deliveries || 0
    );
  }

  if (
    report.summary?.deliveries !== undefined &&
    report.summary?.deliveries !== null
  ) {
    return Number(
      report.summary.deliveries || 0
    );
  }

  return Number(
    report.total_deliveries || 0
  );
}


/*
 * ---------------------------------------------------------
 * EXPENSES
 * ---------------------------------------------------------
 */

function calculateExpenses(expenses) {
  if (
    !Array.isArray(expenses)
  ) {
    return 0;
  }

  return expenses.reduce(
    (
      sum,
      expense
    ) =>
      sum +
      Number(
        expense.amount || 0
      ),
    0
  );
}


/*
 * ---------------------------------------------------------
 * PURCHASES
 * ---------------------------------------------------------
 */

function calculateTodaysReceivedPurchases(
  purchases,
  report
) {
  if (
    !Array.isArray(purchases)
  ) {
    return 0;
  }

  const reportDate =
    getIndiaBusinessDate(
      report.report_date ||
        report.date
    );

  if (!reportDate) {
    return 0;
  }

  return purchases
    .filter(
      (purchase) => {
        const status =
          String(
            purchase.status || ""
          ).toLowerCase();

        if (
          status !==
          "received"
        ) {
          return false;
        }

        const receivedDate =
          getIndiaBusinessDate(
            purchase.received_date ||
              purchase.received_at ||
              purchase.created_at
          );

        return (
          receivedDate ===
          reportDate
        );
      }
    )
    .reduce(
      (
        sum,
        purchase
      ) =>
        sum +
        Number(
          purchase.purchase_amount ??
            purchase.amount ??
            0
        ),
      0
    );
}


/*
 * ---------------------------------------------------------
 * COMPONENT
 * ---------------------------------------------------------
 */

export default function ReportsTable({
  reports,
  onOpen,
}) {
  const [
    reportDetails,
    setReportDetails,
  ] = useState({});


  const [
    loadingDetails,
    setLoadingDetails,
  ] = useState(false);


  /*
   * -------------------------------------------------------
   * LOAD REPORT DETAILS
   * -------------------------------------------------------
   */

  useEffect(() => {
    let cancelled = false;

    async function loadDetails() {
      if (
        !Array.isArray(reports) ||
        reports.length === 0
      ) {
        setReportDetails({});
        return;
      }

      setLoadingDetails(true);

      try {
        const results =
          await Promise.all(
            reports.map(
              async (report) => {
                try {
                  let fullReport =
                    report;


                  /*
                   * Get complete report.
                   */

                  try {
                    const detailedReport =
                      await dailyReportsService.getReport(
                        Number(
                          report.id
                        )
                      );

                    if (
                      detailedReport
                    ) {
                      fullReport =
                        detailedReport;
                    }
                  } catch (err) {
                    console.warn(
                      "Could not load detailed report:",
                      report.id,
                      err
                    );
                  }


                  /*
                   * Expenses.
                   */

                  let expenses =
                    Array.isArray(
                      fullReport.expenses
                    )
                      ? fullReport.expenses
                      : [];


                  if (
                    expenses.length === 0
                  ) {
                    try {
                      const expenseData =
                        await dailyReportsService.getExpenses(
                          Number(
                            report.id
                          )
                        );

                      if (
                        Array.isArray(
                          expenseData
                        )
                      ) {
                        expenses =
                          expenseData;
                      }
                    } catch (err) {
                      console.warn(
                        "Could not load expenses:",
                        report.id,
                        err
                      );
                    }
                  }


                  /*
                   * Purchases.
                   */

                  let purchases =
                    Array.isArray(
                      fullReport.purchases
                    )
                      ? fullReport.purchases
                      : [];


                  if (
                    purchases.length === 0
                  ) {
                    try {
                      const purchaseData =
                        await dailyReportsService.getPurchases(
                          Number(
                            report.id
                          )
                        );

                      if (
                        Array.isArray(
                          purchaseData
                        )
                      ) {
                        purchases =
                          purchaseData;
                      }
                    } catch (err) {
                      console.warn(
                        "Could not load purchases:",
                        report.id,
                        err
                      );
                    }
                  }


                  return {
                    id:
                      report.id,

                    expenses:
                      calculateExpenses(
                        expenses
                      ),

                    purchases:
                      calculateTodaysReceivedPurchases(
                        purchases,
                        fullReport
                      ),
                  };

                } catch (err) {
                  console.error(
                    "Failed to load report details:",
                    report.id,
                    err
                  );

                  return {
                    id:
                      report.id,

                    expenses: 0,

                    purchases: 0,
                  };
                }
              }
            )
          );


        if (cancelled) {
          return;
        }


        const mapped = {};

        results.forEach(
          (result) => {
            mapped[
              result.id
            ] = {
              expenses:
                result.expenses,

              purchases:
                result.purchases,
            };
          }
        );


        setReportDetails(
          mapped
        );

      } catch (err) {
        console.error(
          "Failed to load previous report details:",
          err
        );

        if (!cancelled) {
          setReportDetails({});
        }

      } finally {
        if (!cancelled) {
          setLoadingDetails(false);
        }
      }
    }


    loadDetails();


    return () => {
      cancelled = true;
    };

  }, [reports]);


  return (
    <>
      {/* ===================================================
          DESKTOP
      =================================================== */}

      <div className="hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm lg:block">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[900px]">

            <thead className="bg-gray-50">

              <tr>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Date
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Store
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Bills
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Sales
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Expenses
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Purchases
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Deliveries
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Status
                </th>

              </tr>

            </thead>


            <tbody>

              {reports.length === 0 ? (

                <tr>

                  <td
                    colSpan={8}
                    className="px-6 py-16 text-center text-gray-500"
                  >
                    No previous reports found.
                  </td>

                </tr>

              ) : (

                reports.map(
                  (report) => {

                    const sales =
                      getSalesTotal(
                        report
                      );

                    const bills =
                      getBillsTotal(
                        report
                      );

                    const deliveries =
                      getDeliveriesTotal(
                        report
                      );

                    const details =
                      reportDetails[
                        report.id
                      ];

                    const expenses =
                      details
                        ? Number(
                            details.expenses ||
                              0
                          )
                        : 0;

                    const purchases =
                      details
                        ? Number(
                            details.purchases ||
                              0
                          )
                        : 0;


                    return (
                      <tr
                        key={
                          report.id
                        }
                        onClick={() =>
                          onOpen(
                            report
                          )
                        }
                        className="cursor-pointer border-t border-gray-200 transition hover:bg-blue-50"
                      >

                        <td className="px-6 py-4">

                          <div className="flex items-center gap-2">

                            <CalendarDays
                              size={17}
                              className="text-gray-400"
                            />

                            <span>
                              {report.date}
                            </span>

                          </div>

                        </td>


                        <td className="px-6 py-4 font-medium text-gray-700">
                          {report.store}
                        </td>


                        <td className="px-6 py-4 font-medium">
                          {bills}
                        </td>


                        <td className="px-6 py-4 font-semibold text-blue-600">
                          ₹
                          {sales.toLocaleString(
                            "en-IN"
                          )}
                        </td>


                        <td className="px-6 py-4">
                          ₹
                          {expenses.toLocaleString(
                            "en-IN"
                          )}
                        </td>


                        <td className="px-6 py-4">
                          ₹
                          {purchases.toLocaleString(
                            "en-IN"
                          )}
                        </td>


                        <td className="px-6 py-4">
                          {deliveries}
                        </td>


                        <td className="px-6 py-4">

                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                              report.status ===
                              "Locked"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {report.status}
                          </span>

                        </td>

                      </tr>
                    );
                  }
                )

              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* ===================================================
          MOBILE
      =================================================== */}

      <div className="space-y-3 lg:hidden">

        {reports.length === 0 ? (

          <div className="rounded-xl border border-gray-200 bg-white p-7 text-center text-sm font-medium text-gray-500">
            No previous reports found.
          </div>

        ) : (

          reports.map((report) => {

            const sales =
              getSalesTotal(
                report
              );

            const bills =
              getBillsTotal(
                report
              );

            const deliveries =
              getDeliveriesTotal(
                report
              );

            const details =
              reportDetails[
                report.id
              ];

            const expenses =
              details
                ? Number(
                    details.expenses || 0
                  )
                : 0;

            const purchases =
              details
                ? Number(
                    details.purchases || 0
                  )
                : 0;


            return (
              <button
                key={report.id}
                type="button"
                onClick={() =>
                  onOpen(report)
                }
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-4 text-left shadow-sm transition active:scale-[0.995]"
              >

                {/* =================================================
                    TOP ROW
                ================================================= */}

                <div className="flex items-center justify-between gap-3">

                  <div className="min-w-0">

                    <div className="flex items-center gap-2">

                      <CalendarDays
                        size={16}
                        strokeWidth={2}
                        className="shrink-0 text-gray-400"
                      />

                      <p className="text-[15px] font-bold leading-tight text-gray-900">
                        {report.date}
                      </p>

                    </div>

                    <p className="mt-1 truncate pl-6 text-[13px] font-medium text-gray-600">
                      {report.store}
                    </p>

                  </div>


                  <div className="flex shrink-0 items-center gap-2">

                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                        report.status === "Locked"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {report.status}
                    </span>

                    <ChevronRight
                      size={17}
                      strokeWidth={2}
                      className="text-gray-400"
                    />

                  </div>

                </div>


                {/* =================================================
                    REPORT NUMBERS
                ================================================= */}

                <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2.5 border-t border-gray-100 pt-3">

                  {/* SALES */}

                  <div>

                    <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                      Sales
                    </p>

                    <p className="mt-0.5 text-[17px] font-bold leading-tight text-blue-600">
                      ₹
                      {sales.toLocaleString(
                        "en-IN"
                      )}
                    </p>

                  </div>


                  {/* BILLS */}

                  <div>

                    <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                      Bills
                    </p>

                    <p className="mt-0.5 text-[17px] font-bold leading-tight text-gray-900">
                      {bills}
                    </p>

                  </div>


                  {/* PURCHASES */}

                  <div>

                    <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                      Purchases
                    </p>

                    <p className="mt-0.5 text-[15px] font-bold leading-tight text-gray-900">
                      ₹
                      {purchases.toLocaleString(
                        "en-IN"
                      )}
                    </p>

                  </div>


                  {/* EXPENSES */}

                  <div>

                    <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                      Expenses
                    </p>

                    <p className="mt-0.5 text-[15px] font-bold leading-tight text-gray-900">
                      ₹
                      {expenses.toLocaleString(
                        "en-IN"
                      )}
                    </p>

                  </div>

                </div>


                {/* =================================================
                    FOOTER
                ================================================= */}

                <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-2.5">

                  <p className="text-xs font-medium text-gray-500">
                    Deliveries:{" "}
                    <span className="font-bold text-gray-900">
                      {deliveries}
                    </span>
                  </p>

                  <p className="text-xs font-semibold text-blue-600">
                    View report
                  </p>

                </div>

              </button>
            );
          })

        )}

      </div>
    </>
  );
}