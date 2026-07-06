import Card from "./shared/Card";
import SectionHeader from "./shared/SectionHeader";

function fmt(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

export default function ExpenseBreakdown({ expenses = [], title = "Expense Breakdown", sub = "Today's operational costs" }) {
  const rows = Array.isArray(expenses) ? expenses : [];
  const total = rows.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  return (
    <Card className="p-5 flex-1">
      <SectionHeader title={title} sub={sub} />

      <div className="flex flex-col gap-3">
        {rows.map((item) => {
          const pct = total ? Math.round((Number(item.amount || 0) / total) * 100) : 0;

          return (
            <div key={item.id}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[12px] font-medium" style={{ color: "#111827" }}>{item.title}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px]" style={{ color: "#6B7280" }}>{pct}%</span>
                  <span className="text-[12px] font-semibold tabular-nums" style={{ color: "#111827" }}>
                    {fmt(item.amount)}
                  </span>
                </div>
              </div>

              <div className="h-1 rounded-full overflow-hidden" style={{ background: "#F1F5F9" }}>
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "#2563EB" }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-3 mt-3 border-t" style={{ borderColor: "#E5E7EB" }}>
        <span className="text-[12px] font-semibold" style={{ color: "#6B7280" }}>Total</span>
        <span className="text-[13px] font-bold" style={{ color: "#111827" }}>{fmt(total)}</span>
      </div>
    </Card>
  );
}
