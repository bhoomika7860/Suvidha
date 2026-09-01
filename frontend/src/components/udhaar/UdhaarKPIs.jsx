import {
  Wallet,
  Users,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";

export default function UdhaarKPIs({ entries }) {
  const totalOutstanding = entries.reduce(
    (sum, entry) =>
      sum +
      Number(entry.amount || 0) -
      Number(entry.paid_amount || 0),
    0
  );

  const totalCustomers = entries.length;

  const totalGiven = entries.reduce(
    (sum, entry) =>
      sum + Number(entry.amount || 0),
    0
  );

  const totalRecovered = entries.reduce(
    (sum, entry) =>
      sum + Number(entry.paid_amount || 0),
    0
  );

  const cards = [
    {
      title: "Outstanding",
      value: `₹${totalOutstanding.toLocaleString("en-IN")}`,
      icon: Wallet,
      iconClass: "bg-orange-100 text-orange-500",
    },
    {
      title: "Customers",
      value: totalCustomers,
      icon: Users,
      iconClass: "bg-purple-100 text-purple-500",
    },
    {
      title: "Total Given",
      value: `₹${totalGiven.toLocaleString("en-IN")}`,
      icon: ArrowUpRight,
      iconClass: "bg-blue-100 text-blue-600",
    },
    {
      title: "Recovered",
      value: `₹${totalRecovered.toLocaleString("en-IN")}`,
      icon: ArrowDownLeft,
      iconClass: "bg-green-100 text-green-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="flex min-h-[86px] items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm"
          >
            <div className="min-w-0">
              <p className="text-xs text-slate-500">
                {card.title}
              </p>

              <h2 className="mt-2 text-xl font-bold text-gray-900">
                {card.value}
              </h2>
            </div>

            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${card.iconClass}`}
            >
              <Icon size={20} />
            </div>
          </div>
        );
      })}
    </div>
  );
}