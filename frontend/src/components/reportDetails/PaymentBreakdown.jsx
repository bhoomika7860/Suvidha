import { Banknote, CreditCard, Smartphone, Users } from "lucide-react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import Card from "./shared/Card";
import SectionHeader from "./shared/SectionHeader";

const DEFAULT_COLORS = {
  cash: "#16A34A",
  upi: "#7C3AED",
  card: "#0891B2",
  udhaar: "#D97706",
};

const DEFAULT_ICONS = {
  cash: Banknote,
  upi: Smartphone,
  card: CreditCard,
  udhaar: Users,
};

function fmt(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function DonutTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;

  

return (
    <div
      className="rounded-xl px-3 py-2 text-xs font-medium shadow-lg"
      style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", color: "#111827" }}
    >
      {payload[0].name}: <span className="font-semibold">{fmt(payload[0].value)}</span>
    </div>
  );
}

export default function PaymentBreakdown({ payments = [], title = "Payment Breakdown", sub = "Collection by payment method" }) {
  const rows = (Array.isArray(payments) ? payments : Object.entries(payments || {}).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value,
    color: DEFAULT_COLORS[key] || "#2563EB",
    icon: DEFAULT_ICONS[key] || Banknote,
  }))).map((row) => ({
    ...row,
    name: row.name || row.label || "Payment",
    value: Number(row.value || 0),
    color:
  row.color ||
  DEFAULT_COLORS[row.name?.toLowerCase()] ||
  "#2563EB",

   icon:
  row.icon ||
  DEFAULT_ICONS[row.name?.toLowerCase()] ||
  Banknote,
  }));

  const total = rows.reduce((sum, row) => sum + row.value, 0);
const PAYMENT_COLORS = {
  Cash: "#16A34A",
  UPI: "#7C3AED",
  Card: "#0891B2",
  Udhaar: "#D97706",
};
  return (
    <Card className="p-6">
      <SectionHeader title={title} sub={sub} />

      {rows.length === 0 ? (
  <div className="flex items-center justify-center h-60 text-gray-500">
    No payment data available.
  </div>
) : (
  <div className="flex items-center gap-8">
    <div
  className="relative flex-shrink-0"
  style={{ width: 220, height: 220 }}
>
  <ResponsiveContainer width="100%" height="100%">
    <PieChart>
      <Pie
        data={rows}
        dataKey="value"
        nameKey="name"
        innerRadius={60}
        outerRadius={90}
        paddingAngle={2}
      >
        {rows.map((entry, index) => (
          <Cell
            key={index}
            fill={entry.color}
          />
        ))}
      </Pie>

      <Tooltip content={<DonutTooltip />} />
    </PieChart>
  </ResponsiveContainer>

  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
    <p className="text-xs text-gray-500">
      Total
    </p>

    <p className="text-lg font-bold text-gray-900">
      {fmt(total)}
    </p>
  </div>
</div>

    <div className="flex-1 flex flex-col gap-4">
      {rows.map((entry) => {
        const pct = total ? Math.round((entry.value / total) * 100) : 0;
        const Icon = entry.icon;

        return (
          <div key={entry.name}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2.5">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: entry.color }}
                />
                <div
                  className="w-6 h-6 rounded-md flex items-center justify-center"
                  style={{ background: `${entry.color}18` }}
                >
                  <Icon size={12} color={entry.color} />
                </div>
                <span
                  className="text-[13px] font-medium"
                  style={{ color: "#111827" }}
                >
                  {entry.name}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className="text-[12px]"
                  style={{ color: "#6B7280" }}
                >
                  {pct}%
                </span>
                <span
                  className="text-[13px] font-semibold tabular-nums"
                  style={{ color: "#111827" }}
                >
                  {fmt(entry.value)}
                </span>
              </div>
            </div>

            <div
              className="h-1 rounded-full overflow-hidden"
              style={{ background: "#F1F5F9" }}
            >
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${pct}%`,
                  background: entry.color,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  </div>
)}
    </Card>
  );
}
