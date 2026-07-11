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

              {report.date}

            </p>

          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100"
          >

            <X />

          </button>

        </div>

        {/* Summary */}

        <div className="p-6 space-y-6">

          <div className="grid grid-cols-2 gap-4">

            <SummaryCard
              icon={<Receipt size={18} />}
              title="Bills"
              value={report.bills}
            />

            <SummaryCard
              icon={<Wallet size={18} />}
              title="Sales"
              value={`₹${report.sales.toLocaleString()}`}
            />

            <SummaryCard
              icon={<Package size={18} />}
              title="Purchases"
              value={`₹${report.purchases.toLocaleString()}`}
            />

            <SummaryCard
              icon={<Truck size={18} />}
              title="Deliveries"
              value={report.deliveries}
            />

          </div>

          {/* Payment Breakdown */}

          <div className="border rounded-2xl p-5">

            <h3 className="font-semibold mb-4">

              Payment Breakdown

            </h3>

            <div className="space-y-3 text-sm">

              <Row
                title="Cash"
                value="₹18,500"
              />

              <Row
                title="UPI"
                value="₹22,300"
              />

              <Row
                title="Card"
                value="₹9,100"
              />

              <Row
                title="Udhaar"
                value="₹4,200"
              />

            </div>

          </div>

          {/* Expenses */}

          <div className="border rounded-2xl p-5">

            <h3 className="font-semibold mb-4">
              Expenses
            </h3>

            <Row
              title="Electricity"
              value="₹1,200"
            />

            <Row
              title="Tea & Snacks"
              value="₹250"
            />

            <div className="border-t mt-4 pt-4 flex justify-between font-semibold">

              <span>Total</span>

              <span>₹1,450</span>

            </div>

          </div>

          {/* Purchases */}

          <div className="border rounded-2xl p-5">

            <h3 className="font-semibold mb-4">
              Purchases
            </h3>

            <Row
              title="Sun Pharma"
              value="₹8,500"
            />

            <Row
              title="Cipla"
              value="₹6,700"
            />

          </div>

          {/* Notes */}

          <div className="border rounded-2xl p-5">

            <h3 className="font-semibold mb-3">
              Manager Notes
            </h3>

            <p className="text-gray-600 leading-7">

              Cipla delivery arrived later than expected.
              Dolo 650 demand was significantly higher than usual.

            </p>

          </div>

          {/* Status */}

          <div className="rounded-2xl bg-green-50 border border-green-200 p-5 flex items-center gap-3">

            <CheckCircle2
              className="text-green-600"
            />

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