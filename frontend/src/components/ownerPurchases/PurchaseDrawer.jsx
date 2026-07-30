import { X, Calendar, Store, Building2, Receipt, IndianRupee, User, Package } from "lucide-react";

const STATUS_STYLES = {
  received: {
    label: "Received",
    bg: "bg-blue-100",
    text: "text-blue-700",
  },
  checking: {
    label: "Waiting Check",
    bg: "bg-orange-100",
    text: "text-orange-700",
  },
  entered: {
    label: "Waiting Entry",
    bg: "bg-purple-100",
    text: "text-purple-700",
  },
  completed: {
    label: "Completed",
    bg: "bg-green-100",
    text: "text-green-700",
  },
};

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-100">
      <Icon size={18} className="mt-0.5 text-slate-500" />

      <div className="flex-1">
        <p className="text-xs uppercase tracking-wide text-slate-500">
          {label}
        </p>

        <p className="mt-1 font-medium text-slate-900">
          {value || "-"}
        </p>
      </div>
    </div>
  );
}

export default function PurchaseDrawer({
  open,
  purchase,
  onClose,
}) {
  if (!open || !purchase) return null;

  const status =
    STATUS_STYLES[purchase.status] ??
    STATUS_STYLES.received;

  return (
    <>
      {/* Backdrop */}

      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
      />

      {/* Drawer */}

      <div className="fixed right-0 top-0 z-50 h-screen w-full max-w-xl overflow-y-auto bg-white shadow-2xl">

        {/* Header */}

        <div className="sticky top-0 flex items-center justify-between border-b bg-white px-6 py-5">

          <div>

            <h2 className="text-2xl font-bold">
              Purchase Details
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Complete information about this purchase.
            </p>

          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-slate-100"
          >
            <X size={22} />
          </button>

        </div>

        <div className="space-y-8 p-6">

          {/* Status */}

          <div>

            <span
              className={`rounded-full px-4 py-2 text-sm font-semibold ${status.bg} ${status.text}`}
            >
              {status.label}
            </span>

          </div>

          {/* Purchase Information */}

          <section>

            <h3 className="mb-4 text-lg font-bold">
              Purchase Information
            </h3>

            <div className="rounded-xl border border-slate-200 bg-white px-5">

              <DetailRow
                icon={Receipt}
                label="Bill Number"
                value={purchase.bill_number}
              />

              <DetailRow
                icon={Building2}
                label="Supplier"
                value={purchase.supplier_name}
              />

              <DetailRow
                icon={Store}
                label="Store"
                value={purchase.store_name}
              />

              <DetailRow
                icon={Package}
                label="Product"
                value={purchase.product_name}
              />

              <DetailRow
                icon={Calendar}
                label="Purchase Date"
                value={new Date(
                  purchase.purchase_date
                ).toLocaleDateString("en-IN")}
              />

              <DetailRow
                icon={IndianRupee}
                label="Purchase Amount"
                value={`₹${Number(
                  purchase.purchase_amount
                ).toLocaleString("en-IN")}`}
              />

            </div>

          </section>

          {/* Workflow */}

          <section>

            <h3 className="mb-4 text-lg font-bold">
              Workflow
            </h3>

            <div className="rounded-xl border border-slate-200 bg-white px-5">

              <DetailRow
                icon={User}
                label="Received By"
                value={purchase.received_by}
              />

              <DetailRow
                icon={User}
                label="Checked By"
                value={purchase.checked_by}
              />

              <DetailRow
                icon={User}
                label="Entered By"
                value={purchase.entered_by}
              />

            </div>

          </section>

          

        </div>

      </div>
    </>
  );
}