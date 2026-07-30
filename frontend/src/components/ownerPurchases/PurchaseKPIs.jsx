import {
  DollarSign,
  Inbox,
  ClipboardCheck,
  Database,
  CheckCircle2,
} from "lucide-react";

const BLUE = "#2563EB";
const GREEN = "#16A34A";
const ORANGE = "#EA580C";
const PURPLE = "#7C3AED";
const RED = "#DC2626";

function KpiCard({ icon: Icon, title, value, color }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl"
          style={{
            backgroundColor: `${color}15`,
          }}
        >
          <Icon size={22} color={color} />
        </div>
      </div>

      <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
        {title}
      </p>

      <h2 className="mt-2 text-3xl font-bold text-slate-900">
        {value}
      </h2>
    </div>
  );
}

export default function PurchaseKPIs({ purchases = [] }) {
  const totalPurchaseValue = purchases.reduce(
    (sum, purchase) =>
      sum + Number(purchase.purchase_amount || 0),
    0
  );

  const billsReceived = purchases.filter(
    (purchase) => purchase.status === "received"
  ).length;

  const waitingCheck = purchases.filter(
    (purchase) => purchase.status === "checking"
  ).length;

  const waitingEntry = purchases.filter(
    (purchase) => purchase.status === "entered"
  ).length;

  const completed = purchases.filter(
    (purchase) => purchase.status === "completed"
  ).length;

  const kpis = [
    {
      title: "Total Purchase Value",
      value: `₹${totalPurchaseValue.toLocaleString("en-IN")}`,
      icon: DollarSign,
      color: BLUE,
    },
    {
      title: "Bills Received",
      value: billsReceived,
      icon: Inbox,
      color: GREEN,
    },
    {
      title: "Waiting Check",
      value: waitingCheck,
      icon: ClipboardCheck,
      color: ORANGE,
    },
    {
      title: "Waiting Entry",
      value: waitingEntry,
      icon: Database,
      color: PURPLE,
    },
    {
      title: "Completed",
      value: completed,
      icon: CheckCircle2,
      color: RED,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
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