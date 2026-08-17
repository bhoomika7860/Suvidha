import {
  Inbox,
  Database,
  CheckCircle2,
} from "lucide-react";

export default function PurchaseStats({
  purchases,
  activeFilter,
  setActiveFilter,
}) {
  const stats = [
    {
      key: "all",
      title: "All",
      icon: Inbox,
      color: "text-blue-600 bg-blue-100",
    },
    {
      key: "received",
      title: "Received",
      icon: Inbox,
      color: "text-blue-600 bg-blue-100",
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

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">

      {stats.map((item) => {

        const Icon = item.icon;

        const count =
          item.key === "all"
            ? purchases.length
            : purchases.filter(
                (purchase) =>
                  purchase.status ===
                  item.key
              ).length;

        return (
          <button
            key={item.key}
            onClick={() =>
              setActiveFilter(
                item.key
              )
            }
            className={`bg-white border rounded-2xl p-4 lg:p-5 shadow-sm transition text-left ${
              activeFilter === item.key
                ? "border-blue-600 ring-2 ring-blue-100"
                : "border-gray-200 hover:border-blue-300"
            }`}
          >

            <div className="flex justify-between items-center gap-2">

              <div className="min-w-0">

                <p className="text-xs lg:text-sm text-gray-500">
                  {item.title}
                </p>

                <h2 className="text-2xl lg:text-3xl font-bold mt-2">
                  {count}
                </h2>

              </div>

              <div
                className={`w-10 h-10 lg:w-11 lg:h-11 rounded-full flex items-center justify-center shrink-0 ${item.color}`}
              >
                <Icon
                  size={19}
                />
              </div>

            </div>

          </button>
        );
      })}

    </div>
  );
}