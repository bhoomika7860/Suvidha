import { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  DollarSign,
  FileText,
  Truck,
  AlertCircle,
  CreditCard,
  Download,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  ChevronDown,
  Store,
  Wallet,
} from "lucide-react";

import analyticsService from "../../services/analyticsService";
import ExportReportsModal from "../../components/reports/ExportReportsModal";

const BLUE = "#2563EB";
const GREEN = "#16A34A";
const RED = "#DC2626";
const ORANGE = "#EA580C";
const PURPLE = "#7C3AED";
const CYAN = "#0891B2";
const TEXT = "#111827";
const MUTED = "#64748B";
const BORDER = "#E2E8F0";

const PAYMENT_COLORS = {
  Cash: GREEN,
  UPI: PURPLE,
  Card: CYAN,
  Udhaar: "#D97706",
};

const EXPENSE_COLORS = [
  BLUE,
  GREEN,
  PURPLE,
  ORANGE,
  RED,
  CYAN,
  "#F59E0B",
];

const PERIODS = [
  { label: "Today", value: "today" },
  { label: "7 Days", value: "7days" },
  { label: "30 Days", value: "30days" },
  { label: "90 Days", value: "90days" },
  { label: "This Month", value: "month" },
  { label: "Last Month", value: "last_month" },
  { label: "This Year", value: "year" },
];

const fmtCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;

const fmtShort = (value) => {
  const amount = Number(value || 0);

  // Indian number system: 1 Lakh = 1,00,000 and 1 Crore = 1,00,00,000.
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)}Cr`;
  }

  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)}L`;
  }

  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  }

  return `₹${amount}`;
};

const fmtNumber = (value) =>
  Number(value || 0).toLocaleString("en-IN");


function KpiCard({
  icon: Icon,
  label,
  value,
  trend,
  up,
  accent,
}) {
  return (
    <div className="min-w-0 rounded-xl border border-slate-200 bg-white px-3.5 py-3.5 shadow-sm sm:px-4 sm:py-4">
      <div className="flex items-start justify-between gap-2">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg sm:h-10 sm:w-10"
          style={{ background: `${accent}14` }}
        >
          <Icon
            size={18}
            color={accent}
            strokeWidth={2}
          />
        </div>

        <span
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
          style={{
            color: up ? GREEN : RED,
            background: up ? "#F0FDF4" : "#FEF2F2",
          }}
        >
          {up ? (
            <ArrowUpRight size={13} />
          ) : (
            <ArrowDownRight size={13} />
          )}
        </span>
      </div>

      <p className="mt-3.5 truncate text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-500 sm:text-[10px]">
        {label}
      </p>

      <p className="mt-1.5 truncate text-[17px] font-bold tracking-tight text-slate-900 sm:text-[19px]">
        {value}
      </p>

      {trend ? (
        <p className="mt-0.5 truncate text-[10px] text-slate-400">
          {trend}
        </p>
      ) : null}
    </div>
  );
}

