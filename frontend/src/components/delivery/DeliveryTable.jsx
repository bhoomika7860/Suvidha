import { useState } from "react";
import DeliveryDrawer from "./DeliveryDrawer";

export default function DeliveryTable({
  deliveries,
  reloadDeliveries,
}) {

  const [selectedDelivery, setSelectedDelivery] = useState(null);

  return (

    <>
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-50">

            <tr>

              <th className="text-left px-4 py-3">
                Customer
              </th>

              <th className="text-left px-4 py-3">
                Payment
              </th>

            </tr>

          </thead>

          <tbody>

  {deliveries.map((delivery) => (

    <tr
      key={delivery.id}
      onClick={() => setSelectedDelivery(delivery)}
      className="border-t cursor-pointer hover:bg-gray-50"
    >

      <td className="px-4 py-4">

        <p className="font-medium">

          {delivery.customer}

        </p>

        <p className="text-xs text-gray-500 mt-1">

          {delivery.billNo}

        </p>

      </td>

      <td className="px-4 py-4 font-semibold">

        ₹{Number(delivery.payment).toLocaleString()}

      </td>

    </tr>

  ))}

</tbody>

        </table>

      </div>

      <DeliveryDrawer
  delivery={selectedDelivery}
  isOpen={selectedDelivery !== null}
  onClose={() => setSelectedDelivery(null)}
  reloadDeliveries={reloadDeliveries}
/>

    </>

  );

}