import {
  CalendarDays,
  Receipt,
  Wallet,
  Package,
  Truck,
  CheckCircle2,
  X,
} from "lucide-react";

/*
 * Convert a purchase timestamp into the
 * Indian business date.
 *
 * Backend timestamps are handled using
 * Asia/Kolkata so the purchase is counted
 * against the correct pharmacy business date.
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
    ).format(new Date(value));
  } catch (err) {
    console.error(
      "Failed to convert purchase date:",
      err
    );

    return null;
  }
}

export default function ReportDrawer({
  report,
  isOpen,
  onClose,
}) {
  if (
    !isOpen ||
    !report
  ) {
    return null;
  }

  const rawExpenses =
    Array.isArray(
      report.expenses
    )
      ? report.expenses
      : [];

  const purchases =
    Array.isArray(
      report.purchases
    )
      ? report.purchases
      : Array.isArray(
          report.completed_purchases
        )
      ? report.completed_purchases
      : [];


  /*
   * ----------------------------------------
   * REPORT BUSINESS DATE
   * ----------------------------------------
   */

  const reportBusinessDate =
    report.report_date
      ? getIndiaBusinessDate(
          report.report_date
        )
      : null;


  /*
   * ----------------------------------------
   * EXPENSES
   * ----------------------------------------
   */

  const groupedExpenses = {};

  rawExpenses.forEach(
    (expense) => {
      const key =
        expense.expense_type ||
        expense.title ||
        expense.category ||
        "Other";

      if (
        !groupedExpenses[key]
      ) {
        groupedExpenses[key] = 0;
      }

      groupedExpenses[key] +=
        Number(
          expense.amount || 0
        );
    }
  );

  const expenses =
    Object.entries(
      groupedExpenses
    ).map(
      (
        [
          expense_type,
          amount,
        ],
        index
      ) => ({
        id: index,
        expense_type,
        amount,
      })
    );

  const totalExpenses =
    expenses.reduce(
      (
        sum,
        item
      ) =>
        sum +
        Number(
          item.amount || 0
        ),
      0
    );


  /*
   * ----------------------------------------
   * TODAY'S RECEIVED PURCHASES
   * ----------------------------------------
   *
   * ONLY:
   *
   * 1. status = received
   * 2. received_date = report business date
   *
   * Nothing else is included.
   */

  const receivedTodayPurchases =
    purchases.filter(
      (purchase) => {
        const status =
          String(
            purchase.status || ""
          ).toLowerCase();

        if (
          status !== "received"
        ) {
          return false;
        }

        const receivedDate =
          getIndiaBusinessDate(
            purchase.received_date
          );

        return (
          receivedDate ===
          reportBusinessDate
        );
      }
    );


  /*
   * Total amount of ONLY the bills
   * received on this report's date.
   */

  const totalPurchasesReceivedToday =
    receivedTodayPurchases.reduce(
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


  /*
   * ----------------------------------------
   * SALES
   * ----------------------------------------
   */

  const actualSales =
    report.summary?.sales !==
      undefined &&
    report.summary?.sales !==
      null
      ? Number(
          report.summary.sales ||
            0
        )
      : (
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


  const systemSales =
    Number(
      report.payments
        ?.system_sales ??
        report.system_sales ??
        0
    );


  const salesDifference =
    actualSales -
    systemSales;


  const bills =
    Number(
      report.summary?.bills ??
        report.total_bills ??
        0
    );


  const deliveries =
    Number(
      report.summary
        ?.deliveries ??
        report.deliveries ??
        0
    );


  const cash =
    Number(
      report.payments?.cash ??
        report.cash_sales ??
        0
    );


  const upi =
    Number(
      report.payments?.upi ??
        report.upi_sales ??
        0
    );


  const card =
    Number(
      report.payments?.card ??
        report.card_sales ??
        0
    );


  const udhaar =
    Number(
      report.payments?.udhaar ??
        report.udhaar_sales ??
        0
    );


  return (
    <>

      {/* Overlay */}

      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/30"
      />


      {/* Drawer */}

      <div className="fixed right-0 top-0 z-50 h-screen w-full overflow-y-auto bg-white shadow-2xl sm:w-[620px]">

        {/* Header */}

        <div className="flex items-center justify-between border-b px-6 py-5">

          <div>

            <h2 className="text-2xl font-bold">
              Daily Report
            </h2>

            <p className="mt-1 flex items-center gap-2 text-gray-500">

              <CalendarDays
                size={16}
              />

              {new Date(
                report.report_date
              ).toLocaleDateString(
                "en-GB",
                {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }
              )}

            </p>

          </div>


          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <X size={22} />
          </button>

        </div>


        <div className="space-y-6 p-6">

          {/* Summary */}

          <div className="grid grid-cols-2 gap-4">

            <SummaryCard
              icon={
                <Receipt size={18} />
              }
              title="Bills"
              value={bills}
            />


            <SummaryCard
              icon={
                <Wallet size={18} />
              }
              title="Sales"
              value={`₹${actualSales.toLocaleString(
                "en-IN"
              )}`}
            />


            <SummaryCard
              icon={
                <Package size={18} />
              }
              title="Purchases"
              value={`₹${totalPurchasesReceivedToday.toLocaleString(
                "en-IN"
              )}`}
            />


            <SummaryCard
              icon={
                <Truck size={18} />
              }
              title="Deliveries"
              value={deliveries}
            />

          </div>


          {/* Payment Breakdown */}

          <div className="rounded-2xl border p-5">

            <h3 className="mb-4 font-semibold">
              Payment Breakdown
            </h3>

            <div className="space-y-5">

              <Row
                title="Cash"
                value={`₹${cash.toLocaleString(
                  "en-IN"
                )}`}
              />

              <Row
                title="UPI"
                value={`₹${upi.toLocaleString(
                  "en-IN"
                )}`}
              />

              <Row
                title="Card"
                value={`₹${card.toLocaleString(
                  "en-IN"
                )}`}
              />

              <Row
                title="Udhaar"
                value={`₹${udhaar.toLocaleString(
                  "en-IN"
                )}`}
              />

              <div className="border-t pt-4">

                <Row
                  title="Actual Sales"
                  value={`₹${actualSales.toLocaleString(
                    "en-IN"
                  )}`}
                />

                <Row
                  title="System Sales"
                  value={`₹${systemSales.toLocaleString(
                    "en-IN"
                  )}`}
                />

                <div className="mt-4 border-t pt-4">

                  <div className="flex items-center justify-between">

                    <span className="font-semibold">
                      Sales Difference
                    </span>

                    <span
                      className={`font-bold ${
                        salesDifference ===
                        0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      ₹
                      {Math.abs(
                        salesDifference
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* Expenses */}

          <div className="rounded-2xl border p-5">

            <h3 className="mb-4 font-semibold">
              Expenses
            </h3>

            {expenses.length ===
            0 ? (

              <p className="text-gray-500">
                No expenses recorded.
              </p>

            ) : (

              <>

                <div className="space-y-4">

                  {expenses.map(
                    (
                      expense
                    ) => (

                      <Row
                        key={
                          expense.id
                        }
                        title={
                          expense.expense_type
                        }
                        value={`₹${Number(
                          expense.amount ||
                            0
                        ).toLocaleString(
                          "en-IN"
                        )}`}
                      />

                    )
                  )}

                </div>

                <div className="mt-4 border-t pt-4">

                  <Row
                    title="Total"
                    value={`₹${totalExpenses.toLocaleString(
                      "en-IN"
                    )}`}
                  />

                </div>

              </>

            )}

          </div>


          {/* Purchases */}

          <div className="rounded-2xl border p-5">

            <div className="flex items-center justify-between">

              <div>

                <h3 className="font-semibold">
                  Purchases
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Purchase bills received on this business date.
                </p>

              </div>

              <Package
                size={20}
                className="text-blue-600"
              />

            </div>


            <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-5">

              <p className="text-sm font-medium text-blue-700">
                Purchases Received Today
              </p>

              <p className="mt-1 text-3xl font-bold text-blue-600">
                ₹
                {totalPurchasesReceivedToday.toLocaleString(
                  "en-IN"
                )}
              </p>

            </div>

          </div>


          {/* Deliveries */}

          <div className="rounded-2xl border p-5">

            <h3 className="mb-4 font-semibold">
              Deliveries
            </h3>

            {(
              report.delivery_assignments ||
              []
            ).length ===
            0 ? (

              <p className="text-gray-500">
                No delivery assignments recorded.
              </p>

            ) : (

              <div className="space-y-4">

                {report.delivery_assignments.map(
                  (
                    delivery
                  ) => (

                    <Row
                      key={
                        delivery.id
                      }
                      title={
                        delivery.delivery_boy_name
                      }
                      value={
                        delivery.deliveries_completed
                      }
                    />

                  )
                )}

              </div>

            )}

          </div>


          {/* Notes */}

          <div className="rounded-2xl border p-5">

            <h3 className="mb-3 font-semibold">
              Manager Notes
            </h3>

            <p className="leading-7 text-gray-600">
              {report.notes ||
                "No notes added."}
            </p>

          </div>


          {/* Status */}

          <div className="flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 p-5">

            <CheckCircle2 className="text-green-600" />

            <div>

              <p className="font-semibold text-green-700">
                Report Submitted
              </p>

              <p className="text-sm text-gray-600">
                This report is locked and cannot be edited.
              </p>

            </div>

          </div>

        </div>

      </div>

    </>
  );
}


function SummaryCard({
  icon,
  title,
  value,
}) {
  return (
    <div className="rounded-2xl border p-5">

      <div className="mb-3 flex items-center gap-2 text-gray-500">

        {icon}

        <span>
          {title}
        </span>

      </div>

      <h2 className="text-2xl font-bold">
        {value}
      </h2>

    </div>
  );
}


function Row({
  title,
  value,
}) {
  return (
    <div className="flex items-center justify-between gap-4">

      <span className="text-gray-600">
        {title}
      </span>

      <span className="text-right font-medium">
        {value}
      </span>

    </div>
  );
}