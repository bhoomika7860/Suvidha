import { useEffect, useRef, useState } from "react";

import {
  X,
  Camera,
  Image,
  Upload,
} from "lucide-react";

import purchaseService from "../../../services/purchaseService";

export default function ReceiveBillSheet({
  isOpen,
  onClose,
  onSave,
}) {
  const [pendingOrders, setPendingOrders] =
    useState([]);

  const [selectedOrderId, setSelectedOrderId] =
    useState("");

  const [party, setParty] = useState("");

  const [amount, setAmount] = useState("");

  const [billNo, setBillNo] = useState("");

  const [billImage, setBillImage] =
    useState(null);

  const cameraInput = useRef(null);

  const galleryInput = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    async function loadPendingOrders() {
      try {
        const data =
          await purchaseService.getPendingPurchaseOrders();

        setPendingOrders(data);

      } catch (err) {
        console.error(err);
      }
    }

    loadPendingOrders();

  }, [isOpen]);

  function handlePurchaseOrderChange(e) {
    const orderId = Number(e.target.value);

    setSelectedOrderId(orderId);

    const order = pendingOrders.find(
      (o) => o.id === orderId
    );

    if (!order) return;

    setParty(order.supplier_name);

    setAmount("");
  }

  function handleSubmit() {
    if (
      !selectedOrderId ||
      !party ||
      !amount ||
      !billNo
    ) {
      return;
    }

    const user = JSON.parse(
      localStorage.getItem("user")
    );

    onSave({
      store_id: user.store_id,
      product_name: "Purchase Bill",
      quantity: 1,
      supplier_name: party,
      purchase_amount: Number(amount),
      created_by: user.user_id,
      bill_number: billNo,
      received_by: user.full_name,
      entered_by: "",
      status: "received",
      purchase_order_id: selectedOrderId,
      bill_image: billImage,
    });

    setSelectedOrderId("");
    setParty("");
    setAmount("");
    setBillNo("");
    setBillImage(null);

    onClose();
  }

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}

      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 z-40"
      />

      {/* Bottom Sheet */}

      <div className="fixed inset-0 z-50 flex items-end">

        <div className="w-full h-[96vh] bg-white rounded-t-[30px] flex flex-col animate-slide-up">

          {/* Handle */}

          <div className="flex justify-center pt-3 pb-2">

            <div className="w-14 h-1.5 rounded-full bg-gray-300" />

          </div>

          {/* Header */}

          <div className="flex items-start justify-between px-6 pb-5 border-b">

            <div>

              <h1 className="text-3xl font-bold">
                Receive Bill
              </h1>

              <p className="mt-2 text-gray-500">
                Upload today's supplier bill
              </p>

            </div>

            <button
              onClick={onClose}
              className="w-11 h-11 rounded-full hover:bg-gray-100 flex items-center justify-center"
            >
              <X size={24} />
            </button>

          </div>

          {/* Scrollable Body */}

          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                        {/* Purchase Order */}

            <div>

              <label className="block text-sm font-medium mb-2">
                Purchase Order
              </label>

              <select
                value={selectedOrderId}
                onChange={handlePurchaseOrderChange}
                className="w-full h-12 rounded-xl border border-gray-300 px-4 bg-white"
              >
                <option value="">
                  Select Purchase Order
                </option>

                {pendingOrders.map((order) => (
                  <option
                    key={order.id}
                    value={order.id}
                  >
                    {order.label}
                  </option>
                ))}

              </select>

            </div>

            {/* Party */}

            <div>

              <label className="block text-sm font-medium mb-2">
                Party Name
              </label>

              <input
                value={party}
                readOnly
                className="w-full h-12 rounded-xl border border-gray-300 bg-gray-50 px-4"
              />

            </div>

            {/* Amount */}

            <div>

              <label className="block text-sm font-medium mb-2">
                Amount
              </label>

              <input
                type="number"
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value)
                }
                placeholder="Enter purchase amount"
                className="w-full h-12 rounded-xl border border-gray-300 px-4"
              />

            </div>

            {/* Bill Number */}

            <div>

              <label className="block text-sm font-medium mb-2">
                Bill Number
              </label>

              <input
                value={billNo}
                onChange={(e) =>
                  setBillNo(e.target.value)
                }
                placeholder="Enter bill number"
                className="w-full h-12 rounded-xl border border-gray-300 px-4"
              />

            </div>

            {/* Upload */}

            <div>

              <label className="block text-sm font-medium mb-4">
                Bill Photo
              </label>

              <div className="grid grid-cols-2 gap-3">

                {/* Camera */}

                <button
                  type="button"
                  onClick={() =>
                    cameraInput.current.click()
                  }
                  className="rounded-2xl border border-gray-300 p-5 flex flex-col items-center justify-center gap-3 active:scale-[0.98] transition"
                >

                  <Camera
                    size={30}
                    className="text-blue-600"
                  />

                  <span className="text-sm font-medium">
                    Take Photo
                  </span>

                </button>

                {/* Gallery */}

                <button
                  type="button"
                  onClick={() =>
                    galleryInput.current.click()
                  }
                  className="rounded-2xl border border-gray-300 p-5 flex flex-col items-center justify-center gap-3 active:scale-[0.98] transition"
                >

                  <Image
                    size={30}
                    className="text-blue-600"
                  />

                  <span className="text-sm font-medium">
                    Gallery
                  </span>

                </button>

              </div>

              {/* Hidden Camera Input */}

              <input
                ref={cameraInput}
                hidden
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) =>
                  setBillImage(
                    e.target.files?.[0] || null
                  )
                }
              />

              {/* Hidden Gallery Input */}

              <input
                ref={galleryInput}
                hidden
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setBillImage(
                    e.target.files?.[0] || null
                  )
                }
              />

            </div>

            {/* Image Preview */}

            {billImage && (

              <div>

                <label className="block text-sm font-medium mb-3">
                  Preview
                </label>

                <div className="rounded-2xl overflow-hidden border border-gray-300">

                  <img
                    src={URL.createObjectURL(
                      billImage
                    )}
                    alt="Bill Preview"
                    className="w-full h-72 object-contain bg-gray-50"
                  />

                </div>

              </div>

            )}
                      </div>

          {/* Sticky Footer */}

          <div className="border-t bg-white px-5 pt-5 pb-[calc(env(safe-area-inset-bottom)+20px)] space-y-3">

            <button
              onClick={handleSubmit}
              className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
            >
              Submit Bill
            </button>

            <button
              onClick={onClose}
              className="w-full h-14 rounded-2xl border border-gray-300 hover:bg-gray-50 font-medium transition"
            >
              Cancel
            </button>

          </div>

        </div>

      </div>

    </>
  );
}