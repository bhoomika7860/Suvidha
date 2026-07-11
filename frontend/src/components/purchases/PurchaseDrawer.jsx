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

export default function PurchaseDrawer({
  purchase,
  purchases,
  setPurchases,
  isOpen,
  onClose,
}) {
  if (!isOpen || !purchase) return null;
  function moveToNextStage() {

  const updatedPurchases = purchases.map((item) => {

    if (item.id !== purchase.id) return item;

    if (item.status === "received") {

      return {
        ...item,
        status: "waiting-check",
        checkedBy: "Current User",
      };

    }

    if (item.status === "waiting-check") {

      return {
        ...item,
        status: "waiting-entry",
        enteredBy: "Current User",
      };

    }

    if (item.status === "waiting-entry") {

      return {
        ...item,
        status: "completed",
      };

    }

    return item;

  });

  setPurchases(updatedPurchases);

  onClose();

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
              {purchase.billNo}
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

            <div className="h-60 rounded-2xl border border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center">

              <Camera
                size={40}
                className="text-gray-400"
              />

              <p className="text-sm text-gray-500 mt-3">
                Bill Preview
              </p>

            </div>

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
                  {purchase.party}
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
                  {purchase.billNo}
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
                  ₹{purchase.amount.toLocaleString()}
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
                    {purchase.receivedBy}
                  </p>

                </div>

              </div>

              <div className="flex gap-3">

                {purchase.checkedBy === "-" ? (

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
                    {purchase.checkedBy}
                  </p>

                </div>

              </div>

              <div className="flex gap-3">

                {purchase.enteredBy === "-" ? (

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
                    {purchase.enteredBy}
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
    Mark Bill As Checked
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