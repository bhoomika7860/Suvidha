import {
  X,
  User,
  Receipt,
  IndianRupee,
  CreditCard,
  FileText,
} from "lucide-react";
import deliveryService from "../../services/deliveryService";
export default function DeliveryDrawer({
  delivery,
  isOpen,
  onClose,
  reloadDeliveries,
}) {

  if (!isOpen || !delivery) return null;

  return (
    <>
      <div
        onClick={onClose}
        className="
fixed
bottom-0
left-1/2
-transform
-translate-x-1/2
w-full
max-w-md
bg-white
rounded-t-3xl
shadow-2xl
z-50
max-h-[90vh]
overflow-y-auto
animate-[slideUp_.25s_ease-out]
"
      />

      <div
  className="
    fixed
    bottom-0
    left-1/2
    -translate-x-1/2
    w-full
    max-w-md
    bg-white
    rounded-t-3xl
    z-50
    shadow-2xl
    overflow-y-auto
    max-h-[90vh]
  "
>

        <div className="flex justify-between items-center border-b px-5 py-5">

          <h2 className="text-2xl font-bold">

            Delivery Details

          </h2>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100"
          >

            <X />

          </button>

        </div>

        <div className="p-6 space-y-6">

          <div className="flex gap-3">

            <User />

            <div>

              <p className="text-sm text-gray-500">
                Customer
              </p>

              <p className="font-medium">
                {delivery.customer_name}
              </p>

            </div>

          </div>

          <div className="flex gap-3">

            <Receipt />

            <div>

              <p className="text-sm text-gray-500">
                Bill Number
              </p>

              <p className="font-medium">
                {delivery.bill_number}
              </p>

            </div>

          </div>

          <div className="flex gap-3">

            <IndianRupee />

            <div>

              <p className="text-sm text-gray-500">
                Payment
              </p>

              <p className="font-medium">
                ₹{delivery.payment}
              </p>

            </div>

          </div>

          <div className="flex gap-3">

            <CreditCard />

            <div>

              <p className="text-sm text-gray-500">
                Payment Method
              </p>

              <p className="font-medium">
                {delivery.payment_method}
              </p>

            </div>

          </div>

          <div className="flex gap-3">

            <FileText />

            <div>

              <p className="text-sm text-gray-500">
                Notes
              </p>

              <p className="font-medium">
                {delivery.notes}
              </p>

            </div>

          </div>
        {delivery.status !== "completed" && (

  <button
    onClick={async () => {
      try {
        await deliveryService.completeDelivery(
  delivery.id
);

await reloadDeliveries();

onClose();

      } catch (err) {
        console.error(err);
      }
    }}
    className="w-full h-11 rounded-xl bg-green-600 hover:bg-green-700 text-white font-medium mb-3"
  >
    Mark Delivered
  </button>

)}
          <button
            onClick={onClose}
            className="w-full h-11 rounded-xl border hover:bg-gray-50"
          >

            Close

          </button>

        </div>

      </div>

    </>
  );

}