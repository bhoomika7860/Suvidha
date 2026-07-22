import { useState } from "react";

import PurchaseOrderDrawer from "./PurchaseOrderDrawer";
import ReceiveBillModal from "../ReceiveBillModal";

export default function PurchaseOrderTable({
  purchaseOrders,
  onSavePurchase,
}) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showReceiveModal, setShowReceiveModal] = useState(false);

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
                Items
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
                  {order.items?.length || 0}
                </td>

                <td className="px-6 py-5">
                  ₹{Number(order.expected_amount).toLocaleString()}
                </td>

                <td className="px-6 py-5">
                  {order.expected_date}
                </td>

                <td className="px-6 py-5">
                  <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm">
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
        onReceiveBill={() => {
          setShowReceiveModal(true);
        }}
      />

      <ReceiveBillModal
    isOpen={showReceiveModal}
    onClose={() => {
        setShowReceiveModal(false);
        setSelectedOrder(null);
    }}
    purchaseOrder={selectedOrder}
    onSave={(purchase) => {
        onSavePurchase(purchase);
    }}
/>
    </>
  );
}