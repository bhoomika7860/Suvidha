import { useEffect, useState } from "react";

import {
  Store,
  Package,
  ChevronRight,
  IndianRupee,
  ShoppingCart,
  Receipt,
} from "lucide-react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

import Card from "../../components/common/Card";
import dashboardService from "../../services/dashboardService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";


// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

function formatINR(value) {
  const number = Number(value || 0);

  if (number >= 100000) {
    return `₹${(number / 100000).toFixed(1)}L`;
  }

  if (number >= 1000) {
    return `₹${(number / 1000).toFixed(0)}K`;
  }

  return `₹${number}`;
}


function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good Morning";
  }

  if (hour < 17) {
    return "Good Afternoon";
  }

  return "Good Evening";
}


// ─────────────────────────────────────────────────────────────
// DESKTOP KPI CARD
// ─────────────────────────────────────────────────────────────

function KpiCard({
  label,
  value,
  sub,
  color = "border-slate-200",
  bgColor = "bg-slate-100",
  iconColor = "text-slate-600",
  Icon,
}) {
  return (
    <Card
      className={`border-t-4 ${color} bg-white p-6 transition-all duration-200 hover:shadow-md`}
    >
      {Icon && (
        <div
          className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${bgColor}`}
        >
          <Icon
            size={20}
            className={iconColor}
          />
        </div>
      )}

      <div className="mb-3">
        <span className="text-sm font-semibold uppercase tracking-wide text-[#475569]">
          {label}
        </span>
      </div>

      <div className="text-4xl font-bold tracking-tight text-[#0F172A]">
        {value}
      </div>

      <div className="mt-3 text-sm font-medium text-[#64748B]">
        {sub}
      </div>
    </Card>
  );
}


// ─────────────────────────────────────────────────────────────
// DESKTOP STORE TABLE
// ─────────────────────────────────────────────────────────────

function StoreTable({
  storeSummary,
  totalStores,
}) {
  const navigate = useNavigate();

  const pendingStores = Math.max(
    0,
    totalStores - storeSummary.length
  );

  return (
    <Card className="overflow-hidden">

      <div className="flex items-center justify-between border-b border-[rgba(74,124,158,0.12)] px-7 py-5">

        <h2 className="text-2xl font-bold uppercase tracking-wide text-[#0F172A]">
          Store Performance
        </h2>

        <button
          type="button"
          onClick={() =>
            navigate("/stores")
          }
          className="flex items-center gap-1 text-sm font-semibold text-[#2563eb] transition hover:text-[#1d4ed8]"
        >
          View all
          <ChevronRight size={14} />
        </button>

      </div>


      <div className="overflow-x-auto">

        <table className="w-full table-fixed">

          <thead>
            <tr className="border-b border-[rgba(74,124,158,0.08)]">

              {[
                "Store",
                "Total Sales",
                "Total Bills",
              ].map((heading) => (
                <th
                  key={heading}
                  className="px-6 py-4 text-left text-base font-bold uppercase tracking-wide text-[#334155]"
                >
                  {heading}
                </th>
              ))}

            </tr>
          </thead>


          <tbody>

            {storeSummary.map((store) => (
              <tr
                key={store.store_id}
                onClick={() =>
                  navigate("/daily-reports")
                }
                className="cursor-pointer border-b border-[rgba(74,124,158,0.06)] transition-colors hover:bg-slate-50"
              >

                <td className="px-5 py-4">

                  <div className="flex items-center gap-3">

                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md border border-[#4a7c9e]/20 bg-[#4a7c9e]/15">

                      <Store
                        size={14}
                        className="text-[#4a7c9e]"
                      />

                    </div>

                    <span className="text-base font-semibold text-[#0F172A]">
                      {store.store_name}
                    </span>

                  </div>

                </td>


                <td className="px-5 py-4 text-base font-bold text-[#0F172A]">
                  ₹{(
                    store.total_sales || 0
                  ).toLocaleString("en-IN")}
                </td>


                <td className="px-5 py-4 text-base font-semibold text-[#334155]">
                  {store.total_bills || 0}
                </td>

              </tr>
            ))}

          </tbody>


          <tfoot>

            <tr>

              <td
                colSpan="3"
                className="border-t border-[rgba(74,124,158,0.08)] px-6 py-3 text-base font-semibold text-[#475569]"
              >
                {pendingStores}{" "}
                {pendingStores === 1
                  ? "store"
                  : "stores"}{" "}
                pending today's submission
              </td>

            </tr>

          </tfoot>

        </table>

      </div>

    </Card>
  );
}


// ─────────────────────────────────────────────────────────────
// MOBILE KPI CARD
// ─────────────────────────────────────────────────────────────

function MobileKpiCard({
  label,
  value,
  Icon,
  iconBackground,
  iconColor,
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">

      <div
        className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconBackground}`}
      >
        <Icon
          size={18}
          className={iconColor}
        />
      </div>


      <p className="mt-3 text-[10px] font-medium uppercase tracking-wide text-[#64748B]">
        {label}
      </p>


      <p className="mt-1 text-[18px] font-semibold leading-none tracking-tight text-[#0F172A]">
        {value}
      </p>

    </div>
  );
}


// ─────────────────────────────────────────────────────────────
// MOBILE STORE CARD
// ─────────────────────────────────────────────────────────────

function MobileStoreCard({
  store,
}) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() =>
        navigate("/daily-reports")
      }
      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left shadow-sm transition active:scale-[0.99]"
    >

      <div className="flex items-center gap-3">

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">

          <Store
            size={18}
            className="text-blue-600"
          />

        </div>


        <div className="min-w-0 flex-1">

          <p className="truncate text-[15px] font-semibold leading-5 text-[#0F172A]">
            {store.store_name}
          </p>

          <p className="mt-1 text-[12px] font-medium text-[#64748B]">
            Today&apos;s performance
          </p>

        </div>


        <ChevronRight
          size={18}
          className="shrink-0 text-slate-400"
        />

      </div>


      <div className="mt-4 grid grid-cols-2 gap-4 border-t border-slate-100 pt-3.5">

        <div>

          <p className="text-[10px] font-semibold uppercase tracking-[0.05em] text-[#64748B]">
            Total Sales
          </p>

          <p className="mt-1.5 text-[17px] font-semibold leading-none text-[#0F172A]">
            ₹{(
              store.total_sales || 0
            ).toLocaleString("en-IN")}
          </p>

        </div>


        <div>

          <p className="text-[10px] font-semibold uppercase tracking-[0.05em] text-[#64748B]">
            Total Bills
          </p>

          <p className="mt-1.5 text-[17px] font-semibold leading-none text-[#0F172A]">
            {store.total_bills || 0}
          </p>

        </div>

      </div>

    </button>
  );
}


