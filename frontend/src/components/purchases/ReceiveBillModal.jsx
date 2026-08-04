import { useEffect, useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import purchaseService from "../../services/purchaseService";

export default function ReceiveBillModal({
  isOpen,
  onClose,
  onSave,
}) {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState("");

  const [party, setParty] = useState("");
  const [amount, setAmount] = useState("");
  const [billNo, setBillNo] = useState("");
  const [billImage, setBillImage] = useState(null);

  const modalRef = useRef(null);

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

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target)
      ) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener(
        "mousedown",
        handleClickOutside
      );
    }

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div
        ref={modalRef}
        className="w-[650px] rounded-2xl bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b px-6 py-5">
          <h2 className="text-2xl font-bold">
            Receive Purchase Bill
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <X />
          </button>
        </div>

        <div className="space-y-5 p-6">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Purchase Order
            </label>

            <select
              value={selectedOrderId}
              onChange={handlePurchaseOrderChange}
              className="h-11 w-full rounded-xl border border-gray-200 px-4"
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

          <div>
            <label className="mb-2 block text-sm font-medium">
              Party Name
            </label>

            <input
              value={party}
              readOnly
              className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Amount
            </label>

            <input
              type="number"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value)
              }
              placeholder="Enter Purchase Amount"
              className="h-11 w-full rounded-xl border border-gray-200 px-4"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Bill Number
            </label>

            <input
              value={billNo}
              onChange={(e) =>
                setBillNo(e.target.value)
              }
              placeholder="Enter Bill Number"
              className="h-11 w-full rounded-xl border border-gray-200 px-4"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Upload Bill
            </label>

            <label className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 transition hover:border-blue-500">
              {billImage ? (
                <img
                  src={URL.createObjectURL(billImage)}
                  alt="Bill"
                  className="h-full w-full rounded-2xl object-contain"
                />
              ) : (
                <>
                  <Upload
                    size={36}
                    className="text-gray-400"
                  />

                  <p className="mt-3 text-sm text-gray-500">
                    Click to upload bill image
                  </p>
                </>
              )}

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  setBillImage(
                    e.target.files[0]
                  )
                }
              />
            </label>
          </div>

          <button
            onClick={handleSubmit}
            className="h-11 w-full rounded-xl bg-blue-600 font-medium text-white hover:bg-blue-700"
          >
            Submit Bill
          </button>
        </div>
      </div>
    </div>
  );
}