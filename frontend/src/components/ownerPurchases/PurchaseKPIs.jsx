import {
  DollarSign,
  Inbox,
  CheckCircle2,
} from "lucide-react";

const BLUE = "#2563EB";
const GREEN = "#16A34A";
const RED = "#DC2626";

function formatAmount(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function KpiCard({ icon: Icon, title, value, color }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-3 flex items-center justify-between sm:mb-4">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl sm:h-12 sm:w-12"
          style={{
            backgroundColor: `${color}15`,
          }}
        >
          <Icon size={20} color={color} className="sm:hidden" />
          <Icon size={22} color={color} className="hidden sm:block" />
        </div>
      </div>

      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 sm:text-sm">
        {title}
      </p>

      <h2 className="mt-1.5 text-xl font-bold text-slate-900 sm:mt-2 sm:text-3xl">
        {value}
      </h2>
    </div>
  );
}

export default function PurchaseKPIs({ summary }) {
  const totalPurchaseValue = Number(
    summary?.total_purchase_value ?? 0
  );

  const billsReceived = Number(
    summary?.bills_received ?? 0
  );

  const completed = Number(
    summary?.completed ?? 0
  );

  const kpis = [
    {
      title: "Total Purchase Value",
      value: formatAmount(totalPurchaseValue),
      icon: DollarSign,
      color: BLUE,
    },
    {
      title: "Bills Received",
      value: billsReceived.toLocaleString("en-IN"),
      icon: Inbox,
      color: GREEN,
    },
    {
      title: "Completed",
      value: completed.toLocaleString("en-IN"),
      icon: CheckCircle2,
      color: RED,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-3">
      {kpis.map((item) => (
        <KpiCard
          key={item.title}
          icon={item.icon}
          title={item.title}
          value={item.value}
          color={item.color}
        />
      ))}
    </div>
  );
}
