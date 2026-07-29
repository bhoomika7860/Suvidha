import Card from "./shared/Card";
import SectionHeader from "./shared/SectionHeader";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

function fmt(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

const COLORS = [
  "#2563EB", // Blue
  "#16A34A", // Green
  "#EA580C", // Orange
  "#DC2626", // Red
  "#7C3AED", // Purple
  "#0891B2", // Cyan
  "#CA8A04", // Yellow
  "#DB2777", // Pink
  "#4F46E5", // Indigo
  "#059669", // Emerald
];

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-3 py-2">
      <p className="text-sm font-medium text-gray-800">
        {payload[0].name}
      </p>

      <p className="text-sm font-semibold text-gray-900">
        {fmt(payload[0].value)}
      </p>
    </div>
  );
}

export default function ExpenseBreakdown({
  expenses = [],
  title = "Expense Breakdown",
  sub = "Today's operational costs",
}) {
  // Group duplicate expense types together
  const groupedExpenses = {};

  (Array.isArray(expenses) ? expenses : []).forEach((expense) => {
    const key =
      expense.title ||
      expense.expense_type ||
      expense.category ||
      "Other";

    if (!groupedExpenses[key]) {
      groupedExpenses[key] = 0;
    }

    groupedExpenses[key] += Number(expense.amount || 0);
  });

  const rows = Object.entries(groupedExpenses).map(
    ([name, value], index) => ({
      id: index,
      name,
      value,
      color: COLORS[index % COLORS.length],
    })
  );

  const total = rows.reduce(
    (sum, item) => sum + item.value,
    0
  );

  return (
    <Card className="p-6">
      <SectionHeader
        title={title}
        sub={sub}
      />

      {rows.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-gray-500">
          No expenses available.
        </div>
      ) : (
        <div className="flex items-center gap-10 mt-6">

          {/* Donut Chart */}

          <div
            className="relative flex-shrink-0"
            style={{ width: 240, height: 240 }}
          >
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>
                <Pie
                  data={rows}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={2}
                >
                  {rows.map((item) => (
                    <Cell
                      key={item.id}
                      fill={item.color}
                    />
                  ))}
                </Pie>

                <Tooltip
                  content={<CustomTooltip />}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-xs text-gray-500">
                Total
              </p>

              <p className="text-xl font-bold text-gray-900">
                {fmt(total)}
              </p>
            </div>
          </div>

          {/* Legend */}

          <div className="flex-1 space-y-5">

            {rows.map((item) => {
              const pct = total
                ? ((item.value / total) * 100).toFixed(1)
                : 0;

              return (
                <div
                  key={item.id}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center gap-3">

                    <span
                      className="w-3 h-3 rounded-full"
                      style={{
                        background: item.color,
                      }}
                    />

                    <span className="font-medium text-gray-800">
                      {item.name}
                    </span>

                  </div>

                  <div className="text-right">

                    <div className="font-semibold">
                      {fmt(item.value)}
                    </div>

                    <div className="text-xs text-gray-500">
                      {pct}%
                    </div>

                  </div>
                </div>
              );
            })}

            <div className="border-t border-gray-200 pt-4 mt-4 flex justify-between">

              <span className="font-semibold text-gray-600">
                Total Expenses
              </span>

              <span className="text-xl font-bold text-gray-900">
                {fmt(total)}
              </span>

            </div>

          </div>

        </div>
      )}
    </Card>
  );
}