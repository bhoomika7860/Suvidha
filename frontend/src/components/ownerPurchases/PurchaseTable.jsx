import { Package } from "lucide-react";

const statusColors = {
  received:
    "bg-blue-100 text-blue-700",

  checking:
    "bg-orange-100 text-orange-700",

  entered:
    "bg-purple-100 text-purple-700",

  completed:
    "bg-green-100 text-green-700",
};

export default function PurchaseTable({
  purchases,
  loading,
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

            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
              Received By
            </th>

          </tr>

        </thead>

        <tbody>

          {purchases.map((purchase) => (

            <tr
              key={purchase.id}
              className="cursor-pointer border-t transition hover:bg-slate-50"
            >

              <td className="px-6 py-4">
                {purchase.purchase_date}
              </td>

              <td className="px-6 py-4">
                {purchase.store_name}
              </td>

              <td className="px-6 py-4">
                {purchase.supplier_name}
              </td>

              <td className="px-6 py-4">
                {purchase.bill_number}
              </td>

              <td className="px-6 py-4 font-semibold">
                ₹{purchase.purchase_amount}
              </td>

              <td className="px-6 py-4">

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    statusColors[purchase.status]
                  }`}
                >
                  {purchase.status}
                </span>

              </td>

              <td className="px-6 py-4">
                {purchase.received_by_name}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}