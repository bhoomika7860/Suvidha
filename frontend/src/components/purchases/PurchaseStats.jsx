import {
  Inbox,
  ClipboardCheck,
  Database,
  CheckCircle2,
  Clock3,
  Truck,
  CircleDollarSign,
  PackageCheck,
} from "lucide-react";

export default function PurchaseStats({
  purchases,
  purchaseOrders,
  activeFilter,
  setActiveFilter,
  activeTab,
}) {

  const billStats = [
    {
      key: "received",
      title: "Received",
      icon: Inbox,
      color: "text-blue-600 bg-blue-100",
    },
    {
      key: "waiting-check",
      title: "Waiting Check",
      icon: ClipboardCheck,
      color: "text-orange-600 bg-orange-100",
    },
    {
      key: "waiting-entry",
      title: "Waiting Entry",
      icon: Database,
      color: "text-violet-600 bg-violet-100",
    },
    {
      key: "completed",
      title: "Completed",
      icon: CheckCircle2,
      color: "text-green-600 bg-green-100",
    },
  ];

  const orderStats = [
    {
      title: "Pending Orders",
      value: purchaseOrders.filter(
        (o) => o.status === "Pending"
      ).length,
      icon: Clock3,
      color: "text-yellow-600 bg-yellow-100",
    },
    {
      title: "Completed Orders",
      value: purchaseOrders.filter(
        (o) => o.status === "Completed"
      ).length,
      icon: PackageCheck,
      color: "text-green-600 bg-green-100",
    },
    {
      title: "Today's Orders",
      value: purchaseOrders.length,
      icon: Truck,
      color: "text-blue-600 bg-blue-100",
    },
    {
  title: "Expected Amount",
  value:
    "₹" +
    purchaseOrders
      .reduce(
        (sum, o) =>
          sum + Number(o.expected_amount || 0),
        0
      )
      .toLocaleString("en-IN"),
  icon: CircleDollarSign,
  color: "text-violet-600 bg-violet-100",
},
  ];

  if (activeTab === "orders") {

    return (

      <div className="grid grid-cols-4 gap-4">

        {orderStats.map((item) => {

          const Icon = item.icon;

          return (

            <div
              key={item.title}
              className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm"
            >

              <div className="flex justify-between items-center">

                <div>

                  <p className="text-sm text-gray-500">
                    {item.title}
                  </p>

                  <h2 className="text-3xl font-bold mt-2">
                    {item.value}
                  </h2>

                </div>

                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center ${item.color}`}
                >

                  <Icon size={20} />

                </div>

              </div>

            </div>

          );

        })}

      </div>

    );

  }

  return (

    <div className="grid grid-cols-4 gap-4">

      {billStats.map((item) => {

        const Icon = item.icon;

        const count = purchases.filter(
          (purchase) => purchase.status === item.key
        ).length;

        return (

          <button
            key={item.key}
            onClick={() => setActiveFilter(item.key)}
            className={`bg-white border rounded-2xl p-5 shadow-sm transition text-left
            ${
              activeFilter === item.key
                ? "border-blue-600 ring-2 ring-blue-100"
                : "border-gray-200 hover:border-blue-300"
            }`}
          >

            <div className="flex justify-between items-center">

              <div>

                <p className="text-sm text-gray-500">
                  {item.title}
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {count}
                </h2>

              </div>

              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center ${item.color}`}
              >

                <Icon size={20} />

              </div>

            </div>

          </button>

        );

      })}

    </div>

  );

}