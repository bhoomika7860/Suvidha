import { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
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
import { analyticsService } from "../../services/analyticsService";

const BLUE = "#2563EB";
const GREEN = "#16A34A";
const RED = "#DC2626";
const ORANGE = "#EA580C";
const PURPLE = "#7C3AED";
const TEXT = "#111827";
const MUTED = "#6B7280";
const BORDER = "#E5E7EB";
const CARD = "#FFFFFF";
const ACCENT_COLORS = [BLUE, GREEN, PURPLE, ORANGE, RED];

const defaultOverview = {
  kpis: {
    total_revenue: 0,
    total_bills: 0,
    average_bill_value: 0,
    total_expenses: 0,
    outstanding_udhaar: 0,
    growth_rate: 0,
  },
  store_comparison: [],
  outstanding_udhaar: [],
  payment_breakdown: [],
  expense_distribution: [],
  sales_trend: [],
  top_stores: [],
  top_bounced_medicines: [],
  insights: [],
  forecast: {
    projected_revenue: 0,
    projected_bills: 0,
    projected_expenses: 0,
    series: [],
  },
};

const fmtCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

const fmtShort = (value) => {
  const amount = Number(value || 0);
  if (amount >= 1000000) return `₹${(amount / 1000000).toFixed(2)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return `₹${amount}`;
};

const fmtNumber = (value) => Number(value || 0).toLocaleString("en-IN");

const fmtPercent = (value) => `${Number(value || 0).toFixed(1)}%`;

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
  // ======================
// FILTERS
// ======================

const [selectedStore, setSelectedStore] = useState("all");
const [selectedPeriod, setSelectedPeriod] = useState("today");
const [selectedMetric, setSelectedMetric] = useState("revenue");
const [compareMode, setCompareMode] = useState(false);

// ======================
// DATA
// ======================

const [dashboardSummary, setDashboardSummary] = useState({});
const [storeComparison, setStoreComparison] = useState([]);
const [udhaarSummary, setUdhaarSummary] = useState([]);
const [paymentBreakdown, setPaymentBreakdown] = useState([]);
const [expenseDistribution, setExpenseDistribution] = useState([]);
const [salesTrend, setSalesTrend] = useState([]);
const [topStores, setTopStores] = useState([]);
const [topBouncedProducts, setTopBouncedProducts] = useState([]);
const [businessInsights, setBusinessInsights] = useState([]);
const [performanceCards, setPerformanceCards] = useState([]);

// ======================
// UI
// ======================

const [loading, setLoading] = useState(true);
const [refreshing, setRefreshing] = useState(false);

  

  useEffect(() => {
    loadAnalytics();
}, [selectedStore, selectedPeriod]);

    const loadAnalytics = async () => {
    try {

        setLoading(true);

        const [
            dashboard,
            stores,
            udhaar,
            payments,
            expenses,
            trend,
            topSelling,
            bounced,
            insights,
            performance
        ] = await Promise.all([

            analyticsService.getDashboardSummary(selectedStore, selectedPeriod),

            analyticsService.getStoreComparison(selectedStore, selectedPeriod),

            analyticsService.getOutstandingUdhaar(selectedStore),

            analyticsService.getPaymentBreakdown(selectedStore, selectedPeriod),

            analyticsService.getExpenseDistribution(selectedStore, selectedPeriod),

            analyticsService.getSalesTrend(selectedStore, selectedPeriod),

            analyticsService.getTopSellingStores(selectedStore, selectedPeriod),

            analyticsService.getTopBouncedProducts(selectedStore, selectedPeriod),

            analyticsService.getBusinessInsights(selectedStore, selectedPeriod),

            analyticsService.getPerformanceCards(selectedStore, selectedPeriod)

        ]);

        setDashboardSummary(dashboard.data);

        setStoreComparison(stores.data);

        setUdhaarSummary(udhaar.data);

        setPaymentBreakdown(payments.data);

        setExpenseDistribution(expenses.data);

        setSalesTrend(trend.data);

        setTopStores(topSelling.data);

        setTopBouncedProducts(bounced.data);

        setBusinessInsights(insights.data);

        setPerformanceCards(performance.data);

    } catch (err) {

        console.error(err);

    } finally {

        setLoading(false);

    }
};

  const kpiCards = useMemo(
    () => [
      {
        label: "Total Revenue",
        value: fmtCurrency(overview.kpis?.total_revenue),
        trend: `${fmtPercent(overview.kpis?.growth_rate || 0)}`,
        up: (overview.kpis?.growth_rate || 0) >= 0,
        accent: BLUE,
        icon: DollarSign,
      },
      {
        label: "Total Bills",
        value: fmtNumber(overview.kpis?.total_bills),
        trend: `${fmtPercent(Math.max(0, overview.kpis?.growth_rate || 0))}`,
        up: true,
        accent: GREEN,
        icon: FileText,
      },
      {
        label: "Avg Bill Value",
        value: fmtCurrency(overview.kpis?.average_bill_value),
        trend: `${fmtPercent(Math.max(0, (overview.kpis?.growth_rate || 0) / 2))}`,
        up: true,
        accent: PURPLE,
        icon: BarChart2,
      },
      {
        label: "Total Expenses",
        value: fmtCurrency(overview.kpis?.total_expenses),
        trend: `${fmtPercent(Math.max(0, (overview.kpis?.growth_rate || 0) / 3))}`,
        up: false,
        accent: ORANGE,
        icon: AlertCircle,
      },
      {
        label: "Outstanding Udhaar",
        value: fmtCurrency(overview.kpis?.outstanding_udhaar),
        trend: `${fmtPercent(Math.max(0, (overview.kpis?.growth_rate || 0) / 4))}`,
        up: false,
        accent: RED,
        icon: CreditCard,
      },
      {
        label: "Growth Rate",
        value: fmtPercent(overview.kpis?.growth_rate),
        trend: "stable",
        up: (overview.kpis?.growth_rate || 0) >= 0,
        accent: GREEN,
        icon: TrendingUp,
      },
    ],
    [overview.kpis]
  );

 

  
  const totalExpenses = (overview.kpis?.total_expenses || 0) + (overview.expense_distribution || []).reduce((acc, item) => acc + Number(item.amount || 0), 0);

  return (
    <div style={{ background: "#F8FAFC", fontFamily: "Inter, sans-serif", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "32px 24px 64px" }}>
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight" style={{ color: TEXT }}>
              Analytics
            </h1>
            <p className="mt-2 text-base" style={{ color: MUTED }}>
              Live business intelligence for revenue, stores, credit, and operations.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              <Download size={16} />
              Export Analytics
            </button>
            <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              <FileText size={16} />
              Download PDF
            </button>
            <button
              onClick={async () => {

    setRefreshing(true);

    await loadAnalytics();

    setRefreshing(false);

}}
              className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
              style={{ background: BLUE }}
            >
              <RefreshCw size={16} />
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
      <option value="all">All Stores</option>
      <option value="1">Sector 7 Pharmacy</option>
      <option value="2">Sector 4 Pharmacy</option>
      <option value="3">MG Road Branch</option>
      <option value="4">City Centre Pharmacy</option>
      <option value="5">North Hub Pharmacy</option>
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
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-32 animate-pulse rounded-2xl border border-slate-200 bg-white" />
              ))}
            </div>
            <div className="grid gap-6 xl:grid-cols-2">
              <div className="h-96 animate-pulse rounded-2xl border border-slate-200 bg-white" />
              <div className="h-96 animate-pulse rounded-2xl border border-slate-200 bg-white" />
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
                  <BarChart data={overview.store_comparison || []} layout="vertical" margin={{ top: 8, right: 24, bottom: 8, left: 16 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 12, fill: MUTED }} axisLine={false} tickLine={false} tickFormatter={(value) => fmtShort(value)} />
                    <YAxis type="category" dataKey="store_name" width={180} tick={{ fontSize: 13, fontWeight: 700, fill: TEXT }} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTooltip />} />
                    <Bar dataKey="revenue" fill={BLUE} radius={[0, 6, 6, 0]} barSize={22} name="Revenue" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" style={{ borderColor: BORDER }}>
                <SectionHeader title="Outstanding Udhaar" subtitle="Recovery performance by store" />
                <div className="space-y-4">
                  {(overview.outstanding_udhaar || []).map((entry) => {
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
                      <Pie data={paymentBreakdown} cx="50%" cy="50%" innerRadius={72} outerRadius={104} paddingAngle={2} dataKey="value" stroke="none">
                        {paymentBreakdown.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => fmtCurrency(value)} />
                      <DonutCenter total={paymentBreakdown.reduce((acc, item) => acc + Number(item.value || 0), 0)} />
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
                      <Pie data={expenseDistribution} cx="50%" cy="50%" innerRadius={66} outerRadius={96} paddingAngle={2} dataKey="amount" stroke="none">
                        {expenseDistribution.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => fmtCurrency(value)} />
                      <DonutCenter total={totalExpenses} />
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

            <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" style={{ borderColor: BORDER }}>
              <SectionHeader title="Sales Trend" subtitle="Revenue and bills over time" />
              <ResponsiveContainer width="100%" height={360}>
                <LineChart data={overview.sales_trend || []} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="date" tick={{ fontSize: 12, fill: MUTED }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: MUTED }} axisLine={false} tickLine={false} tickFormatter={(value) => fmtShort(value)} />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12, color: MUTED }} />
                  <Line type="monotone" dataKey="revenue" stroke={BLUE} strokeWidth={3} dot={false} name="Revenue" />
                  <Line type="monotone" dataKey="bills" stroke={GREEN} strokeWidth={3} dot={false} name="Bills" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mb-8 grid gap-6 xl:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" style={{ borderColor: BORDER }}>
                <SectionHeader title="Top Selling Stores" subtitle="Revenue leaders across the network" />
                <div className="overflow-hidden rounded-xl border border-slate-200">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: MUTED }}>#</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: MUTED }}>Store</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: MUTED }}>Revenue</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: MUTED }}>Bills</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: MUTED }}>Growth</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {(overview.top_stores || []).map((store) => (
                        <tr key={store.store} className="transition hover:bg-slate-50">
                          <td className="px-4 py-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold" style={{ background: store.rank === 1 ? "#FEF9C3" : "#EEF2FF", color: store.rank === 1 ? "#92400E" : BLUE }}>
                              {store.rank}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm font-semibold" style={{ color: TEXT }}>{store.store}</td>
                          <td className="px-4 py-3 text-sm font-semibold" style={{ color: TEXT }}>{fmtCurrency(store.revenue)}</td>
                          <td className="px-4 py-3 text-sm" style={{ color: MUTED }}>{fmtNumber(store.bills)}</td>
                          <td className="px-4 py-3">
                            <span className="rounded-full px-2.5 py-1 text-sm font-semibold" style={{ color: store.growth >= 0 ? GREEN : RED, background: store.growth >= 0 ? "#F0FDF4" : "#FEF2F2" }}>
                              {store.growth >= 0 ? <ArrowUpRight size={13} className="mr-1 inline" /> : <ArrowDownRight size={13} className="mr-1 inline" />}
                              {Math.abs(store.growth).toFixed(1)}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" style={{ borderColor: BORDER }}>
                <SectionHeader title="Top Bounced Medicines" subtitle="Highest-risk stock-outs" />
                <div className="overflow-hidden rounded-xl border border-slate-200">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: MUTED }}>Medicine</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: MUTED }}>Requests</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: MUTED }}>Store</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: MUTED }}>Risk</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {(overview.top_bounced_medicines || []).map((item, index) => (
                        <tr key={`${item.medicine}-${index}`} className="transition hover:bg-slate-50">
                          <td className="px-4 py-3 text-sm font-semibold" style={{ color: TEXT }}>{item.medicine}</td>
                          <td className="px-4 py-3 text-sm font-semibold" style={{ color: TEXT }}>{fmtNumber(item.requests)}</td>
                          <td className="px-4 py-3 text-sm" style={{ color: MUTED }}>{item.store}</td>
                          <td className="px-4 py-3">
                            <span className="rounded-full px-2.5 py-1 text-sm font-semibold" style={{ background: item.risk === "Critical" ? "#FEF2F2" : item.risk === "High" ? "#FFF7ED" : "#F0FDF4", color: item.risk === "Critical" ? RED : item.risk === "High" ? ORANGE : GREEN }}>
                              {item.risk}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" style={{ borderColor: BORDER }}>
              <SectionHeader title="Business Insights" subtitle="Generated from live analytics" />
              <div className="grid gap-4 xl:grid-cols-2">
                {(overview.insights || []).map((insight, index) => {
                  const Icon = [TrendingUp, Activity, Zap, Star, Package, Lightbulb][index % 6];
                  return <InsightCard key={insight.text} icon={Icon} text={insight.text} accent={ACCENT_COLORS[index % ACCENT_COLORS.length]} />;
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" style={{ borderColor: BORDER }}>
              <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight" style={{ color: TEXT }}>
                    Forecast
                  </h2>
                  <p className="mt-1 text-sm" style={{ color: MUTED }}>
                    Trend-based forecast for the next months
                  </p>
                </div>
                <div className="flex flex-wrap gap-4 rounded-2xl bg-slate-50 p-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: MUTED }}>Revenue</p>
                    <p className="text-lg font-bold" style={{ color: BLUE }}>{fmtCurrency(overview.forecast?.projected_revenue || 0)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: MUTED }}>Bills</p>
                    <p className="text-lg font-bold" style={{ color: GREEN }}>{fmtNumber(overview.forecast?.projected_bills || 0)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: MUTED }}>Expenses</p>
                    <p className="text-lg font-bold" style={{ color: ORANGE }}>{fmtCurrency(overview.forecast?.projected_expenses || 0)}</p>
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={overview.forecast?.series || []} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
                  <defs>
                    <linearGradient id="actGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={BLUE} stopOpacity={0.16} />
                      <stop offset="95%" stopColor={BLUE} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="frcGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={PURPLE} stopOpacity={0.14} />
                      <stop offset="95%" stopColor={PURPLE} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: MUTED }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: MUTED }} axisLine={false} tickLine={false} tickFormatter={(value) => fmtShort(value)} />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12, color: MUTED }} />
                  <Area type="monotone" dataKey="actual" stroke={BLUE} strokeWidth={2.5} fill="url(#actGrad)" name="Actual" dot={false} connectNulls={false} />
                  <Area type="monotone" dataKey="forecast" stroke={PURPLE} strokeWidth={2.5} strokeDasharray="6 3" fill="url(#frcGrad)" name="Forecast" dot={false} connectNulls={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