function SectionCard({
  number,
  icon: Icon,
  title,
  subtitle,
  accent,
  open,
  onToggle,
  children,
  className = "",
}) {
  return (
    <section
      className={`overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}
    >
      {/* MOBILE ONLY: expandable accordion header */}
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-3 px-4 py-4 text-left transition hover:bg-slate-50 lg:hidden"
      >
        <span className="text-[10px] font-semibold tracking-[0.18em] text-slate-400">
          {String(number).padStart(2, "0")}
        </span>

        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
          style={{ background: `${accent}12` }}
        >
          <Icon size={18} color={accent} />
        </span>

        <span className="min-w-0 flex-1">
          <span className="block truncate text-[15px] font-bold text-slate-900">
            {title}
          </span>

          {subtitle ? (
            <span className="mt-0.5 block truncate text-xs text-slate-500">
              {subtitle}
            </span>
          ) : null}
        </span>

        <ChevronDown
          size={18}
          className={`shrink-0 text-slate-400 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* DESKTOP ONLY: normal static section header */}
      <div className="hidden items-center gap-3 border-b border-slate-100 px-5 py-4 lg:flex">
        <span className="text-[10px] font-semibold tracking-[0.18em] text-slate-400">
          {String(number).padStart(2, "0")}
        </span>

        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
          style={{ background: `${accent}12` }}
        >
          <Icon size={18} color={accent} />
        </span>

        <div className="min-w-0">
          <h2 className="truncate text-base font-bold text-slate-900">
            {title}
          </h2>

          {subtitle ? (
            <p className="mt-0.5 truncate text-xs text-slate-500">
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>

      {/* MOBILE: accordion content. DESKTOP: always open. */}
      <div
        className={`border-t border-slate-100 px-4 pb-4 pt-4 sm:px-5 sm:pb-5 lg:block lg:border-t-0 lg:px-5 lg:pb-5 lg:pt-5 ${
          open ? "block" : "hidden"
        }`}
      >
        {children}
      </div>
    </section>
  );
}

function EmptyState({ text }) {
  return (
    <div className="rounded-xl bg-slate-50 px-4 py-7 text-center text-sm text-slate-500">
      {text}
    </div>
  );
}

function UdhaarRow({ entry }) {
  const recoveryRate = Math.max(
    0,
    Math.min(
      Number(entry.recovery_rate || 0),
      100
    )
  );

  const barColor =
    recoveryRate >= 80
      ? GREEN
      : recoveryRate >= 70
      ? ORANGE
      : RED;

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 sm:p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-slate-900">
            {entry.store_name}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Pending {fmtCurrency(entry.pending)}
          </p>
        </div>

        <span
          className="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold"
          style={{
            color: barColor,
            background: `${barColor}14`,
          }}
        >
          {recoveryRate.toFixed(1)}%
        </span>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full"
          style={{
            width: `${recoveryRate}%`,
            background: barColor,
          }}
        />
      </div>

      <div className="mt-2 flex items-center justify-between gap-3 text-[11px] text-slate-500">
        <span>
          Recovered {fmtCurrency(entry.recovered)}
        </span>

        <span>
          Credit {fmtCurrency(entry.total_credit ?? entry.pending + entry.recovered)}
        </span>
      </div>
    </div>
  );
}

function PurchaseStoreList({ stores, total }) {
  if (!stores.length) {
    return <EmptyState text="No purchase data available." />;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="divide-y divide-slate-100">
        {stores.map((store, index) => (
          <div
            key={store.store_id ?? `${store.store_name}-${index}`}
            className="flex min-w-0 items-center justify-between gap-4 px-4 py-3.5"
          >
            <p className="min-w-0 truncate text-sm font-semibold text-slate-900">
              {store.store_name}
            </p>

            <p className="shrink-0 text-sm font-bold text-slate-900">
              {fmtCurrency(store.total_purchases)}
            </p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-4 py-3.5">
        <p className="text-sm font-bold text-slate-900">Total</p>
        <p className="text-sm font-bold text-slate-900">
          {fmtCurrency(total)}
        </p>
      </div>
    </div>
  );
}


export default function Analytics() {
  const [dashboard, setDashboard] = useState(null);
  const [stores, setStores] = useState([]);
  const [udhaar, setUdhaar] = useState([]);
  const [paymentBreakdown, setPaymentBreakdown] =
    useState([]);
  const [expenseDistribution, setExpenseDistribution] =
    useState([]);
  const [deliveryPerformance, setDeliveryPerformance] =
    useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [selectedStore, setSelectedStore] =
    useState("all");
  const [selectedPeriod, setSelectedPeriod] =
    useState("today");

  const [error, setError] = useState("");
  const [showExport, setShowExport] =
    useState(false);

  const [openSections, setOpenSections] =
    useState({
      storeComparison: false,
      paymentBreakdown: false,
      expenseBreakdown: false,
      udhaar: false,
      deliveries: false,
      purchases: false,
    });

  const toggleSection = (key) => {
    setOpenSections((previous) => ({
      ...previous,
      [key]: !previous[key],
    }));
  };

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
        deliveryData,
      ] = await Promise.all([
        analyticsService.getDashboardSummary(
          selectedPeriod,
          selectedStore
        ),
        analyticsService.getStoreSummary(
          selectedPeriod,
          selectedStore
        ),
        analyticsService.getOutstandingUdhaar(
          selectedPeriod,
          selectedStore
        ),
        analyticsService.getPaymentBreakdown(
          selectedPeriod,
          selectedStore
        ),
        analyticsService.getExpenseDistribution(
          selectedPeriod,
          selectedStore
        ),
        analyticsService.getDeliveryPerformance(
          selectedPeriod,
          selectedStore
        ),
      ]);

      setDashboard(dashboardData);

      setStores(
        Array.isArray(storeData)
          ? storeData.map((store) => ({
              ...store,
              total_sales: Number(
                store.total_sales || 0
              ),
              total_bills: Number(
                store.total_bills || 0
              ),
              total_expenses: Number(
                store.total_expenses || 0
              ),
              total_purchases: Number(
                store.total_purchases || 0
              ),
            }))
          : []
      );

      setUdhaar(
        Array.isArray(udhaarData)
          ? udhaarData
          : []
      );

      setPaymentBreakdown(
        Array.isArray(paymentData)
          ? paymentData
          : []
      );

      setExpenseDistribution(
        Array.isArray(expenseData)
          ? expenseData
          : []
      );

      setDeliveryPerformance(
        Array.isArray(deliveryData)
          ? deliveryData
          : []
      );
    } catch (err) {
      console.error(
        "Failed to load analytics:",
        err
      );
      setError(
        "Unable to load analytics."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAnalytics();
  };

  useEffect(() => {
    loadAnalytics();
  }, [selectedStore, selectedPeriod]);

  const kpiCards = dashboard
    ? [
        {
          icon: DollarSign,
          label: "Total Revenue",
          value: fmtCurrency(
            dashboard.total_sales
          ),
          up: true,
          accent: BLUE,
        },
        {
          icon: FileText,
          label: "Total Bills",
          value: fmtNumber(
            dashboard.total_bills
          ),
          up: true,
          accent: GREEN,
        },
        {
          icon: Package,
          label: "Total Purchases",
          value: fmtCurrency(
            dashboard.total_purchases
          ),
          up: true,
          accent: PURPLE,
        },
        {
          icon: AlertCircle,
          label: "Total Expenses",
          value: fmtCurrency(
            dashboard.total_expenses
          ),
          up: false,
          accent: ORANGE,
        },
        {
          icon: CreditCard,
          label: "Outstanding Udhaar",
          value: fmtCurrency(
            dashboard.total_udhaar
          ),
          up: false,
          accent: RED,
        },
        {
          icon: Truck,
          label: "Total Deliveries",
          value: fmtNumber(
            dashboard.total_deliveries
          ),
          trend: `${fmtNumber(
            dashboard.total_deliveries
          )} today`,
          up: true,
          accent: GREEN,
        },
      ]
    : [];

  const storeOptions = useMemo(
    () => [
      {
        store_id: "all",
        store_name: "All Stores",
      },
      ...stores,
    ],
    [stores]
  );

  // Use the backend dashboard totals as the source of truth for the
  // summary rows. The category lists are still rendered from their own
  // backend breakdown endpoints, but the displayed totals must match the
  // main KPI calculations exactly.
  const totalPayments = Number(
    dashboard?.total_sales ??
      paymentBreakdown.reduce(
        (sum, item) =>
          sum + Number(item.value || 0),
        0
      )
  );

  const totalExpenses = Number(
    dashboard?.total_expenses ??
      expenseDistribution.reduce(
        (sum, item) =>
          sum + Number(item.amount || 0),
        0
      )
  );

  const totalPurchases = Number(
    dashboard?.total_purchases ??
      stores.reduce(
        (sum, store) =>
          sum + Number(store.total_purchases || 0),
        0
      )
  );

  return (
    <div className="w-full min-w-0 overflow-x-hidden bg-[#F8FAFC]">
      {/* =========================================================
          SINGLE RESPONSIVE ANALYTICS PAGE
          There is intentionally NO separate mobile/desktop page.
          This prevents the page from ever rendering twice.
      ========================================================= */}

      <div className="mx-auto w-full max-w-[1440px] min-w-0 px-4 pb-24 pt-5 sm:px-6 sm:pb-10 sm:pt-6 lg:px-8 lg:pt-8">
        {/* Header */}
        <header className="mb-5 sm:mb-6">
          <div className="w-full bg-white border-b px-5 pt-6 pb-5 sm:rounded-xl sm:border sm:px-6 sm:pt-6 sm:pb-5 lg:border-0 lg:bg-transparent lg:px-0 lg:pt-0 lg:pb-0">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <h1 className="text-3xl font-bold text-gray-900">
                  Analytics
                </h1>

                
              </div>

              <div className="flex w-full items-center gap-2.5 lg:w-auto">
                <button
                  type="button"
                  onClick={() => setShowExport(true)}
                  className="flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 lg:flex-none lg:px-4"
                >
                  <Download size={16} />
                  <span>Export Analytics</span>
                </button>

                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <RefreshCw
                    size={16}
                    className={
                      refreshing
                        ? "animate-spin"
                        : ""
                    }
                  />

                  <span>
                    {refreshing
                      ? "Refreshing..."
                      : "Refresh"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Filters */}
        <section className="mb-5 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm sm:mb-6 sm:p-4">
          <div className="grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) =>
                setSelectedPeriod(
                  e.target.value
                )
              }
              className="h-10 min-w-0 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:h-11 sm:min-w-[130px]"
            >
              {PERIODS.map((item) => (
                <option
                  key={item.value}
                  value={item.value}
                >
                  {item.label}
                </option>
              ))}
            </select>

            <select
              value={selectedStore}
              onChange={(e) =>
                setSelectedStore(
                  e.target.value
                )
              }
              className="h-10 min-w-0 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:h-11 sm:min-w-[145px]"
            >
              {storeOptions.map((store) => (
                <option
                  key={store.store_id}
                  value={store.store_id}
                >
                  {store.store_name}
                </option>
              ))}
            </select>
          </div>
        </section>

        {error ? (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="flex min-h-40 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
              <RefreshCw
                size={16}
                className="animate-spin"
              />
              Loading analytics...
            </div>
          </div>
        ) : (
          <>
            {/* =====================================================
                KPI ROW
            ====================================================== */}
            <section className="mb-5 sm:mb-6">
              <div className="mb-3 px-0.5">
                <h2 className="text-lg font-bold text-slate-900">
                  Business Overview
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  Key numbers for the selected
                  period and store.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 xl:grid-cols-6">
                {kpiCards.map((card) => (
                  <KpiCard
                    key={card.label}
                    {...card}
                  />
                ))}
              </div>
            </section>

            {/* =====================================================
                01 STORE COMPARISON
                Full width on desktop.
            ====================================================== */}
            <SectionCard
              number={1}
              icon={Store}
              title="Store Comparison"
              subtitle="Revenue across the retail network"
              accent={BLUE}
              open={openSections.storeComparison}
              onToggle={() =>
                toggleSection(
                  "storeComparison"
                )
              }
              className="mb-4 sm:mb-5"
            >
              {stores.length > 0 ? (
                <>
                  <div className="h-[250px] w-full sm:h-[320px] lg:h-[370px]">
                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >
                      <BarChart
                        layout="vertical"
                        data={stores}
                        margin={{
                          top: 8,
                          right: 20,
                          left: 8,
                          bottom: 8,
                        }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          horizontal={false}
                        />

                        <XAxis
                          type="number"
                          dataKey="total_sales"
                          tickFormatter={
                            fmtShort
                          }
                          tick={{
                            fontSize: 10,
                            fill: MUTED,
                          }}
                          tickLine={false}
                          axisLine={false}
                        />

                        <YAxis
                          type="category"
                          dataKey="store_name"
                          width={78}
                          tick={{
                            fontSize: 10,
                            fill: TEXT,
                          }}
                          tickLine={false}
                          axisLine={false}
                        />

                        <Tooltip
                          formatter={(value) =>
                            fmtCurrency(value)
                          }
                        />

                        <Bar
                          dataKey="total_sales"
                          name="Revenue"
                          fill={BLUE}
                          radius={[
                            0, 7, 7, 0,
                          ]}
                          barSize={28}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                </>
              ) : (
                <EmptyState text="No store data available." />
              )}
            </SectionCard>

            {/* =====================================================
                02 PAYMENT + 03 EXPENSE
                Side-by-side on desktop.
            ====================================================== */}
            <div className="mb-4 grid gap-4 sm:mb-5 xl:grid-cols-2">
              <SectionCard
                number={2}
                icon={Wallet}
                title="Payment Breakdown"
                subtitle="How sales were collected"
                accent={PURPLE}
                open={
                  openSections.paymentBreakdown
                }
                onToggle={() =>
                  toggleSection(
                    "paymentBreakdown"
                  )
                }
              >
                {paymentBreakdown.length >
                0 ? (
                  <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:justify-center">
                    <div className="shrink-0">
                      <PieChart
                        width={210}
                        height={210}
                      >
                        <Pie
                          data={
                            paymentBreakdown
                          }
                          cx="50%"
                          cy="50%"
                          innerRadius={58}
                          outerRadius={84}
                          paddingAngle={2}
                          dataKey="value"
                          stroke="none"
                        >
                          {paymentBreakdown.map(
                            (entry) => (
                              <Cell
                                key={
                                  entry.name
                                }
                                fill={
                                  PAYMENT_COLORS[
                                    entry.name
                                  ] || BLUE
                                }
                              />
                            )
                          )}
                        </Pie>

                        <Tooltip
                          formatter={(value) =>
                            fmtCurrency(value)
                          }
                        />
                      </PieChart>
                    </div>

                    <div className="w-full max-w-sm space-y-2">
                      {paymentBreakdown.map(
                        (entry) => (
                          <div
                            key={entry.name}
                            className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5"
                          >
                            <div className="flex items-center gap-2.5">
                              <span
                                className="h-2.5 w-2.5 rounded-full"
                                style={{
                                  background:
                                    PAYMENT_COLORS[
                                      entry.name
                                    ] || BLUE,
                                }}
                              />

                              <span className="text-sm font-semibold text-slate-900">
                                {entry.name}
                              </span>
                            </div>

                            <span className="text-sm font-bold text-slate-700">
                              {fmtCurrency(
                                entry.value
                              )}
                            </span>
                          </div>
                        )
                      )}

                      <div className="mt-2 flex items-center justify-between border-t border-slate-200 px-3 pt-3">
                        <span className="text-sm font-bold text-slate-900">
                          Total
                        </span>
                        <span className="text-sm font-bold text-slate-900">
                          {fmtCurrency(totalPayments)}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <EmptyState text="No payment data available." />
                )}
              </SectionCard>

              <SectionCard
                number={3}
                icon={AlertCircle}
                title="Expense Breakdown"
                subtitle="Operational spending by category"
                accent={ORANGE}
                open={
                  openSections.expenseBreakdown
                }
                onToggle={() =>
                  toggleSection(
                    "expenseBreakdown"
                  )
                }
              >
                {expenseDistribution.length >
                0 ? (
                  <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:justify-center">
                    <div className="shrink-0">
                      <PieChart
                        width={210}
                        height={210}
                      >
                        <Pie
                          data={
                            expenseDistribution
                          }
                          cx="50%"
                          cy="50%"
                          innerRadius={58}
                          outerRadius={84}
                          paddingAngle={2}
                          dataKey="amount"
                          stroke="none"
                        >
                          {expenseDistribution.map(
                            (entry, index) => (
                              <Cell
                                key={
                                  entry.name
                                }
                                fill={
                                  EXPENSE_COLORS[
                                    index %
                                      EXPENSE_COLORS.length
                                  ]
                                }
                              />
                            )
                          )}
                        </Pie>

                        <Tooltip
                          formatter={(value) =>
                            fmtCurrency(value)
                          }
                        />
                      </PieChart>
                    </div>

                    <div className="w-full max-w-sm space-y-2">
                      {expenseDistribution.map(
                        (entry, index) => (
                          <div
                            key={entry.name}
                            className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5"
                          >
                            <div className="flex min-w-0 items-center gap-2.5">
                              <span
                                className="h-2.5 w-2.5 shrink-0 rounded-full"
                                style={{
                                  background:
                                    EXPENSE_COLORS[
                                      index %
                                        EXPENSE_COLORS.length
                                    ],
                                }}
                              />

                              <span className="truncate text-sm font-semibold text-slate-900">
                                {entry.name}
                              </span>
                            </div>

                            <span className="ml-3 shrink-0 text-sm font-bold text-slate-700">
                              {fmtCurrency(
                                entry.amount
                              )}
                            </span>
                          </div>
                        )
                      )}

                      <div className="mt-2 flex items-center justify-between border-t border-slate-200 px-3 pt-3">
                        <span className="text-sm font-bold text-slate-900">
                          Total
                        </span>
                        <span className="text-sm font-bold text-slate-900">
                          {fmtCurrency(totalExpenses)}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <EmptyState text="No expense data available." />
                )}
              </SectionCard>
            </div>

            {/* =====================================================
                04 UDHAAR
                Full width and BELOW expense breakdown.
            ====================================================== */}
            <SectionCard
              number={4}
              icon={CreditCard}
              title="Outstanding Udhaar"
              subtitle="Recovery performance by store"
              accent={RED}
              open={openSections.udhaar}
              onToggle={() =>
                toggleSection("udhaar")
              }
              className="mb-4 sm:mb-5"
            >
              {udhaar.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {udhaar.map((entry) => (
                    <UdhaarRow
                      key={
                        entry.store_name
                      }
                      entry={entry}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState text="No outstanding udhaar data available." />
              )}
            </SectionCard>

            {/* =====================================================
                05 + 06 DESKTOP LOWER ROW
                Purchases replaces the old store-ranking area.
                Mobile remains accordion-based.
            ====================================================== */}
            <div className="grid gap-4 sm:gap-5 xl:grid-cols-2">
              {/* 05 DELIVERIES */}
              <SectionCard
                number={5}
                icon={Truck}
                title="Deliveries"
                subtitle="Deliveries completed by each store"
                accent={GREEN}
                open={openSections.deliveries}
                onToggle={() =>
                  toggleSection("deliveries")
                }
              >
                {deliveryPerformance.length > 0 ? (
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {deliveryPerformance.map(
                      (store, index) => (
                        <div
                          key={
                            store.store ??
                            index
                          }
                          className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3.5 py-3"
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-50 text-xs font-bold text-green-600">
                            {index + 1}
                          </div>

                          <p className="min-w-0 flex-1 truncate text-sm font-bold text-slate-900">
                            {store.store}
                          </p>

                          <div className="text-right">
                            <p className="text-sm font-bold text-green-600">
                              {fmtNumber(
                                store.deliveries
                              )}
                            </p>

                            <p className="text-[10px] text-slate-400">
                              deliveries
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <EmptyState text="No delivery data available." />
                )}
              </SectionCard>

              {/* 06 PURCHASES — replaces the old ranking table */}
              <SectionCard
                number={6}
                icon={Package}
                title="Purchases by Store"
                subtitle="Total purchase value by store"
                accent={PURPLE}
                open={openSections.purchases}
                onToggle={() =>
                  toggleSection("purchases")
                }
              >
                {stores.length > 0 ? (
                  <PurchaseStoreList
                    stores={stores}
                    total={totalPurchases}
                  />
                ) : (
                  <EmptyState text="No purchase data available." />
                )}
              </SectionCard>
            </div>
          </>
        )}
      </div>

      <ExportReportsModal
        open={showExport}
        onClose={() =>
          setShowExport(false)
        }
        type="analytics"
      />
    </div>
  );
}
