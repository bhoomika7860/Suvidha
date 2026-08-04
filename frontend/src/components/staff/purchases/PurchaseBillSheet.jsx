import { useEffect, useState } from "react";

import {
  X,
  Building2,
  Receipt,
  IndianRupee,
  Camera,
  CheckCircle2,
  Clock3,
} from "lucide-react";

import purchaseService from "../../../services/purchaseService";

export default function PurchaseBillSheet({
  purchase,
  isOpen,
  onClose,
  setPurchases,
}) {
  const [grnNumber, setGrnNumber] = useState("");

  useEffect(() => {
    if (purchase) {
      setGrnNumber(
        purchase.grn_number || ""
      );
    }
  }, [purchase]);

  if (!isOpen || !purchase) return null;

  async function moveToNextStage() {
    try {
      const user = JSON.parse(
        localStorage.getItem("user")
      );

      let payload = {};

      if (purchase.status === "received") {
        payload = {
          status: "waiting-entry",
        };
      }

      else if (
        purchase.status === "waiting-entry"
      ) {
        if (!grnNumber.trim()) {
          alert(
            "Please enter the GRN Number."
          );
          return;
        }

        payload = {
          status: "completed",
          entered_by: user.full_name,
          grn_number: grnNumber.trim(),
        };
      }

      const updated =
        await purchaseService.updatePurchase(
          purchase.id,
          payload
        );

      setPurchases((prev) =>
        prev.map((p) =>
          p.id === purchase.id
            ? updated
            : p
        )
      );

      onClose();

    } catch (err) {
      console.error(err);
    }
  }

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

          <div className="px-6 pb-5 border-b flex justify-between">

            <div>

              <h1 className="text-3xl font-bold">
                Purchase Bill
              </h1>

              <p className="text-gray-500 mt-2">
                {purchase.bill_number}
              </p>

            </div>

            <button
              onClick={onClose}
              className="w-11 h-11 rounded-full hover:bg-gray-100 flex items-center justify-center"
            >
              <X size={24} />
            </button>

          </div>

          {/* Body */}

          <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8">

            {/* Bill Image */}

            <div>

              <h3 className="font-semibold mb-4">
                Bill Photo
              </h3>

              {purchase.bill_image ? (

                <img
                  src={`http://127.0.0.1:8000${purchase.bill_image}`}
                  alt="Bill"
                  className="w-full h-72 object-contain rounded-2xl border"
                />

              ) : (

                <div className="h-56 rounded-2xl border border-dashed flex flex-col items-center justify-center">

                  <Camera
                    size={34}
                    className="text-gray-400"
                  />

                  <p className="mt-3 text-gray-500">
                    No Bill Uploaded
                  </p>

                </div>

              )}

            </div>

            {/* Supplier */}

            <div className="flex gap-5">

              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">

                <Building2
                  size={20}
                  className="text-blue-600"
                />

              </div>

              <div>

                <p className="text-sm text-gray-500">
                  Supplier
                </p>

                <p className="font-semibold text-lg">
                  {purchase.supplier_name}
                </p>

              </div>

            </div>

            {/* Bill Number */}

            <div className="flex gap-5">

              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">

                <Receipt
                  size={20}
                  className="text-blue-600"
                />

              </div>

              <div>

                <p className="text-sm text-gray-500">
                  Bill Number
                </p>

                <p className="font-semibold text-lg">
                  {purchase.bill_number}
                </p>

              </div>

            </div>

            {/* Amount */}

            <div className="flex gap-5">

              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">

                <IndianRupee
                  size={20}
                  className="text-blue-600"
                />

              </div>

              <div>

                <p className="text-sm text-gray-500">
                  Amount
                </p>

                <p className="font-semibold text-lg">
                  ₹
                  {purchase.purchase_amount.toLocaleString()}
                </p>

              </div>

            </div>

            {/* Workflow */}

            <div>

              <h3 className="font-semibold mb-5">
                Workflow
              </h3>

              <div className="space-y-6">

                <div className="flex gap-4">

                  <CheckCircle2 className="text-green-600 mt-1" />

                  <div>

                    <p className="font-medium">
                      Bill Received
                    </p>

                    <p className="text-sm text-gray-500">
                      {purchase.received_by}
                    </p>

                  </div>

                </div>

                <div className="flex gap-4">

                  {purchase.entered_by ? (

                    <CheckCircle2 className="text-green-600 mt-1" />

                  ) : (

                    <Clock3 className="text-gray-400 mt-1" />

                  )}

                  <div>

                    <p className="font-medium">
                      Entered In System
                    </p>

                    <p className="text-sm text-gray-500">
                      {purchase.entered_by || "-"}
                    </p>

                  </div>

                </div>

              </div>

            </div>

            {/* GRN */}

            {purchase.status ===
              "waiting-entry" && (

              <div>

                <label className="block mb-3 font-medium">
                  GRN Number
                </label>

                <input
                  value={grnNumber}
                  onChange={(e) =>
                    setGrnNumber(
                      e.target.value
                    )
                  }
                  className="w-full h-12 rounded-xl border px-4"
                  placeholder="Enter GRN"
                />

              </div>

            )}

          </div>

          {/* Footer */}

          <div className="border-t bg-white px-5 pt-5 pb-[calc(env(safe-area-inset-bottom)+20px)] space-y-3">

            {purchase.status ===
              "received" && (

              <button
                onClick={moveToNextStage}
                className="w-full h-14 rounded-2xl bg-orange-500 text-white font-semibold"
              >
                Send for System Entry
              </button>

            )}

            {purchase.status ===
              "waiting-entry" && (

              <button
                onClick={moveToNextStage}
                className="w-full h-14 rounded-2xl bg-green-600 text-white font-semibold"
              >
                Mark As Completed
              </button>

            )}

            {purchase.status ===
              "completed" && (

              <button
                disabled
                className="w-full h-14 rounded-2xl bg-gray-100 text-gray-500"
              >
                Bill Completed
              </button>

            )}

            <button
              onClick={onClose}
              className="w-full h-14 rounded-2xl border"
            >
              Close
            </button>

          </div>

        </div>

      </div>

    </>
  );
}