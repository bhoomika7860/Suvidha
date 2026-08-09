import {
  CalendarDays,
  Receipt,
  Wallet,
  Package,
  Truck,
  CheckCircle2,
  X,
} from "lucide-react";

export default function ReportDrawer({
  report,
  isOpen,
  onClose,
}) {
  if (!isOpen || !report) return null;

  const rawExpenses =
    report.expenses || [];

  const purchases =
    report.purchases ||
    report.completed_purchases ||
    [];

  // ----------------------------------------
  // Group expenses
  // ----------------------------------------

  const groupedExpenses = {};

  rawExpenses.forEach((expense) => {
    const key =
      expense.expense_type ||
      expense.title ||
      expense.category ||
      "Other";

    if (!groupedExpenses[key]) {
      groupedExpenses[key] = 0;
    }

    groupedExpenses[key] += Number(
      expense.amount || 0
    );
  });

  const expenses =
    Object.entries(groupedExpenses).map(
      ([expense_type, amount], index) => ({
        id: index,
        expense_type,
        amount,
      })
    );

  const totalExpenses =
    expenses.reduce(
      (sum, item) =>
        sum + Number(item.amount || 0),
      0
    );

  // ----------------------------------------
  // Sales difference
  // ----------------------------------------

  const actualSales =
    Number(report.summary?.sales || 0);

  const systemSales =
    Number(
      report.payments?.system_sales ||
      0
    );

  const salesDifference =
    actualSales - systemSales;

  return (
    <>
      {/* Overlay */}

      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/30 z-40"
      />

      {/* Drawer */}

      <div className="fixed right-0 top-0 h-screen w-full sm:w-[620px] bg-white shadow-2xl z-50 overflow-y-auto">

        {/* Header */}

        <div className="flex justify-between items-center border-b px-6 py-5">

          <div>

            <h2 className="text-2xl font-bold">
              Daily Report
            </h2>

            <p className="text-gray-500 mt-1 flex items-center gap-2">

              <CalendarDays size={16} />

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
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <X size={22} />
          </button>

        </div>

        <div className="p-6 space-y-6">

          {/* Summary */}

          <div className="grid grid-cols-2 gap-4">

            <SummaryCard
              icon={
                <Receipt size={18} />
              }
              title="Bills"
              value={
                report.summary?.bills ?? 0
              }
            />

            <SummaryCard
              icon={
                <Wallet size={18} />
              }
              title="Sales"
              value={`₹${Number(
                report.summary?.sales || 0
              ).toLocaleString("en-IN")}`}
            />

            <SummaryCard
              icon={
                <Package size={18} />
              }
              title="Purchases"
              value={`₹${Number(
                report.summary?.purchases ||
                  0
              ).toLocaleString("en-IN")}`}
            />

            <SummaryCard
              icon={
                <Truck size={18} />
              }
              title="Deliveries"
              value={
                report.summary?.deliveries ??
                0
              }
            />

          </div>

          {/* Payment Breakdown */}

          <div className="border rounded-2xl p-5">

            <h3 className="font-semibold mb-4">
              Payment Breakdown
            </h3>

            <div className="space-y-5">

              <Row
                title="Cash"
                value={`₹${Number(
                  report.payments?.cash ||
                    0
                ).toLocaleString("en-IN")}`}
              />

              <Row
                title="UPI"
                value={`₹${Number(
                  report.payments?.upi ||
                    0
                ).toLocaleString("en-IN")}`}
              />

              <Row
                title="Card"
                value={`₹${Number(
                  report.payments?.card ||
                    0
                ).toLocaleString("en-IN")}`}
              />

              <Row
                title="Udhaar"
                value={`₹${Number(
                  report.payments?.udhaar ||
                    0
                ).toLocaleString("en-IN")}`}
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

                <div className="mt-4 pt-4 border-t">

                  <div className="flex justify-between">

                    <span className="font-semibold">
                      Sales Difference
                    </span>

                    <span
                      className={`font-bold ${
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

              </div>

            </div>

          </div>

          {/* Expenses */}

          <div className="border rounded-2xl p-5">

            <h3 className="font-semibold mb-4">
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

                <div className="border-t mt-4 pt-4">

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

          <div className="border rounded-2xl p-5">

            <h3 className="font-semibold mb-4">
              Purchases
            </h3>

            {purchases.length === 0 ? (

              <p className="text-gray-500">
                No purchases recorded.
              </p>

            ) : (

              <div className="space-y-4">

                {purchases.map(
                  (purchase) => (

                    <Row
                      key={purchase.id}
                      title={
                        purchase.product_name ||
                        purchase.supplier_name ||
                        "Purchase"
                      }
                      value={`₹${Number(
                        purchase.purchase_amount ??
                          purchase.amount ??
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

          {/* Deliveries */}

          <div className="border rounded-2xl p-5">

            <h3 className="font-semibold mb-4">
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
                      key={delivery.id}
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

          <div className="border rounded-2xl p-5">

            <h3 className="font-semibold mb-3">
              Manager Notes
            </h3>

            <p className="text-gray-600 leading-7">

              {report.notes ||
                "No notes added."}

            </p>

          </div>

          {/* Status */}

          <div className="rounded-2xl bg-green-50 border border-green-200 p-5 flex items-center gap-3">

            <CheckCircle2 className="text-green-600" />

            <div>

              <p className="font-semibold text-green-700">
                Report Submitted
              </p>

              <p className="text-sm text-gray-600">
                This report is locked and
                cannot be edited.
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
    <div className="border rounded-2xl p-5">

      <div className="flex items-center gap-2 text-gray-500 mb-3">

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
    <div className="flex justify-between items-center gap-4">

      <span className="text-gray-600">
        {title}
      </span>

      <span className="font-medium text-right">
        {value}
      </span>

    </div>
  );
}