// ─────────────────────────────────────────────────────────────
// MOBILE STORE PERFORMANCE
// ─────────────────────────────────────────────────────────────

function MobileStorePerformance({
  storeSummary,
  totalStores,
}) {
  const navigate = useNavigate();

  const pendingStores = Math.max(
    0,
    totalStores - storeSummary.length
  );

  return (
    <section>

      <div className="mb-3 flex items-end justify-between gap-3">

        <div>

          <h2 className="text-[18px] font-semibold leading-tight tracking-tight text-[#0F172A]">
            Store Performance
          </h2>

          <p className="mt-1 text-[12px] font-medium text-[#64748B]">
            Today&apos;s performance by store
          </p>

        </div>


        <button
          type="button"
          onClick={() =>
            navigate("/stores")
          }
          className="flex shrink-0 items-center gap-0.5 text-[12px] font-medium text-blue-600"
        >
          View all
          <ChevronRight size={14} />
        </button>

      </div>


      <div className="space-y-3">

        {storeSummary.length > 0 ? (

          storeSummary.map(
            (store) => (
              <MobileStoreCard
                key={store.store_id}
                store={store}
              />
            )
          )

        ) : (

          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-5 text-center shadow-sm">

            <p className="text-[13px] font-medium text-slate-500">
              No store data available for today.
            </p>

          </div>

        )}

      </div>


      {pendingStores > 0 && (

        <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">

          <p className="text-[12px] font-medium text-amber-800">
            {pendingStores}{" "}
            {pendingStores === 1
              ? "store is"
              : "stores are"}{" "}
            pending today&apos;s submission
          </p>

        </div>

      )}

    </section>
  );
}


