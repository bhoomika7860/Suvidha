import { useState } from "react";
import PurchaseDrawer from "./PurchaseDrawer";

export default function PurchaseTable({
  purchases,
  allPurchases,
  setPurchases,
}) {
  const [selectedPurchase, setSelectedPurchase] = useState(null);

  return (
    <>
      {/* Header */}
      <div className="grid grid-cols-7 bg-gray-50 px-6 py-4 text-sm font-semibold text-gray-600 border-b">
        <div>Party</div>
        <div>Bill No.</div>
        <div>Received Date</div>
        <div>Amount</div>
        <div>Received By</div>
        <div>Entered By</div>
        <div>Status</div>
      </div>

      {/* Body */}
      {purchases.length === 0 ? (
        <div className="py-20 text-center text-gray-500">
          No bills found.
        </div>
      ) : (
        purchases.map((purchase) => (
          <button
            key={purchase.id}
            onClick={() => setSelectedPurchase(purchase)}
            className="grid grid-cols-7 w-full px-6 py-4 border-b hover:bg-blue-50 transition text-left items-center"
          >
            {/* Party */}
            <div className="font-medium text-gray-900 break-words pr-4">
              {purchase.supplier_name || "-"}
            </div>

            {/* Bill Number */}
            <div className="text-gray-600">
              {purchase.bill_number || "-"}
            </div>

            {/* Received Date */}
            <div className="text-gray-600">
              {purchase.received_date
                ? new Date(
                    purchase.received_date
                  ).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "-"}
            </div>

            {/* Amount */}
            <div className="font-semibold">
              ₹
              {Number(
                purchase.purchase_amount || 0
              ).toLocaleString("en-IN")}
            </div>

            {/* Received By */}
            <div>
              {purchase.received_by || "-"}
            </div>

            {/* Entered By */}
            <div>
              {purchase.entered_by || "-"}
            </div>

            {/* Status */}
            <div>
              <span
                className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                  purchase.status === "received"
                    ? "bg-blue-100 text-blue-700"
                    : purchase.status === "waiting-entry"
                    ? "bg-violet-100 text-violet-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {purchase.status
                  ? purchase.status
                      .replace("-", " ")
                      .replace(/\b\w/g, (c) =>
                        c.toUpperCase()
                      )
                  : "-"}
              </span>
            </div>
          </button>
        ))
      )}

      <PurchaseDrawer
        purchase={selectedPurchase}
        purchases={allPurchases}
        setPurchases={setPurchases}
        isOpen={selectedPurchase !== null}
        onClose={() => setSelectedPurchase(null)}
      />
    </>
  );
}