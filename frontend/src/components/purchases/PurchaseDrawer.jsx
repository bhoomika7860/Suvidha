import {
  X,
  Building2,
  Receipt,
  IndianRupee,
  User,
  Camera,
  CheckCircle2,
  Clock3,
} from "lucide-react";
import purchaseService from "../../services/purchaseService";

export default function PurchaseDrawer({
  purchase,
  purchases,
  setPurchases,
  isOpen,
  onClose,
}) {
  if (!isOpen || !purchase) return null;
  async function moveToNextStage() {
  try {
    const user = JSON.parse(
      localStorage.getItem("user")
    );

    let payload = {};

    if (purchase.status === "received") {
      payload = {
        status: "waiting-check",
        checked_by: user.full_name,
      };
    } else if (purchase.status === "waiting-check") {
      payload = {
        status: "waiting-entry",
        entered_by: user.full_name,
      };
    } else if (purchase.status === "waiting-entry") {
      payload = {
        status: "completed",
      };
    } else {
      return;
    }

    const updatedPurchase =
      await purchaseService.updatePurchase(
        purchase.id,
        payload
      );

    setPurchases(
      purchases.map((p) =>
        p.id === purchase.id ? updatedPurchase : p
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
        className="fixed inset-0 bg-black/30 z-40"
      />

      {/* Drawer */}

      <div className="fixed right-0 top-0 h-screen w-[520px] bg-white z-50 shadow-2xl overflow-y-auto">

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
                  ₹{purchase.purchase_amount.toLocaleString()}
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

                {!purchase.checked_by ? (

                  <Clock3
                    className="text-orange-500 mt-1"
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
                    Bill Checked
                  </p>

                  <p className="text-sm text-gray-500">
                    {purchase.checked_by || "-"}
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

          {/* Footer */}

          <div className="pt-5 border-t">

  {purchase.status === "received" && (

    <button
    onClick={moveToNextStage}
    className="w-full h-11 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-medium"
>
    Send for checking
</button>

  )}

  {purchase.status === "waiting-check" && (

    <button
    onClick={moveToNextStage}
    className="w-full h-11 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-medium"
>
    Send For System Entry
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

    <button className="w-full h-11 rounded-xl bg-gray-100 text-gray-600 cursor-default">

      Bill Completed

    </button>

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