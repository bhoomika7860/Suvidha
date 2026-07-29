import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  DollarSign,
  FileText,
  Truck,
  BarChart2,
  AlertCircle,
  CreditCard,
  Zap,
  Download,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  Package,
  Activity,
  Lightbulb,
} from "lucide-react";
import analyticsService from "../../services/analyticsService";
import ExportReportsModal from "../../components/reports/ExportReportsModal";

const BLUE = "#2563EB";
const GREEN = "#16A34A";
const RED = "#DC2626";
const ORANGE = "#EA580C";
const PURPLE = "#7C3AED";
const TEXT = "#111827";
const MUTED = "#6B7280";
const BORDER = "#E5E7EB";
const ACCENT_COLORS = [BLUE, GREEN, PURPLE, ORANGE, RED];

const PAYMENT_COLORS = {
  Cash: "#16A34A",
  UPI: "#7C3AED",
  Card: "#0891B2",
  Udhaar: "#D97706",
};

const EXPENSE_COLORS = [
  "#2563EB",
  "#16A34A",
  "#7C3AED",
  "#EA580C",
  "#DC2626",
  "#0EA5E9",
  "#F59E0B",
];



const fmtCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

const fmtShort = (value) => {
  const amount = Number(value || 0);
  if (amount >= 1000000) return `₹${(amount / 1000000).toFixed(2)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return `₹${amount}`;
};

const fmtNumber = (value) => Number(value || 0).toLocaleString("en-IN");

function KpiCard({ icon: Icon, label, value, trend, up, accent }) {



  return (
    <div
      className="group h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
      style={{ borderColor: BORDER }}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: `${accent}16` }}>
          <Icon size={22} color={accent} />
        </div>
        <span
          className="rounded-full px-2.5 py-1 text-sm font-semibold"
          style={{
            color: up ? GREEN : RED,
            background: up ? "#F0FDF4" : "#FEF2F2",
          }}
        >
          {up ? <ArrowUpRight size={14} className="mr-1 inline" /> : <ArrowDownRight size={14} className="mr-1 inline" />}
          {trend}
        </span>
      </div>
      <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: MUTED }}>
        {label}
      </p>
      <p className="text-2xl font-bold tracking-tight" style={{ color: TEXT }}>
        {value}
      </p>
    </div>
  );
}

function SectionHeader({ title, subtitle, children }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="text-2xl font-bold tracking-tight" style={{ color: TEXT }}>
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-1 text-sm" style={{ color: MUTED }}>
            {subtitle}
          </p>
        ) : null}
      </div>
      {children}
    </div>
  );
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-lg" style={{ borderColor: BORDER }}>
      <p className="mb-2 text-sm font-semibold" style={{ color: TEXT }}>
        {label}
      </p>
      {payload.map((entry) => (
        <div key={entry.name} className="mb-1 flex items-center gap-2 text-sm">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: entry.color }} />
          <span style={{ color: MUTED }}>{entry.name}:</span>
          <span className="font-semibold" style={{ color: TEXT }}>
            {typeof entry.value === "number" && entry.value > 10000 ? fmtShort(entry.value) : entry.value?.toLocaleString("en-IN")}
          </span>
        </div>
      ))}
    </div>
  );
}

function DonutCenter({ total }) {
  return (
    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
      <tspan x="50%" dy="-8" style={{ fontFamily: "Inter", fontSize: 11, fill: MUTED }}>
        Total
      </tspan>
      <tspan x="50%" dy="20" style={{ fontFamily: "Inter", fontSize: 14, fontWeight: 700, fill: TEXT }}>
        {fmtShort(total)}
      </tspan>
    </text>
  );
}

function InsightCard({ icon: Icon, text, accent }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm" style={{ borderColor: BORDER }}>
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: `${accent}16` }}>
        <Icon size={18} color={accent} />
      </div>
      <p className="text-sm leading-6" style={{ color: TEXT }}>
        {text}
      </p>
    </div>
  );
}

export default function Analytics() {
   const [dashboard, setDashboard] = useState(null);
const [stores, setStores] = useState([]);
const [udhaar, setUdhaar] = useState([]);
const [paymentBreakdown, setPaymentBreakdown] = useState([]);
const [expenseDistribution, setExpenseDistribution] = useState([]);
const [salesTrend, setSalesTrend] = useState([]);
const [deliveryPerformance, setDeliveryPerformance] = useState([]);

const [performance, setPerformance] = useState([]);

const [loading, setLoading] = useState(true);

const [refreshing, setRefreshing] = useState(false);

const [selectedStore, setSelectedStore] = useState("all");
const [selectedPeriod, setSelectedPeriod] = useState("today");


const [error, setError] = useState("");
const [showExport, setShowExport] = useState(false);


  const loadAnalytics = async () => {
  try {
    setLoading(true);
    setError("");

    const [
  dashboardData,
  storeData,
  udhaarData,
  paymentData,
  expenseData,
  trendData,
  deliveryData,
  performanceData,
] = await Promise.all([
  analyticsService.getDashboardSummary(selectedPeriod, selectedStore),
  analyticsService.getStoreSummary(selectedPeriod, selectedStore),
  analyticsService.getOutstandingUdhaar(selectedPeriod, selectedStore),
  analyticsService.getPaymentBreakdown(selectedPeriod, selectedStore),
  analyticsService.getExpenseDistribution(selectedPeriod, selectedStore),
  analyticsService.getSalesTrend(selectedPeriod, selectedStore),
  analyticsService.getDeliveryPerformance(selectedPeriod, selectedStore),
  analyticsService.getPerformance(selectedPeriod, selectedStore),
]);

    setDashboard(dashboardData);

    setStores(
      storeData.map((store) => ({
        ...store,
        total_sales: Number(store.total_sales),
        total_bills: Number(store.total_bills),
        total_expenses: Number(store.total_expenses),
        total_purchases: Number(store.total_purchases),
      }))
    );

    setUdhaar(udhaarData);
    console.log("UDHAAR DATA:", udhaarData);
    setPaymentBreakdown(paymentData);
    setExpenseDistribution(expenseData);
    setSalesTrend(trendData);
    setDeliveryPerformance(deliveryData);
    
    setPerformance(performanceData);

    console.log("Stores from backend:", storeData);
  } catch (err) {
    console.error(err);
    setError("Unable to load analytics.");
} finally {
    setLoading(false);
    setRefreshing(false);
  }
};


const handleRefresh = async () => {
  setRefreshing(true);

  try {
    await loadAnalytics();
  } finally {
    setRefreshing(false);
  }
};

const handleExportExcel = async () => {
  try {
    const blob = await analyticsService.exportExcel(
      selectedPeriod,
      selectedStore
    );

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "PharmaCore360_Analytics.xlsx";

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error(error);
    alert("Failed to export analytics.");
  }
};

const handleExportPDF = async () => {
  try {
    const blob = await analyticsService.exportPDF(
      selectedPeriod,
      selectedStore
    );

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "PharmaCore360_Analytics.pdf";

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);

  } catch (err) {
    console.error(err);
    alert("Failed to export PDF");
  }
};

useEffect(() => {
  loadAnalytics();
}, [selectedStore, selectedPeriod]);

const kpiCards = dashboard
  ? [
      {
        icon: DollarSign,
        label: "Total Revenue",
        value: fmtCurrency(dashboard.total_sales),
        
        up: true,
        accent: BLUE,
      },
      {
        icon: FileText,
        label: "Total Bills",
        value: fmtNumber(dashboard.total_bills),
        
        up: true,
        accent: GREEN,
      },
      {
  icon: Package,
  label: "Total Purchases",
  value: fmtCurrency(dashboard.total_purchases),

  up: true,
  accent: PURPLE,
},
      {
        icon: AlertCircle,
        label: "Total Expenses",
        value: fmtCurrency(dashboard.total_expenses),
        
        up: false,
        accent: ORANGE,
      },
      {
        icon: CreditCard,
        label: "Outstanding Udhaar",
        value: fmtCurrency(dashboard.total_udhaar),
        
        up: false,
        accent: RED,
      },
      {
  icon: Truck,
  label: "Total Deliveries",
  value: dashboard.total_deliveries || 0,
  trend: `${dashboard.total_deliveries || 0} Today`,
  up: true,
  accent: GREEN,
},
    ]
  : [];

  const storeOptions = [
  { store_id: "all", store_name: "All Stores" },
  ...stores,
];
console.log("Stores:", stores);
  return (
    <div style={{ background: "#F8FAFC", fontFamily: "Inter, sans-serif", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "32px 24px 64px" }}>
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={() => setShowExport(true)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              <Download size={16} />
              Export Analytics
            </button>
            
            <button
  onClick={async () => {
    setRefreshing(true);

    try {
      await loadAnalytics();
    } finally {
      setRefreshing(false);
    }
  }}
  disabled={refreshing}
  className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
  style={{ background: BLUE }}
>
  <RefreshCw
    size={16}
    className={refreshing ? "animate-spin" : ""}
  />
  {refreshing ? "Refreshing..." : "Refresh"}
</button>
          </div>
        </div>

        <div
  className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
  style={{ borderColor: BORDER }}
>
  <div className="mb-4 flex flex-wrap items-center gap-3">

    {/* Period */}
    <select
      value={selectedPeriod}
      onChange={(e) => setSelectedPeriod(e.target.value)}
      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
    >
      <option value="today">Today</option>
      <option value="7days">7 Days</option>
      <option value="30days">30 Days</option>
      <option value="90days">90 Days</option>
      <option value="month">This Month</option>
      <option value="last_month">Last Month</option>
      <option value="year">This Year</option>
    </select>

    {/* Store */}
    <select
  value={selectedStore}
  onChange={(e) => setSelectedStore(e.target.value)}
  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
>
  {storeOptions.map((store) => (
    <option key={store.store_id} value={store.store_id}>
      {store.store_name}
    </option>
  ))}
</select>

  </div>

  <div className="flex flex-wrap items-center gap-2">
    <span
      className="mr-1 text-sm font-semibold"
      style={{ color: MUTED }}
    >
      Quick Filter:
    </span>

    {[
      { label: "Today", value: "today" },
      { label: "7 Days", value: "7days" },
      { label: "30 Days", value: "30days" },
      { label: "90 Days", value: "90days" },
      { label: "This Month", value: "month" },
      { label: "Last Month", value: "last_month" },
      { label: "This Year", value: "year" },
    ].map((item) => (
      <button
        key={item.value}
        onClick={() => setSelectedPeriod(item.value)}
        className="rounded-lg px-3 py-1.5 text-sm font-medium transition"
        style={{
          background:
            selectedPeriod === item.value ? BLUE : "transparent",
          color:
            selectedPeriod === item.value ? "#fff" : MUTED,
          border: `1px solid ${
            selectedPeriod === item.value ? BLUE : BORDER
          }`,
        }}
      >
        {item.label}
      </button>
    ))}
  </div>
</div>

        {error ? (
          <div className="mb-8 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="mb-8 flex items-center justify-center rounded-2xl border border-slate-200 bg-white p-10 shadow-sm" style={{ borderColor: BORDER }}>
            <div className="flex items-center gap-3 text-sm font-semibold" style={{ color: MUTED }}>
              <RefreshCw size={16} className="animate-spin" />
              Loading analytics...
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
              {kpiCards.map((card) => (
                <KpiCard key={card.label} {...card} />
              ))}
            </div>

            <div className="mb-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" style={{ borderColor: BORDER }}>
                <SectionHeader title="Store Comparison" subtitle="Revenue and growth across the retail network" />
               <ResponsiveContainer width="100%" height={360}>
  <BarChart
    layout="vertical"
    data={stores}
    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
  >
    <CartesianGrid strokeDasharray="3 3" />

    <XAxis
      type="number"
      dataKey="total_sales"
      tickFormatter={fmtShort}
    />

    <YAxis
      type="category"
      dataKey="store_name"
      width={170}
    />

    <Tooltip formatter={(value) => fmtCurrency(Number(value))} />

    <Bar
      dataKey="total_sales"
      fill="#2563EB"
      radius={[0, 6, 6, 0]}
    />
  </BarChart>
</ResponsiveContainer>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" style={{ borderColor: BORDER }}>
                <SectionHeader title="Outstanding Udhaar" subtitle="Recovery performance by store" />
                <div className="space-y-4">
                  {(udhaar || []).map((entry) => {
                    const recoveryRate = Number(entry.recovery_rate || 0);
                    const barColor = recoveryRate >= 80 ? GREEN : recoveryRate >= 70 ? ORANGE : RED;
                   
                    return (
                      <div key={entry.store_name} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <div>
                            <p className="text-base font-semibold" style={{ color: TEXT }}>
                              {entry.store_name}
                            </p>
                            <p className="text-sm" style={{ color: MUTED }}>
                              Pending {fmtCurrency(entry.pending)}
                            </p>
                          </div>
                          <span className="rounded-full px-2.5 py-1 text-sm font-semibold" style={{ color: barColor, background: `${barColor}16` }}>
                            {recoveryRate.toFixed(1)}%
                          </span>
                        </div>
                        <div className="mb-2 h-2.5 rounded-full bg-slate-200">
                          <div className="h-2.5 rounded-full transition-all" style={{ width: `${Math.min(recoveryRate, 100)}%`, background: barColor }} />
                        </div>
                        <div className="flex items-center justify-between text-sm" style={{ color: MUTED }}>
                          <span>Recovered {fmtCurrency(entry.recovered)}</span>
                          <span>Total {fmtCurrency(entry.outstanding)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mb-8 grid gap-6 xl:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" style={{ borderColor: BORDER }}>
                <SectionHeader title="Payment Breakdown" subtitle="Cash, UPI, card, and udhaar mix" />
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
                  <div className="mx-auto">
                    <PieChart width={280} height={280}>
  <Pie
    data={paymentBreakdown}
    cx="50%"
    cy="50%"
    innerRadius={72}
    outerRadius={104}
    paddingAngle={2}
    dataKey="value"
    stroke="none"
  >
    {paymentBreakdown.map((entry) => (
      <Cell
  key={entry.name}
  fill={PAYMENT_COLORS[entry.name] || "#2563EB"}
/>
    ))}
  </Pie>

  <Tooltip formatter={(value) => fmtCurrency(value)} />

  <DonutCenter
    total={paymentBreakdown.reduce(
      (acc, item) => acc + Number(item.value || 0),
      0
    )}
  />
</PieChart>
                  </div>
                  <div className="flex-1 space-y-3">
                    {paymentBreakdown.map((entry) => (
                      <div key={entry.name} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
                        <div className="flex items-center gap-3">
                          <span className="h-3 w-3 rounded-full" style={{ background: entry.color }} />
                          <span className="font-semibold" style={{ color: TEXT }}>
                            {entry.name}
                          </span>
                        </div>
                        <span className="font-semibold" style={{ color: MUTED }}>
                          {fmtCurrency(entry.value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" style={{ borderColor: BORDER }}>
                <SectionHeader title="Expense Distribution" subtitle="Operational spending by category" />
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
                  <div className="mx-auto">
                    <PieChart width={260} height={260}>
  <Pie
    data={expenseDistribution}
    cx="50%"
    cy="50%"
    innerRadius={66}
    outerRadius={96}
    paddingAngle={2}
    dataKey="amount"
    stroke="none"
  >
    {expenseDistribution.map((entry, index) => (
      <Cell
  key={entry.name}
  fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]}
/>
    ))}
  </Pie>

  <Tooltip formatter={(value) => fmtCurrency(value)} />

  <DonutCenter total={expenseDistribution.reduce((acc, item) => acc + Number(item.amount || 0), 0)} />
</PieChart>
                  </div>
                  <div className="flex-1 space-y-3">
                    {expenseDistribution.map((entry) => (
                      <div key={entry.name} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
                        <div className="flex items-center gap-3">
                          <span className="h-3 w-3 rounded-full" style={{ background: entry.color }} />
                          <span className="font-semibold" style={{ color: TEXT }}>
                            {entry.name}
                          </span>
                        </div>
                        <span className="font-semibold" style={{ color: MUTED }}>
                          {fmtCurrency(entry.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

  {/* Top Selling Stores */}
  <div
    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    style={{ borderColor: BORDER }}
  >
    <SectionHeader
      title="Top Selling Stores"
      subtitle="Revenue leaders across the network"
    />

    <div className="overflow-hidden rounded-xl border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: MUTED }}>#</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: MUTED }}>Store</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: MUTED }}>Revenue</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: MUTED }}>Bills</th>

          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100 bg-white">
          {(stores || []).map((store, index) => (
            <tr
              key={store.store_id ?? index}
              className="transition hover:bg-slate-50"
            >
              <td className="px-4 py-3">
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold"
                  style={{
                    background: index === 0 ? "#FEF9C3" : "#EEF2FF",
                    color: index === 0 ? "#92400E" : BLUE,
                  }}
                >
                  {index + 1}
                </span>
              </td>

              <td
                className="px-4 py-3 text-[15px] font-bold"
                style={{ color: TEXT }}
              >
                {store.store_name}
              </td>

              <td
                className="px-4 py-3 text-[15px] font-semibold"
                style={{ color: TEXT }}
              >
                {fmtCurrency(store.total_sales)}
              </td>

              <td
                className="px-4 py-3 text-[15px]"
                style={{ color: MUTED }}
              >
                {fmtNumber(store.total_bills)}
              </td>

              
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>

  {/* Deliveries */}
  <div
    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    style={{ borderColor: BORDER }}
  >
    <SectionHeader
      title="Deliveries"
      subtitle="Deliveries completed by each store"
    />

    <div className="overflow-hidden rounded-xl border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: MUTED }}>#</th>

            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: MUTED }}>
              Store
            </th>

            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: MUTED }}>
              Deliveries
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100 bg-white">
          {(deliveryPerformance || []).map((store, index) => (
            <tr
              key={store.store}
              className="transition hover:bg-slate-50"
            >
              <td className="px-4 py-3">
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold"
                  style={{
                    background: index === 0 ? "#DCFCE7" : "#EEF2FF",
                    color: index === 0 ? GREEN : BLUE,
                  }}
                >
                  {index + 1}
                </span>
              </td>

              <td
                className="px-4 py-3 text-[15px] font-bold"
                style={{ color: TEXT }}
              >
                {store.store}
              </td>

              <td
                className="px-4 py-3 text-[15px] font-semibold"
                style={{ color: GREEN }}
              >
                {fmtNumber(store.deliveries)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>

</div>

            <div className="mb-8 grid gap-4 xl:grid-cols-4">
              
            </div>

            <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" style={{ borderColor: BORDER }}>
              <SectionHeader title="Business Insights" subtitle="Generated from live analytics" />
              
            </div>
          </>
                )}
      </div>

      <ExportReportsModal
          open={showExport}
          onClose={() => setShowExport(false)}
          type="analytics"
      />

    </div>
  );
}
