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

  const expenses = report.expenses || [];
  const purchases = report.purchases || [];
  const totalExpenses =
    expenses.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );

  return (
    <>
      {/* Overlay */}

      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/30 z-40"
      />

      {/* Drawer */}

      <div className="fixed right-0 top-0 h-screen w-[620px] bg-white shadow-2xl z-50 overflow-y-auto">

        {/* Header */}

        <div className="flex justify-between items-center border-b px-6 py-5">

          <div>
            <h2 className="text-2xl font-bold">
              Daily Report
            </h2>

            <p className="text-gray-500 mt-1 flex items-center gap-2">
              <CalendarDays size={16} />
              {new Date(report.report_date).toLocaleDateString(
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
            <X />
          </button>

        </div>

        <div className="p-6 space-y-6">

          {/* Summary */}

          <div className="grid grid-cols-2 gap-4">

            <SummaryCard
              icon={<Receipt size={18} />}
              title="Bills"
              value={report.summary.bills ?? 0}
            />

            <SummaryCard
              icon={<Wallet size={18} />}
              title="Sales"
              value={`₹${Number(report.summary.sales ?? 0).toLocaleString()}`}
            />

            <SummaryCard
              icon={<Package size={18} />}
              title="Purchases"
              value={`₹${Number(report.summary.purchases ?? 0).toLocaleString()}`}
            />

            <SummaryCard
              icon={<Truck size={18} />}
              title="Deliveries"
              value={report.summary.deliveries ?? 0}
            />

          </div>

          {/* Payment Breakdown */}

<div className="border rounded-2xl p-5">

  <h3 className="font-semibold mb-4">
    Payment Breakdown
  </h3>

  <div className="space-y-3">

    <Row
      title="Cash"
      value={`₹${Number(
        report.payments?.cash ?? 0
      ).toLocaleString()}`}
    />

    <Row
      title="UPI"
      value={`₹${Number(
        report.payments?.upi ?? 0
      ).toLocaleString()}`}
    />

    <Row
      title="Card"
      value={`₹${Number(
        report.payments?.card ?? 0
      ).toLocaleString()}`}
    />

    <Row
      title="Udhaar"
      value={`₹${Number(
        report.payments?.udhaar ?? 0
      ).toLocaleString()}`}
    />

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
                {expenses.map((expense) => (

                  <Row
                    key={expense.id}
                    title={expense.expense_type}
                    value={`₹${Number(expense.amount).toLocaleString()}`}
                  />

                ))}

                <div className="border-t mt-4 pt-4 flex justify-between font-semibold">

                  <span>Total</span>

                  <span>
                    ₹{totalExpenses.toLocaleString()}
                  </span>

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

              purchases.map((purchase) => (

                <Row
                  key={purchase.id}
                  title={purchase.product_name}
                  value={`₹${Number(purchase.amount).toLocaleString()}`}
                />

              ))

            )}

          </div>

          {/* Notes */}

          <div className="border rounded-2xl p-5">

            <h3 className="font-semibold mb-3">
              Manager Notes
            </h3>

            <p className="text-gray-600 leading-7">

              {report.notes || "No notes added."}

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
    <div className="border rounded-2xl p-4">

      <div className="flex items-center gap-2 text-gray-500 mb-3">
        {icon}
        {title}
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
    <div className="flex justify-between py-2">

      <span className="text-gray-600">
        {title}
      </span>

      <span className="font-medium">
        {value}
      </span>

    </div>
  );
}