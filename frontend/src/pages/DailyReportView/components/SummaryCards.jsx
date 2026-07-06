import {
  IndianRupee,
  Receipt,
  Truck,
  ShoppingCart,
  Wallet,
} from "lucide-react";

const cards = [
  {
    title: "Total Sales",
    value: "₹1,25,150",
    icon: IndianRupee,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    title: "Bills",
    value: "94",
    icon: Receipt,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    title: "Deliveries",
    value: "14",
    icon: Truck,
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  {
    title: "Purchases",
    value: "₹8,700",
    icon: ShoppingCart,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    title: "Expenses",
    value: "₹600",
    icon: Wallet,
    color: "text-red-600",
    bg: "bg-red-50",
  },
];

export default function SummaryCards() {
  return (
    <div className="grid grid-cols-5 gap-5">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between mb-5">
              <div className={`p-3 rounded-xl ${card.bg}`}>
                <Icon className={card.color} size={20} />
              </div>
            </div>

            <div className="text-sm text-gray-500">
              {card.title}
            </div>

            <div className="text-2xl font-bold mt-2 text-gray-900">
              {card.value}
            </div>
          </div>
        );
      })}
    </div>
  );
}