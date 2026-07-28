import { useState } from "react";
import { formatDate } from "../../../utils/formatDate";
import PurchaseOrderDrawer from "./PurchaseOrderDrawer";

export default function PurchaseOrderTable({
  purchaseOrders,
  onReceiveBill,
}) {
  const [selectedOrder, setSelectedOrder] = useState(null);

  return (
    <>
      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-4">
                Supplier
              </th>

              

              <th className="text-left px-6 py-4">
                Expected Amount
              </th>

              <th className="text-left px-6 py-4">
                Expected Date
              </th>

              <th className="text-left px-6 py-4">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {purchaseOrders.map((order) => (
              <tr
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className="border-t hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-6 py-5 font-medium">
                  {order.supplier_name}
                </td>

               

                <td className="px-6 py-5">
                  ₹{Number(order.expected_amount).toLocaleString()}
                </td>

                <td className="px-6 py-5">
                  {formatDate(order.expected_date)}
                </td>

                <td className="px-6 py-5">
                  <span
  className={`px-4 py-1 rounded-full text-sm font-medium ${
    order.status === "Pending"
      ? "bg-red-100 text-red-700"
      : "bg-green-100 text-green-700"
  }`}
>
  {order.status}
</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PurchaseOrderDrawer
        order={selectedOrder}
        isOpen={selectedOrder !== null}
        onClose={() => setSelectedOrder(null)}
        
      />
    </>
  );
}