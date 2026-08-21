import { Package } from "lucide-react";

const STATUS_STYLES = {
  received: {
    label: "Received",
    className: "bg-blue-100 text-blue-700",
  },

  checking: {
    label: "Waiting Check",
    className: "bg-orange-100 text-orange-700",
  },

  entered: {
    label: "Waiting Entry",
    className: "bg-purple-100 text-purple-700",
  },

  completed: {
    label: "Completed",
    className: "bg-green-100 text-green-700",
  },
};

/*
 * Show the date of the CURRENT workflow stage.
 *
 * received  -> received_date
 * checking  -> received_date
 * entered   -> sent_for_entry_at
 * completed -> completed_at
 */
function getWorkflowDate(purchase) {
  let value = null;

  if (
    purchase.status === "entered" &&
    purchase.sent_for_entry_at
  ) {
    value = purchase.sent_for_entry_at;
  } else if (
    purchase.status === "completed" &&
    purchase.completed_at
  ) {
    value = purchase.completed_at;
  } else if (
    purchase.received_date
  ) {
    value = purchase.received_date;
  } else {
    value = purchase.purchase_date;
  }

  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("en-IN");
}

export default function PurchaseTable({
  purchases,
  loading,
  onRowClick,
}) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
        Loading purchases...
      </div>
    );
  }

  if (!purchases.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-16">
        <div className="flex flex-col items-center">

          <Package
            size={60}
            className="text-slate-300"
          />

          <h2 className="mt-5 text-xl font-bold">
            No Purchases Found
          </h2>

          <p className="mt-2 text-slate-500">
            Purchase bills will appear here.
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      <table className="min-w-full">

        <thead className="bg-slate-50">

          <tr>

            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
              Date
            </th>

            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
              Store
            </th>

            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
              Supplier
            </th>

            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
              Bill No.
            </th>

            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
              Amount
            </th>

            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
              Status
            </th>

          </tr>

        </thead>

        <tbody>

          {purchases.map((purchase) => (

            <tr
              key={purchase.id}
              onClick={() =>
                onRowClick?.(purchase)
              }
              className="cursor-pointer border-t transition-all duration-200 hover:bg-blue-50"
            >

              <td className="px-6 py-4">
                {getWorkflowDate(purchase)}
              </td>

              <td className="px-6 py-4 font-medium">
                {purchase.store_name || "-"}
              </td>

              <td className="px-6 py-4">
                {purchase.supplier_name || "-"}
              </td>

              <td className="px-6 py-4">
                {purchase.bill_number || "-"}
              </td>

              <td className="px-6 py-4 font-semibold">
                ₹
                {Number(
                  purchase.purchase_amount || 0
                ).toLocaleString("en-IN")}
              </td>

              <td className="px-6 py-4">

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    STATUS_STYLES[
                      purchase.status
                    ]?.className ||
                    "bg-gray-100 text-gray-700"
                  }`}
                >
                  {
                    STATUS_STYLES[
                      purchase.status
                    ]?.label ||
                    purchase.status
                  }
                </span>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}