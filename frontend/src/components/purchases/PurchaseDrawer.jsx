import { useEffect, useState } from "react";

import {
  X,
  Building2,
  Receipt,
  IndianRupee,
  User,
  Camera,
  CheckCircle2,
  Clock3,
  Pencil,
  Trash2,
  Save,
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

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [editForm, setEditForm] = useState({
    supplier_name: "",
    bill_number: "",
    product_name: "",
    quantity: "",
    purchase_amount: "",
    purchase_date: "",
  });

  useEffect(() => {
    if (!purchase) {
      return;
    }

    setGrnNumber(
      purchase.grn_number || ""
    );

    setEditForm({
      supplier_name:
        purchase.supplier_name || "",

      bill_number:
        purchase.bill_number || "",

      product_name:
        purchase.product_name || "",

      quantity:
        purchase.quantity ?? "",

      purchase_amount:
        purchase.purchase_amount ?? "",

      purchase_date:
        purchase.purchase_date
          ? new Date(
              purchase.purchase_date
            )
              .toISOString()
              .split("T")[0]
          : "",
    });

    setEditing(false);
  }, [purchase]);

  if (!isOpen || !purchase) {
    return null;
  }

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

  async function saveEdit() {
    if (!editForm.supplier_name.trim()) {
      alert("Supplier name cannot be empty.");
      return;
    }

    if (!editForm.bill_number.trim()) {
      alert("Bill number cannot be empty.");
      return;
    }

    if (!editForm.product_name.trim()) {
      alert("Product name cannot be empty.");
      return;
    }

    if (
      Number(editForm.quantity) <= 0
    ) {
      alert(
        "Quantity must be greater than zero."
      );
      return;
    }

    if (
      Number(editForm.purchase_amount) <= 0
    ) {
      alert(
        "Purchase amount must be greater than zero."
      );
      return;
    }

    try {
      setSaving(true);

      const payload = {
        supplier_name:
          editForm.supplier_name.trim(),

        bill_number:
          editForm.bill_number.trim(),

        product_name:
          editForm.product_name.trim(),

        quantity:
          Number(editForm.quantity),

        purchase_amount:
          Number(editForm.purchase_amount),

        purchase_date:
          editForm.purchase_date
            ? new Date(
                `${editForm.purchase_date}T00:00:00`
              ).toISOString()
            : undefined,
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

      setEditing(false);
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
      setSaving(false);
    }
  }

  async function deletePurchase() {
    const confirmed = window.confirm(
      `Are you sure you want to delete purchase bill ${purchase.bill_number}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);

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
      setDeleting(false);
    }
  }

  function updateEditField(
    field,
    value
  ) {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

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

          {/* Information / Edit Form */}

          {!editing ? (
            <div className="space-y-4">

              <div className="flex items-center gap-3">
                <Building2 size={18} />

                <div>
                  <p className="text-xs text-gray-500">
                    Party Name
                  </p>

                  <p className="font-medium">
                    {purchase.supplier_name ||
                      "-"}
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
                    {purchase.bill_number ||
                      "-"}
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
                      purchase.purchase_amount ||
                        0
                    ).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">

                <div className="w-[18px]" />

                <div>
                  <p className="text-xs text-gray-500">
                    Product
                  </p>

                  <p className="font-medium">
                    {purchase.product_name ||
                      "-"}
                  </p>
                </div>

              </div>

              <div className="flex items-center gap-3">

                <div className="w-[18px]" />

                <div>
                  <p className="text-xs text-gray-500">
                    Quantity
                  </p>

                  <p className="font-medium">
                    {purchase.quantity ||
                      "-"}
                  </p>
                </div>

              </div>

            </div>
          ) : (
            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 space-y-4">

              <div>
                <h3 className="font-semibold text-lg">
                  Edit Purchase
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Update the purchase information.
                </p>
              </div>

              <div>

                <label className="block text-sm font-medium mb-1.5">
                  Supplier
                </label>

                <input
                  type="text"
                  value={
                    editForm.supplier_name
                  }
                  onChange={(e) =>
                    updateEditField(
                      "supplier_name",
                      e.target.value
                    )
                  }
                  className="w-full h-11 rounded-xl border border-gray-300 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

              <div>

                <label className="block text-sm font-medium mb-1.5">
                  Bill Number
                </label>

                <input
                  type="text"
                  value={
                    editForm.bill_number
                  }
                  onChange={(e) =>
                    updateEditField(
                      "bill_number",
                      e.target.value
                    )
                  }
                  className="w-full h-11 rounded-xl border border-gray-300 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

              <div>

                <label className="block text-sm font-medium mb-1.5">
                  Product
                </label>

                <input
                  type="text"
                  value={
                    editForm.product_name
                  }
                  onChange={(e) =>
                    updateEditField(
                      "product_name",
                      e.target.value
                    )
                  }
                  className="w-full h-11 rounded-xl border border-gray-300 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

              <div className="grid grid-cols-2 gap-3">

                <div>

                  <label className="block text-sm font-medium mb-1.5">
                    Quantity
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={
                      editForm.quantity
                    }
                    onChange={(e) =>
                      updateEditField(
                        "quantity",
                        e.target.value
                      )
                    }
                    className="w-full h-11 rounded-xl border border-gray-300 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                </div>

                <div>

                  <label className="block text-sm font-medium mb-1.5">
                    Amount
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={
                      editForm.purchase_amount
                    }
                    onChange={(e) =>
                      updateEditField(
                        "purchase_amount",
                        e.target.value
                      )
                    }
                    className="w-full h-11 rounded-xl border border-gray-300 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                </div>

              </div>

              <div>

                <label className="block text-sm font-medium mb-1.5">
                  Purchase Date
                </label>

                <input
                  type="date"
                  value={
                    editForm.purchase_date
                  }
                  onChange={(e) =>
                    updateEditField(
                      "purchase_date",
                      e.target.value
                    )
                  }
                  className="w-full h-11 rounded-xl border border-gray-300 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

              <div className="flex gap-3 pt-2">

                <button
                  onClick={() =>
                    setEditing(false)
                  }
                  disabled={saving}
                  className="flex-1 h-11 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>

                <button
                  onClick={saveEdit}
                  disabled={saving}
                  className="flex-1 h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center justify-center gap-2"
                >
                  <Save size={18} />

                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>

              </div>

            </div>
          )}

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
                    {purchase.received_by ||
                      "-"}
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
                    {purchase.entered_by ||
                      "-"}
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* GRN */}

          {purchase.status ===
            "waiting-entry" && (
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
                  setGrnNumber(
                    e.target.value
                  )
                }
                placeholder="Example: GRN-2026-00125"
                className="w-full h-11 rounded-xl border border-gray-300 px-4 focus:outline-none focus:ring-2 focus:ring-green-500"
              />

            </div>
          )}

          {/* Footer */}

          <div className="pt-5 border-t space-y-3">

            {/* Edit/Delete */}

            {!editing && (
              <div className="flex gap-3">

                <button
                  onClick={() =>
                    setEditing(true)
                  }
                  className="flex-1 h-11 rounded-xl border border-blue-200 text-blue-600 hover:bg-blue-50 font-medium flex items-center justify-center gap-2"
                >
                  <Pencil size={17} />
                  Edit Purchase
                </button>

                <button
                  onClick={deletePurchase}
                  disabled={deleting}
                  className="flex-1 h-11 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-medium flex items-center justify-center gap-2"
                >
                  <Trash2 size={17} />

                  {deleting
                    ? "Deleting..."
                    : "Delete Purchase"}
                </button>

              </div>
            )}

            {/* Workflow Actions */}

            {!editing &&
              purchase.status ===
                "received" && (
                <button
                  onClick={moveToNextStage}
                  className="w-full h-11 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-medium"
                >
                  Send for System Entry
                </button>
              )}

            {!editing &&
              purchase.status ===
                "waiting-entry" && (
                <button
                  onClick={moveToNextStage}
                  className="w-full h-11 rounded-xl bg-green-600 hover:bg-green-700 text-white font-medium"
                >
                  Mark As Completed
                </button>
              )}

            {!editing &&
              purchase.status ===
                "completed" && (
                <>
                  <div className="rounded-xl border border-green-200 bg-green-50 p-4">

                    <p className="text-xs uppercase tracking-wide text-green-700">
                      GRN Number
                    </p>

                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      {purchase.grn_number ||
                        "-"}
                    </p>

                  </div>

                  <button
                    disabled
                    className="w-full h-11 rounded-xl bg-gray-100 text-gray-600 cursor-default"
                  >
                    Bill Completed
                  </button>
                </>
              )}

            <button
              onClick={onClose}
              className="w-full h-11 rounded-xl border border-gray-200 hover:bg-gray-50"
            >
              Close
            </button>

          </div>

        </div>

      </div>
    </>
  );
}