// ─────────────────────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────────────────────

export default function Dashboard() {
  const [salesData, setSalesData] =
    useState([]);

  const [comparisonData, setComparisonData] =
    useState([]);

  const [totalStores, setTotalStores] =
    useState(0);

  const [storeSummary, setStoreSummary] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [
    dashboardSummary,
    setDashboardSummary,
  ] = useState({
    total_sales: 0,
    total_purchases: 0,
    total_bills: 0,
    total_expenses: 0,
    total_deliveries: 0,
    purchase_bills_completed: 0,
    submitted_reports: 0,
  });

  const { user } = useAuth();


  useEffect(() => {

    const loadDashboard =
      async () => {

        try {

          setLoading(true);

          const data =
            await dashboardService.getDashboardData();

          setDashboardSummary(
            data.summary || {}
          );

          setTotalStores(
            data.totalStores || 0
          );

          setStoreSummary(
            data.storeSummary || []
          );

          setSalesData(
            data.salesData || []
          );

          setComparisonData(
            data.comparisonData || []
          );

        } catch (error) {

          console.error(
            "Failed to load owner dashboard:",
            error
          );

        } finally {

          setLoading(false);

        }

      };


    loadDashboard();

  }, []);


  if (loading) {

    return (
      <div className="flex min-h-[60vh] items-center justify-center px-5">

        <div className="text-center">

          <p className="text-base font-semibold text-slate-700">
            Loading dashboard...
          </p>

          <p className="mt-1 text-sm font-medium text-slate-500">
            Fetching today&apos;s store data.
          </p>

        </div>

      </div>
    );
  }


  const displayName =
    user?.full_name ||
    user?.username ||
    "User";

  const greeting =
    getGreeting();


  return (
    <>

      {/* ═══════════════════════════════════════════════════════
          DESKTOP
      ═══════════════════════════════════════════════════════ */}

      <main
        className="hidden flex-1 space-y-10 overflow-x-hidden bg-[#F8FAFC] px-6 py-8 lg:block lg:px-8"
        style={{
          backgroundImage: `
            linear-gradient(rgba(74,124,158,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(74,124,158,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      >

        {/* Desktop Hero */}

        <Card className="flex flex-col gap-5 px-8 py-3 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex-1">

            <p className="text-2xl font-black uppercase tracking-[0.12em] text-[#1E40AF]">
              Suvidha
            </p>

            <h1 className="mt-2 text-2xl font-bold leading-tight text-[#0F172A]">
              {greeting}, {displayName}
            </h1>

            <p className="mt-2 text-base text-[#64748B]">
              Here&apos;s today&apos;s operational overview
              across all stores.
            </p>

          </div>


          <div className="flex flex-shrink-0 items-center gap-3">

            <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2">

              <div className="h-2 w-2 rounded-full bg-emerald-500" />

              <span className="text-sm font-semibold text-emerald-700">
                {totalStores} Stores Active
              </span>

            </div>

          </div>

        </Card>


        {/* Desktop KPIs */}

        <div className="grid grid-cols-1 gap-6 transition-all md:grid-cols-2 xl:grid-cols-4">

          <KpiCard
            label="Total Sales"
            value={`₹${(
              dashboardSummary.total_sales ||
              0
            ).toLocaleString("en-IN")}`}
            sub="Gross business across all stores"
            color="border-blue-500"
            bgColor="bg-blue-100"
            iconColor="text-blue-600"
            Icon={IndianRupee}
          />


          <KpiCard
            label="Sales Bills"
            value={
              dashboardSummary.total_bills ||
              0
            }
            sub="Across all stores"
            color="border-violet-500"
            bgColor="bg-violet-100"
            iconColor="text-violet-600"
            Icon={Receipt}
          />


          <Card className="border-t-4 border-orange-500 bg-white p-6">

            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100">

              <ShoppingCart
                size={20}
                className="text-orange-600"
              />

            </div>

            <p className="text-sm font-semibold uppercase tracking-wide text-slate-600">
              Purchases
            </p>

            <div className="mt-4">

              <p className="text-xs text-slate-500">
                Total Purchases
              </p>

              <h2 className="text-2xl font-bold text-slate-900">
                ₹{(
                  dashboardSummary.total_purchases ||
                  0
                ).toLocaleString("en-IN")}
              </h2>

            </div>

            <div className="mt-5 border-t pt-4">

              <p className="text-xs text-slate-500">
                Purchase Bills Completed
              </p>

              <h2 className="text-2xl font-bold text-slate-900">
                {dashboardSummary.purchase_bills_completed ||
                  0}
              </h2>

            </div>

          </Card>


          <KpiCard
            label="Total Deliveries"
            value={
              dashboardSummary.total_deliveries ||
              0
            }
            sub="Completed today"
            color="border-emerald-500"
            bgColor="bg-emerald-100"
            iconColor="text-emerald-600"
            Icon={Package}
          />

        </div>


        {/* Desktop Charts */}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

          <Card className="overflow-hidden">

            <div className="flex items-center justify-between border-b border-[rgba(74,124,158,0.12)] px-7 py-5">

              <h2 className="text-2xl font-bold uppercase tracking-wide text-[#0F172A]">
                Sales Distribution
              </h2>

            </div>


            <div className="flex items-center justify-center p-6">

              <ResponsiveContainer
                width="100%"
                height={290}
              >

                <PieChart>

                  <Pie
                    data={salesData}
                    cx="50%"
                    cy="42%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={4}
                    dataKey="value"
                  >

                    {salesData.map(
                      (
                        entry,
                        index
                      ) => (
                        <Cell
                          key={`desktop-sales-${index}`}
                          fill={
                            [
                              "#FACC15",
                              "#F97316",
                              "#EC4899",
                              "#22C55E",
                              "#3B82F6",
                            ][index % 5]
                          }
                        />
                      )
                    )}

                  </Pie>


                  <Tooltip
                    formatter={(
                      value
                    ) => [
                      `₹${value}`,
                      "Sales",
                    ]}
                    contentStyle={{
                      backgroundColor:
                        "#111827",
                      border: "none",
                      borderRadius:
                        "12px",
                      color: "#fff",
                      padding:
                        "8px 12px",
                    }}
                  />


                  <Legend
                    verticalAlign="bottom"
                    align="center"
                    iconType="circle"
                    wrapperStyle={{
                      paddingTop:
                        "20px",
                    }}
                    formatter={(
                      value
                    ) => (
                      <span className="font-medium text-[#0F172A]">
                        {value}
                      </span>
                    )}
                  />

                </PieChart>

              </ResponsiveContainer>

            </div>

          </Card>


          <Card className="overflow-hidden">

            <div className="flex items-center justify-between border-b border-[rgba(74,124,158,0.12)] px-7 py-5">

              <h2 className="text-2xl font-bold uppercase tracking-wide text-[#0F172A]">
                Sales vs Purchases
              </h2>

            </div>


            <div className="flex items-center justify-center p-6">

              <ResponsiveContainer
                width="100%"
                height={290}
              >

                <BarChart
                  data={
                    comparisonData
                  }
                  barGap={8}
                  barCategoryGap="20%"
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#E5E7EB"
                  />

                  <XAxis
                    dataKey="store"
                    stroke="#64748B"
                    tick={{
                      fontSize: 12,
                    }}
                  />

                  <YAxis
                    stroke="#64748B"
                    tick={{
                      fontSize: 12,
                    }}
                    tickFormatter={(
                      value
                    ) =>
                      `${value / 1000}k`
                    }
                  />

                  <Tooltip
                    formatter={(
                      value,
                      name
                    ) => [
                      `₹${value}`,
                      name,
                    ]}
                    contentStyle={{
                      backgroundColor:
                        "#111827",
                      border: "none",
                      borderRadius:
                        "12px",
                      color: "#fff",
                      padding:
                        "8px 12px",
                    }}
                  />

                  <Legend
                    verticalAlign="bottom"
                    align="center"
                    wrapperStyle={{
                      paddingTop:
                        "20px",
                    }}
                    formatter={(
                      value
                    ) => (
                      <span className="font-medium text-[#0F172A]">
                        {value}
                      </span>
                    )}
                  />

                  <Bar
                    dataKey="sales"
                    name="Sales"
                    fill="#2563eb"
                    radius={[
                      8,
                      8,
                      0,
                      0,
                    ]}
                  />

                  <Bar
                    dataKey="purchases"
                    name="Purchases"
                    fill="#8b5cf6"
                    radius={[
                      8,
                      8,
                      0,
                      0,
                    ]}
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

          </Card>

        </div>


        <StoreTable
          storeSummary={
            storeSummary
          }
          totalStores={
            totalStores
          }
        />

      </main>


      {/* ═══════════════════════════════════════════════════════
          MOBILE
      ═══════════════════════════════════════════════════════ */}

      <main className="min-h-screen overflow-x-hidden bg-[#F8FAFC] px-5 pb-24 lg:hidden">

        {/* Page Header */}

        <div className="-mx-5 mb-5 border-b border-gray-200 bg-white px-5 pb-4 pt-5">

          <div className="flex items-start justify-between gap-3">

            <div className="min-w-0">

              <h1 className="text-[24px] font-bold leading-tight tracking-tight text-[#0F172A]">
                Dashboard
              </h1>

              <p className="mt-1 text-[13px] font-medium leading-5 text-[#64748B]">
                Store overview and today&apos;s activity.
              </p>

            </div>


            {/* Stores Active */}

            <div className="mt-1 flex shrink-0 items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2">

              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

              <span className="text-[11px] font-medium text-emerald-700">
                {totalStores}
              </span>

            </div>

          </div>

        </div>


        {/* Greeting */}

        <section className="mb-5 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">

          <p className="text-[12px] font-medium text-[#64748B]">
            {greeting},
          </p>

          <div className="mt-1 flex items-center justify-between gap-3">

            <h2 className="truncate text-[20px] font-bold leading-tight tracking-tight text-[#0F172A]">
              {displayName}
            </h2>

            <div className="shrink-0 text-right">

              <p className="text-[10px] font-medium text-[#64748B]">
                Stores Active
              </p>

              <p className="mt-0.5 text-[16px] font-semibold leading-none text-emerald-600">
                {totalStores}
              </p>

            </div>

          </div>

        </section>


        {/* Today's Overview */}

        <section className="mb-5">

          <div className="mb-3">

            <h2 className="text-[18px] font-semibold leading-tight tracking-tight text-[#0F172A]">
              Today&apos;s Overview
            </h2>

          </div>


          <div className="grid grid-cols-2 gap-3">

            <MobileKpiCard
              label="Total Sales"
              value={formatINR(
                dashboardSummary.total_sales ||
                  0
              )}
              Icon={IndianRupee}
              iconBackground="bg-blue-50"
              iconColor="text-blue-600"
            />


            <MobileKpiCard
              label="Sales Bills"
              value={
                dashboardSummary.total_bills ||
                0
              }
              Icon={Receipt}
              iconBackground="bg-violet-50"
              iconColor="text-violet-600"
            />


            <MobileKpiCard
              label="Deliveries"
              value={
                dashboardSummary.total_deliveries ||
                0
              }
              Icon={Package}
              iconBackground="bg-emerald-50"
              iconColor="text-emerald-600"
            />


            <MobileKpiCard
              label="Purchases"
              value={formatINR(
                dashboardSummary.total_purchases ||
                  0
              )}
              Icon={ShoppingCart}
              iconBackground="bg-orange-50"
              iconColor="text-orange-600"
            />

          </div>

        </section>


        {/* Store Performance */}

        <MobileStorePerformance
          storeSummary={
            storeSummary
          }
          totalStores={
            totalStores
          }
        />

      </main>

    </>
  );
}