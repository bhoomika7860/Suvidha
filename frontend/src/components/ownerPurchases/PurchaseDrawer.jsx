import {
  X,
  Calendar,
  Store,
  Building2,
  Receipt,
  IndianRupee,
  User,
  Package,
} from "lucide-react";

const STATUS_STYLES = {
  received: {
    label: "Received",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
  },
  checking: {
    label: "Waiting Check",
    bg: "bg-amber-50",
    text: "text-amber-700",
  },
  entered: {
    label: "Waiting Entry",
    bg: "bg-purple-50",
    text: "text-purple-700",
  },
  completed: {
    label: "Completed",
    bg: "bg-blue-50",
    text: "text-blue-700",
  },
};

function DetailRow({ icon: Icon, label, value, highlight = false }) {
  return (
    <div className="flex items-start gap-3 border-b border-slate-100 py-3.5 last:border-b-0 sm:py-3">
      <Icon size={17} className="mt-0.5 shrink-0 text-slate-500" />

      <div className="min-w-0 flex-1">
        <p className="text-[10px] uppercase tracking-wider text-slate-500 sm:text-xs">
          {label}
        </p>

        <p
          className={`mt-1 break-words ${
            highlight
              ? "text-base font-bold text-slate-900 sm:text-lg"
              : "text-sm font-medium text-slate-900 sm:text-base"
          }`}
        >
          {value || "-"}
        </p>
      </div>
    </div>
  );
}

function formatDate(value) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function PurchaseDrawer({
  open,
  purchase,
  onClose,
}) {
  if (!open || !purchase) return null;

  const status =
    STATUS_STYLES[purchase.status] || {
      label: purchase.status || "Unknown",
      bg: "bg-gray-100",
      text: "text-gray-700",
    };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
      />

      {/* Drawer */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-[24px] bg-white shadow-2xl lg:bottom-auto lg:left-auto lg:top-0 lg:h-screen lg:max-h-none lg:w-full lg:max-w-xl lg:rounded-none lg:rounded-l-2xl">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b bg-white px-5 py-4 sm:px-6 sm:py-5">
          <div className="min-w-0">
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
              Purchase Details
            </h2>

            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Complete information about this purchase.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="ml-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200"
            aria-label="Close purchase details"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="space-y-5 p-5 sm:space-y-8 sm:p-6">
            {/* Status */}
            <div>
              <span
                className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold sm:px-4 sm:py-2 sm:text-sm ${status.bg} ${status.text}`}
              >
                {status.label}
              </span>
            </div>

            {/* Purchase Information */}
            <section>
              <h3 className="mb-3 text-base font-bold text-slate-900 sm:mb-4 sm:text-lg">
                Purchase Information
              </h3>

              <div className="rounded-2xl border border-slate-200 bg-white px-4 sm:rounded-xl sm:px-5">
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
                  icon={Package}
                  label="Quantity"
                  value={Number(
                    purchase.quantity || 0
                  ).toLocaleString("en-IN")}
                />

                <DetailRow
                  icon={Calendar}
                  label="Purchase Date"
                  value={formatDate(purchase.purchase_date)}
                />

                <DetailRow
                  icon={IndianRupee}
                  label="Purchase Amount"
                  value={`₹${Number(
                    purchase.purchase_amount || 0
                  ).toLocaleString("en-IN")}`}
                  highlight
                />
              </div>
            </section>

            {/* Workflow */}
            <section>
              <h3 className="mb-3 text-base font-bold text-slate-900 sm:mb-4 sm:text-lg">
                Workflow
              </h3>

              <div className="rounded-2xl border border-slate-200 bg-white px-4 sm:rounded-xl sm:px-5">
                <DetailRow
                  icon={User}
                  label="Received By"
                  value={
                    purchase.received_by_name ||
                    purchase.received_by
                  }
                />

                <DetailRow
                  icon={User}
                  label="Checked By"
                  value={
                    purchase.checked_by_name ||
                    purchase.checked_by
                  }
                />

                <DetailRow
                  icon={User}
                  label="Entered By"
                  value={
                    purchase.entered_by_name ||
                    purchase.entered_by
                  }
                />
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
