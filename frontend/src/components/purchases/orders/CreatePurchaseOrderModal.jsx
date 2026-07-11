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
    items: [],
  });

  const [item, setItem] = useState({
    medicine: "",
    quantity: "",
  });

  if (!open) return null;

  function addItem() {

    if (!item.medicine || !item.quantity) return;

    setOrder({
      ...order,
      items: [...order.items, item],
    });

    setItem({
      medicine: "",
      quantity: "",
    });

  }

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

          <input
            type="date"
            className="w-full h-11 border rounded-xl px-4"
            value={order.expectedDate}
            onChange={(e)=>
              setOrder({
                ...order,
                expectedDate:e.target.value,
              })
            }
          />

          <div className="border rounded-xl p-4">

            <h3 className="font-semibold mb-4">
              Medicines
            </h3>

            <div className="grid grid-cols-2 gap-3">

              <input
                placeholder="Medicine"
                className="border rounded-lg px-3 h-10"
                value={item.medicine}
                onChange={(e)=>
                  setItem({
                    ...item,
                    medicine:e.target.value,
                  })
                }
              />

              <input
                placeholder="Quantity"
                className="border rounded-lg px-3 h-10"
                value={item.quantity}
                onChange={(e)=>
                  setItem({
                    ...item,
                    quantity:e.target.value,
                  })
                }
              />

            </div>

            <button
              onClick={addItem}
              className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white"
            >
              Add Medicine
            </button>

            <div className="mt-4 space-y-2">

              {order.items.map((medicine,index)=>(

                <div
                  key={index}
                  className="flex justify-between border rounded-lg p-3"
                >

                  <span>{medicine.medicine}</span>

                  <span>{medicine.quantity}</span>

                </div>

              ))}

            </div>

          </div>

        </div>

        <div className="flex justify-end gap-3 mt-6">

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl border"
          >
            Cancel
          </button>

          <button
            onClick={()=>
              onSave({
                ...order,
                items:order.items.length,
                status:"Pending",
              })
            }
            className="px-5 py-2 rounded-xl bg-blue-600 text-white"
          >
            Create Purchase Order
          </button>

        </div>

      </div>

    </div>

  );

}