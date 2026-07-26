import { useState } from "react";

export default function CreatePurchaseOrderModal({
  open,
  onClose,
  onSave,
}) {

  const [order, setOrder] = useState({
    party: "",
    expectedAmount: "",
    expectedDate: "",
  });

  
  if (!open) return null;

  

  return (

    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">

      <div className="bg-white rounded-2xl w-full max-w-2xl p-6">

        <h2 className="text-2xl font-bold mb-6">
          Create Purchase Order
        </h2>

        <div className="space-y-4">

          <input
            placeholder="Supplier"
            className="w-full h-11 border rounded-xl px-4"
            value={order.party}
            onChange={(e)=>
              setOrder({
                ...order,
                party:e.target.value,
              })
            }
          />

          <input
            type="number"
            placeholder="Expected Amount"
            className="w-full h-11 border rounded-xl px-4"
            value={order.expectedAmount}
            onChange={(e)=>
              setOrder({
                ...order,
                expectedAmount:e.target.value,
              })
            }
          />

          

         

        </div>

        <div className="flex justify-end gap-3 mt-6">
  <button
    onClick={onClose}
    className="px-5 py-2 rounded-xl border"
  >
    Cancel
  </button>

  <button
    onClick={() => {
      const user = JSON.parse(localStorage.getItem("user"));

      const orderData = {
        store_id: user.store_id,
        supplier_name: order.party,
        expected_amount: Number(order.expectedAmount),
        expected_date: order.expectedDate,
        created_by: user.user_id,
        items: [],
      };

      console.log("ORDER:", orderData);

      onSave(orderData);
    }}
    className="px-5 py-2 rounded-xl bg-blue-600 text-white"
  >
    Create Purchase Order
  </button>
</div>
      </div>

    </div>

  );

}