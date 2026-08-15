import {
  useEffect,
  useState,
} from "react";

import {
  CalendarDays,
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
    report.summary?.sales !==
      undefined &&
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
    report.summary?.bills !==
      undefined &&
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
    report.summary?.deliveries !==
      undefined &&
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

function calculateExpenses(
  expenses
) {
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
 *
 * IMPORTANT:
 *
 * Only purchases that:
 *
 * 1. have status "received"
 * 2. were received on the report's business date
 *
 * are counted.
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
            purchase.status ||
              ""
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
  /*
   * Details loaded separately for every
   * previous report.
   *
   * Structure:
   *
   * {
   *   [reportId]: {
   *     expenses: number,
   *     purchases: number
   *   }
   * }
   */

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
   * LOAD ACTUAL REPORT DETAILS
   * -------------------------------------------------------
   *
   * The previous-report list does not contain
   * the actual expense/purchase records.
   *
   * Therefore we load them using the existing
   * frontend services.
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

      setLoadingDetails(
        true
      );

      try {
        const results =
          await Promise.all(
            reports.map(
              async (report) => {

                try {
                  /*
                   * Get the complete report.
                   */
                  let fullReport =
                    report;

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
                   * Load expenses.
                   */
                  let expenses =
                    Array.isArray(
                      fullReport.expenses
                    )
                      ? fullReport.expenses
                      : [];


                  if (
                    expenses.length ===
                    0
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
                   * Load purchases.
                   */
                  let purchases =
                    Array.isArray(
                      fullReport.purchases
                    )
                      ? fullReport.purchases
                      : [];


                  if (
                    purchases.length ===
                    0
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


        if (
          cancelled
        ) {
          return;
        }


        const mapped =
          {};

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

        if (
          !cancelled
        ) {
          setReportDetails(
            {}
          );
        }

      } finally {
        if (
          !cancelled
        ) {
          setLoadingDetails(
            false
          );
        }
      }
    }


    loadDetails();


    return () => {
      cancelled = true;
    };

  }, [reports]);


  /*
   * -------------------------------------------------------
   * TABLE
   * -------------------------------------------------------
   */

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

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

            {reports.length ===
            0 ? (

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
                (
                  report
                ) => {

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


                  /*
                   * While the actual details
                   * are loading, keep the table
                   * visually stable.
                   */
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

                      {/* DATE */}

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-2">

                          <CalendarDays
                            size={17}
                            className="text-gray-400"
                          />

                          <span>
                            {
                              report.date
                            }
                          </span>

                        </div>

                      </td>


                      {/* STORE */}

                      <td className="px-6 py-4 font-medium text-gray-700">

                        {
                          report.store
                        }

                      </td>


                      {/* BILLS */}

                      <td className="px-6 py-4 font-medium">

                        {
                          bills
                        }

                      </td>


                      {/* SALES */}

                      <td className="px-6 py-4 font-semibold text-blue-600">

                        ₹
                        {sales.toLocaleString(
                          "en-IN"
                        )}

                      </td>


                      {/* EXPENSES */}

                      <td className="px-6 py-4">

                        ₹
                        {expenses.toLocaleString(
                          "en-IN"
                        )}

                      </td>


                      {/* PURCHASES */}

                      <td className="px-6 py-4">

                        ₹
                        {purchases.toLocaleString(
                          "en-IN"
                        )}

                      </td>


                      {/* DELIVERIES */}

                      <td className="px-6 py-4">

                        {
                          deliveries
                        }

                      </td>


                      {/* STATUS */}

                      <td className="px-6 py-4">

                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                            report.status ===
                            "Locked"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >

                          {
                            report.status
                          }

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
  );
}