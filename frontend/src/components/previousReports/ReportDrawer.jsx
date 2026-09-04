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
    Array.isArray(report.expenses)
      ? report.expenses
      : [];

  const purchases =
    Array.isArray(report.purchases)
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


  /*
   * ========================================
   * RENDER
   * ========================================
   */

  return (
    <>

      {/* =====================================================
          OVERLAY
      ===================================================== */}

      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/30"
      />


      {/* =====================================================
          DESKTOP DRAWER
      ===================================================== */}

      <div className="fixed right-0 top-0 z-50 hidden h-screen w-[620px] overflow-y-auto bg-white shadow-2xl lg:block">

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

            {expenses.length === 0 ? (

              <p className="text-gray-500">
                No expenses recorded.
              </p>

            ) : (

              <>

                <div className="space-y-4">

                  {expenses.map(
                    (expense) => (

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
            ).length === 0 ? (

              <p className="text-gray-500">
                No delivery assignments recorded.
              </p>

            ) : (

              <div className="space-y-4">

                {report.delivery_assignments.map(
                  (delivery) => (

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


      {/* =====================================================
          MOBILE DRAWER
      ===================================================== */}

      <div className="fixed inset-0 z-50 overflow-y-auto bg-white lg:hidden">

        {/* =================================================
            MOBILE HEADER
        ================================================= */}

        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-5 py-4">

          <div>

            <h2 className="text-xl font-bold leading-tight text-gray-900">
              Daily Report
            </h2>

            <p className="mt-1 flex items-center gap-2 text-sm text-gray-500">

              <CalendarDays
                size={15}
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
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-900 active:bg-gray-100"
            aria-label="Close report"
          >
            <X size={22} />
          </button>

        </div>


        {/* =================================================
            MOBILE CONTENT
        ================================================= */}

        <div className="space-y-4 bg-gray-50 px-4 py-5 pb-8">

          {/* =================================================
              SUMMARY
          ================================================= */}

          <div className="grid grid-cols-2 gap-3">

            <MobileSummaryCard
              icon={
                <Receipt size={17} />
              }
              title="Bills"
              value={bills}
            />


            <MobileSummaryCard
              icon={
                <Wallet size={17} />
              }
              title="Sales"
              value={`₹${actualSales.toLocaleString(
                "en-IN"
              )}`}
              valueClass="text-gray-900"
            />


            <MobileSummaryCard
              icon={
                <Package size={17} />
              }
              title="Purchases"
              value={`₹${totalPurchasesReceivedToday.toLocaleString(
                "en-IN"
              )}`}
            />


            <MobileSummaryCard
              icon={
                <Truck size={17} />
              }
              title="Deliveries"
              value={deliveries}
            />

          </div>


          {/* =================================================
              PAYMENT BREAKDOWN
          ================================================= */}

          <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4">

            <h3 className="mb-4 text-base font-semibold text-gray-900">
              Payment Breakdown
            </h3>


            <div className="space-y-3">

              <MobileRow
                title="Cash"
                value={`₹${cash.toLocaleString(
                  "en-IN"
                )}`}
              />

              <MobileRow
                title="UPI"
                value={`₹${upi.toLocaleString(
                  "en-IN"
                )}`}
              />

              <MobileRow
                title="Card"
                value={`₹${card.toLocaleString(
                  "en-IN"
                )}`}
              />

              <MobileRow
                title="Udhaar"
                value={`₹${udhaar.toLocaleString(
                  "en-IN"
                )}`}
              />

            </div>


            <div className="my-3 border-t border-gray-200" />


            <div className="space-y-2.5">

              <MobileRow
                title="Actual Sales"
                value={`₹${actualSales.toLocaleString(
                  "en-IN"
                )}`}
                strong
              />

              <MobileRow
                title="System Sales"
                value={`₹${systemSales.toLocaleString(
                  "en-IN"
                )}`}
                strong
              />

            </div>


            <div className="mt-3 flex items-center justify-between border-t border-gray-200 pt-3">

              <span className="text-sm font-semibold text-gray-900">
                Sales Difference
              </span>

              <span
                className={`text-sm font-bold ${
                  salesDifference === 0
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


          {/* =================================================
              EXPENSES
          ================================================= */}

          <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4">

            <div className="flex items-center justify-between">

              <h3 className="text-base font-semibold text-gray-900">
                Expenses
              </h3>

              <span className="text-sm font-bold text-gray-900">
                ₹
                {totalExpenses.toLocaleString(
                  "en-IN"
                )}
              </span>

            </div>


            {expenses.length > 0 && (

              <div className="mt-3 space-y-2 border-t border-gray-100 pt-3">

                {expenses.map(
                  (expense) => (

                    <MobileRow
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

            )}

          </div>


          {/* =================================================
              PURCHASES
          ================================================= */}

          <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4">

            <div className="flex items-center justify-between">

              <div>

                <h3 className="text-base font-semibold text-gray-900">
                  Purchases
                </h3>

                <p className="mt-0.5 text-xs text-gray-500">
                  Received on this business date
                </p>

              </div>

              <Package
                size={19}
                className="text-blue-600"
              />

            </div>


            <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">

              <span className="text-sm text-gray-500">
                Total received
              </span>

              <span className="text-lg font-bold text-blue-600">
                ₹
                {totalPurchasesReceivedToday.toLocaleString(
                  "en-IN"
                )}
              </span>

            </div>

          </div>


          {/* =================================================
              DELIVERIES
          ================================================= */}

          <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4">

            <div className="flex items-center justify-between">

              <h3 className="text-base font-semibold text-gray-900">
                Deliveries
              </h3>

              <span className="text-lg font-bold text-gray-900">
                {deliveries}
              </span>

            </div>


            {(
              report.delivery_assignments ||
              []
            ).length > 0 && (

              <div className="mt-3 space-y-2 border-t border-gray-100 pt-3">

                {report.delivery_assignments.map(
                  (delivery) => (

                    <MobileRow
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


          


          {/* =================================================
              STATUS
          ================================================= */}

          <div className="flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 px-4 py-3.5">

            <CheckCircle2
              size={20}
              className="shrink-0 text-green-600"
            />

            <div>

              <p className="text-sm font-semibold text-green-700">
                Report Submitted
              </p>

              <p className="mt-0.5 text-xs text-gray-600">
                This report is locked and cannot be edited.
              </p>

            </div>

          </div>

        </div>

      </div>

    </>
  );
}


/*
 * =========================================================
 * DESKTOP SUMMARY CARD
 * =========================================================
 */

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


/*
 * =========================================================
 * DESKTOP ROW
 * =========================================================
 */

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


/*
 * =========================================================
 * MOBILE SUMMARY CARD
 * =========================================================
 */

function MobileSummaryCard({
  icon,
  title,
  value,
  valueClass = "text-gray-900",
}) {
  return (
    <div className="rounded-2xl border border-gray-300 bg-white px-4 py-4">

      <div className="flex items-center gap-2 text-gray-500">

        {icon}

        <span className="text-sm">
          {title}
        </span>

      </div>

      <p
        className={`mt-4 text-[21px] font-bold leading-none ${valueClass}`}
      >
        {value}
      </p>

    </div>
  );
}


/*
 * =========================================================
 * MOBILE ROW
 * =========================================================
 */

function MobileRow({
  title,
  value,
  strong = false,
}) {
  return (
    <div className="flex items-center justify-between gap-4">

      <span
        className={`text-sm ${
          strong
            ? "font-medium text-gray-700"
            : "text-gray-500"
        }`}
      >
        {title}
      </span>

      <span
        className={`text-right text-sm ${
          strong
            ? "font-semibold text-gray-900"
            : "font-medium text-gray-900"
        }`}
      >
        {value}
      </span>

    </div>
  );
}