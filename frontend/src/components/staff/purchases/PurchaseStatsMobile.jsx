import {
  Inbox,
  Database,
  CheckCircle2,
  Clock3,
  PackageCheck,
  Truck,
} from "lucide-react";

export default function PurchaseStatsMobile({
  purchases,
  purchaseOrders,
  activeTab,
  activeFilter,
  setActiveFilter,
}) {
  const billStats = [
    {
      key: "received",
      title: "Received",
      icon: Inbox,
      color: "bg-blue-50 text-blue-600",
    },
    {
      key: "waiting-entry",
      title: "Waiting Entry",
      icon: Database,
      color: "bg-violet-50 text-violet-600",
    },
    {
      key: "completed",
      title: "Completed",
      icon: CheckCircle2,
      color: "bg-green-50 text-green-600",
    },
  ];

  const orderStats = [
    {
      title: "Pending Orders",
      value: purchaseOrders.filter(
        (o) => o.status === "Pending"
      ).length,
      icon: Clock3,
      color: "bg-yellow-50 text-yellow-600",
    },
    {
      title: "Received Orders",
      value: purchaseOrders.filter(
        (o) => o.status === "Received"
      ).length,
      icon: PackageCheck,
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Today's Orders",
      value: purchaseOrders.length,
      icon: Truck,
      color: "bg-blue-50 text-blue-600",
    },
  ];

  if (activeTab === "orders") {
    return (
      <div className="grid grid-cols-3 gap-3">
        {orderStats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}
              >
                <Icon size={20} />
              </div>

              <h2 className="text-2xl font-bold mt-4">
                {item.value}
              </h2>

              <p className="text-xs text-gray-500 mt-1 leading-4">
                {item.title}
              </p>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-3">
      {billStats.map((item) => {
        const Icon = item.icon;

        const count = purchases.filter(
          (purchase) => purchase.status === item.key
        ).length;

        const selected =
          activeFilter === item.key;

        return (
          <button
            key={item.key}
            onClick={() =>
              setActiveFilter(item.key)
            }
            className={`rounded-2xl border p-4 shadow-sm transition text-left ${
              selected
                ? "border-blue-500 ring-2 ring-blue-100 bg-blue-50"
                : "border-gray-200 bg-white"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}
            >
              <Icon size={20} />
            </div>

            <h2 className="text-2xl font-bold mt-4">
              {count}
            </h2>

            <p className="text-xs text-gray-500 mt-1 leading-4">
              {item.title}
            </p>
          </button>
        );
      })}
    </div>
  );
}