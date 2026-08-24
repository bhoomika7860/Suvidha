import { useEffect, useState } from "react";

import {
  X,
  Building2,
  Receipt,
  IndianRupee,
  Camera,
  CheckCircle2,
  Clock3,
  Pencil,
  Trash2,
  Save,
  AlertTriangle,
} from "lucide-react";

import purchaseService from "../../services/purchaseService";

export default function PurchaseDrawer({
  purchase,
  purchases,
  setPurchases,
  isOpen,
  onClose,
}) {
  const [grnNumber, setGrnNumber] = useState("");

  const [isEditing, setIsEditing] = useState(false);

  const [supplier, setSupplier] = useState("");
  const [billNumber, setBillNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!purchase) return;

    setGrnNumber(purchase.grn_number || "");

    setSupplier(purchase.supplier_name || "");
    setBillNumber(purchase.bill_number || "");
    setAmount(purchase.purchase_amount ?? "");
    setProductName(purchase.product_name || "");
    setQuantity(purchase.quantity ?? "");
    setPurchaseDate(
      purchase.purchase_date
        ? new Date(purchase.purchase_date)
            .toISOString()
            .split("T")[0]
        : ""
    );

    setIsEditing(false);
  }, [purchase]);

  if (!isOpen || !purchase) return null;

  // ---------------------------------------------------------
  // WORKFLOW
  // ---------------------------------------------------------

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
      } else if (
        purchase.status === "waiting-entry"
      ) {
        if (!grnNumber.trim()) {
          alert(
            "Please enter the GRN Number before marking this bill as completed."
          );
          return;
        }

        payload = {
          status: "completed",
          entered_by: user?.full_name,
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
      console.error(
        "Failed to update purchase workflow:",
        err
      );

      alert(
        err?.response?.data?.detail ||
          "Failed to update purchase."
      );
    }
  }

  // ---------------------------------------------------------
  // EDIT PURCHASE
  // ---------------------------------------------------------

  async function saveEdit() {
    if (!supplier.trim()) {
      alert("Supplier name is required.");
      return;
    }

    if (!billNumber.trim()) {
      alert("Bill number is required.");
      return;
    }

    if (
      !amount ||
      Number(amount) <= 0
    ) {
      alert("Please enter a valid purchase amount.");
      return;
    }

    if (!productName.trim()) {
      alert("Product name is required.");
      return;
    }

    if (
      !quantity ||
      Number(quantity) <= 0
    ) {
      alert("Please enter a valid quantity.");
      return;
    }

    if (!purchaseDate) {
      alert("Purchase date is required.");
      return;
    }

    try {
      setIsSaving(true);

      const payload = {
        supplier_name:
          supplier.trim(),

        bill_number:
          billNumber.trim(),

        purchase_amount:
          Number(amount),

        product_name:
          productName.trim(),

        quantity:
          Number(quantity),

        purchase_date:
          purchaseDate,
      };

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

      setIsEditing(false);
    } catch (err) {
      console.error(
        "Failed to edit purchase:",
        err
      );

      alert(
        err?.response?.data?.detail ||
          "Failed to edit purchase."
      );
    } finally {
      setIsSaving(false);
    }
  }

  // ---------------------------------------------------------
  // DELETE PURCHASE
  // ---------------------------------------------------------

  async function deletePurchase() {
    const confirmed =
      window.confirm(
        `Delete purchase bill "${purchase.bill_number}"?\n\nThis will also adjust the purchase total of its daily report. This action cannot be undone.`
      );

    if (!confirmed) {
      return;
    }

    try {
      setIsDeleting(true);

      await purchaseService.deletePurchase(
        purchase.id
      );

      setPurchases((prev) =>
        prev.filter(
          (p) =>
            p.id !== purchase.id
        )
      );

      onClose();
    } catch (err) {
      console.error(
        "Failed to delete purchase:",
        err
      );

      alert(
        err?.response?.data?.detail ||
          "Failed to delete purchase."
      );
    } finally {
      setIsDeleting(false);
    }
  }

  // ---------------------------------------------------------
  // EDIT MODE
  // ---------------------------------------------------------

  if (isEditing) {
    return (
      <>
        <div
          onClick={() =>
            !isSaving &&
            setIsEditing(false)
          }
          className="fixed inset-0 bg-black/30 z-40"
        />

        <div className="fixed right-0 top-0 h-screen w-full lg:w-[520px] bg-white z-50 shadow-2xl overflow-y-auto">

          <div className="flex justify-between items-center border-b px-6 py-5">

            <div>
              <h2 className="text-2xl font-bold">
                Edit Purchase
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                Update purchase information
              </p>
            </div>

            <button
              onClick={() =>
                setIsEditing(false)
              }
              disabled={isSaving}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <X size={22} />
            </button>

          </div>

          <div className="p-6 space-y-5">

            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">

              <div className="flex gap-3">

                <AlertTriangle
                  size={20}
                  className="text-amber-600 mt-0.5"
                />

                <div>

                  <p className="font-semibold text-amber-800">
                    Purchase total will be adjusted
                  </p>

                  <p className="text-sm text-amber-700 mt-1">
                    Changing the amount will automatically
                    update the corresponding daily report.
                  </p>

                </div>

              </div>

            </div>

            {/* Supplier */}

            <div>
              <label className="block text-sm font-medium mb-2">
                Supplier
              </label>

              <input
                type="text"
                value={supplier}
                onChange={(e) =>
                  setSupplier(e.target.value)
                }
                className="w-full h-11 rounded-xl border border-gray-300 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Bill Number */}

            <div>
              <label className="block text-sm font-medium mb-2">
                Bill Number
              </label>

              <input
                type="text"
                value={billNumber}
                onChange={(e) =>
                  setBillNumber(e.target.value)
                }
                className="w-full h-11 rounded-xl border border-gray-300 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Product */}

            <div>
              <label className="block text-sm font-medium mb-2">
                Product
              </label>

              <input
                type="text"
                value={productName}
                onChange={(e) =>
                  setProductName(e.target.value)
                }
                className="w-full h-11 rounded-xl border border-gray-300 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Quantity */}

            <div>
              <label className="block text-sm font-medium mb-2">
                Quantity
              </label>

              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) =>
                  setQuantity(e.target.value)
                }
                className="w-full h-11 rounded-xl border border-gray-300 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Amount */}

            <div>
              <label className="block text-sm font-medium mb-2">
                Purchase Amount
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value)
                }
                className="w-full h-11 rounded-xl border border-gray-300 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Purchase Date */}

            <div>
              <label className="block text-sm font-medium mb-2">
                Purchase Date
              </label>

              <input
                type="date"
                value={purchaseDate}
                onChange={(e) =>
                  setPurchaseDate(e.target.value)
                }
                className="w-full h-11 rounded-xl border border-gray-300 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Buttons */}

            <div className="pt-4 border-t space-y-3">

              <button
                onClick={saveEdit}
                disabled={isSaving}
                className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <Save size={18} />

                {isSaving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

              <button
                onClick={() =>
                  setIsEditing(false)
                }
                disabled={isSaving}
                className="w-full h-11 rounded-xl border border-gray-200 hover:bg-gray-50"
              >
                Cancel
              </button>

            </div>

          </div>

        </div>
      </>
    );
  }

  // ---------------------------------------------------------
  // VIEW MODE
  // ---------------------------------------------------------

  return (
    <>
      {/* Overlay */}

      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/30 z-40"
      />

      {/* Drawer */}

      <div className="fixed right-0 top-0 h-screen w-full lg:w-[520px] bg-white z-50 shadow-2xl overflow-y-auto">

        {/* Header */}

        <div className="flex justify-between items-center border-b px-6 py-5">

          <div>

            <h2 className="text-2xl font-bold">
              Purchase Bill
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              {purchase.bill_number}
            </p>

          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <X size={22} />
          </button>

        </div>

        {/* Body */}

        <div className="p-6 space-y-7">

          {/* Bill Photo */}

          <div>

            <h3 className="font-semibold mb-3">
              Bill Photo
            </h3>

            {purchase.bill_image ? (

              <img
                src={`http://127.0.0.1:8000${purchase.bill_image}`}
                alt="Bill"
                className="w-full h-72 object-contain rounded-2xl border"
              />

            ) : (

              <div className="h-60 rounded-2xl border border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center">

                <Camera
                  size={40}
                  className="text-gray-400"
                />

                <p className="text-sm text-gray-500 mt-3">
                  No Bill Uploaded
                </p>

              </div>

            )}

          </div>

          {/* Information */}

          <div className="space-y-4">

            <div className="flex items-center gap-3">

              <Building2 size={18} />

              <div>

                <p className="text-xs text-gray-500">
                  Party Name
                </p>

                <p className="font-medium">
                  {purchase.supplier_name}
                </p>

              </div>

            </div>

            <div className="flex items-center gap-3">

              <Receipt size={18} />

              <div>

                <p className="text-xs text-gray-500">
                  Bill Number
                </p>

                <p className="font-medium">
                  {purchase.bill_number}
                </p>

              </div>

            </div>

            <div className="flex items-center gap-3">

              <IndianRupee size={18} />

              <div>

                <p className="text-xs text-gray-500">
                  Amount
                </p>

                <p className="font-medium">
                  ₹
                  {Number(
                    purchase.purchase_amount || 0
                  ).toLocaleString("en-IN")}

              </p>

              </div>

            </div>

          </div>

          {/* Workflow */}

          <div>

            <h3 className="font-semibold mb-4">
              Workflow
            </h3>

            <div className="space-y-5">

              <div className="flex gap-3">

                <CheckCircle2
                  className="text-green-600 mt-1"
                  size={20}
                />

                <div>

                  <p className="font-medium">
                    Bill Received
                  </p>

                  <p className="text-sm text-gray-500">
                    {purchase.received_by}
                  </p>

                </div>

              </div>

              <div className="flex gap-3">

                {!purchase.entered_by ? (

                  <Clock3
                    className="text-gray-400 mt-1"
                    size={20}
                  />

                ) : (

                  <CheckCircle2
                    className="text-green-600 mt-1"
                    size={20}
                  />

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

          {purchase.status === "waiting-entry" && (

            <div className="border rounded-2xl p-5 bg-blue-50 border-blue-200">

              <h3 className="text-lg font-semibold">
                System Entry
              </h3>

              <p className="text-sm text-gray-500 mt-1 mb-4">
                Enter the GRN Number before completing this purchase.
              </p>

              <label className="block text-sm font-medium mb-2">
                GRN Number
              </label>

              <input
                required
                type="text"
                value={grnNumber}
                onChange={(e) =>
                  setGrnNumber(e.target.value)
                }
                placeholder="Example: GRN-2026-00125"
                className="w-full h-11 rounded-xl border border-gray-300 px-4 focus:outline-none focus:ring-2 focus:ring-green-500"
              />

            </div>

          )}

          {/* Owner Actions */}

          <div className="pt-5 border-t space-y-3">

            <button
              onClick={() =>
                setIsEditing(true)
              }
              className="w-full h-11 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium flex items-center justify-center gap-2"
            >
              <Pencil size={18} />
              Edit Purchase
            </button>

            <button
              onClick={deletePurchase}
              disabled={isDeleting}
              className="w-full h-11 rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 font-medium flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <Trash2 size={18} />

              {isDeleting
                ? "Deleting..."
                : "Delete Purchase"}
            </button>

          </div>

          {/* Workflow Footer */}

          <div className="pt-5 border-t">

            {purchase.status === "received" && (

              <button
                onClick={moveToNextStage}
                className="w-full h-11 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-medium"
              >
                Send for System Entry
              </button>

            )}

            {purchase.status === "waiting-entry" && (

              <button
                onClick={moveToNextStage}
                className="w-full h-11 rounded-xl bg-green-600 hover:bg-green-700 text-white font-medium"
              >
                Mark As Completed
              </button>

            )}

            {purchase.status === "completed" && (

              <>

                <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-4">

                  <p className="text-xs uppercase tracking-wide text-green-700">
                    GRN Number
                  </p>

                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {purchase.grn_number || "-"}
                  </p>

                </div>

                <button className="w-full h-11 rounded-xl bg-gray-100 text-gray-600 cursor-default">
                  Bill Completed
                </button>

              </>

            )}

            <button
              onClick={onClose}
              className="w-full mt-3 h-11 rounded-xl border border-gray-200 hover:bg-gray-50"
            >
              Close
            </button>

          </div>

        </div>

      </div>

    </>
  );
}