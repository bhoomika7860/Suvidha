import { useEffect, useState } from "react";
import { Upload, X } from "lucide-react";

export default function ReceiveBillModal({
  isOpen,
  onClose,
  onSave,
  purchaseOrder,
}) {
  const [party, setParty] = useState("");
  const [billNo, setBillNo] = useState("");
  const [amount, setAmount] = useState("");
  const [billImage, setBillImage] = useState(null);

  useEffect(() => {
    if (purchaseOrder) {
      setParty(purchaseOrder.supplier_name || "");
      setAmount(purchaseOrder.expected_amount || "");
    }
  }, [purchaseOrder]);

  if (!isOpen) return null;

  function handleSubmit() {
    if (!party || !billNo || !amount) return;

    const user = JSON.parse(localStorage.getItem("user"));

    onSave({
      store_id: user.store_id,
      product_name: "Purchase Bill",
      quantity: 1,
      supplier_name: party,
      purchase_amount: Number(amount),
      created_by: user.user_id,
      bill_number: billNo,
      received_by: user.full_name,
      checked_by: "",
      entered_by: "",
      status: "received",
      purchase_order_id: purchaseOrder?.id,
      bill_image: billImage,
    });

    setParty("");
    setBillNo("");
    setAmount("");
    setBillImage(null);

    onClose();
  }

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/30 z-40"
      />

      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="w-[650px] bg-white rounded-2xl shadow-xl">

          <div className="flex justify-between items-center border-b px-6 py-5">
            <h2 className="text-2xl font-bold">
              Receive Purchase Bill
            </h2>

            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <X />
            </button>
          </div>

          <div className="p-6 space-y-5">

            <div>
              <label className="block text-sm font-medium mb-2">
                Party Name
              </label>

              <input
                value={party}
                onChange={(e) => setParty(e.target.value)}
                className="w-full h-11 border border-gray-200 rounded-xl px-4"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">

              <div>
                <label className="block text-sm font-medium mb-2">
                  Bill Number
                </label>

                <input
                  value={billNo}
                  onChange={(e) => setBillNo(e.target.value)}
                  placeholder="Enter bill number"
                  className="w-full h-11 border border-gray-200 rounded-xl px-4"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Amount
                </label>

                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full h-11 border border-gray-200 rounded-xl px-4"
                />
              </div>

            </div>

            <div>

              <label className="block text-sm font-medium mb-2">
                Upload Bill
              </label>

              <label className="h-40 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition">

                {billImage ? (
                  <img
                    src={URL.createObjectURL(billImage)}
                    alt="Bill"
                    className="h-full w-full object-contain rounded-2xl"
                  />
                ) : (
                  <>
                    <Upload
                      size={36}
                      className="text-gray-400"
                    />

                    <p className="text-sm text-gray-500 mt-3">
                      Click to upload bill image
                    </p>
                  </>
                )}

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    setBillImage(e.target.files[0])
                  }
                />

              </label>

            </div>

            <button
              onClick={handleSubmit}
              className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
              Submit Bill
            </button>

          </div>

        </div>
      </div>
    </>
  );
}