import { useState, useRef, useEffect } from "react";
import {
  LayoutDashboard,
  Store,
  FileText,
  Package,
  Target,
  SlidersHorizontal,
  BarChart3,
  ClipboardList,
  Settings,
  Search,
  Bell,
  Menu,
  X,
  ChevronRight,
  LogOut,
  User,
  Shield,
  Download,
ChevronDown,IndianRupee,
  ShoppingCart,
  Receipt,
  Wallet,
  Users
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
  Legend
} from "recharts";
import Card from "../../components/common/Card";
import dashboardService from "../../services/dashboardService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

// ── data ────────────────────────────────────────────────────────────────────


const COLORS = ["#2563EB", "#1E40AF", "#60A5FA", "#93C5FD", "#BFDBFE"];






const bouncedProducts = [
  { name: "Cough Syrup 100ml", type: "Syrup", count: 14 },
  { name: "Ranitidine 150mg", type: "Tablet", count: 9 },
  { name: "Vitamin C 500mg", type: "Capsule", count: 7 },
  { name: "Cetirizine 10mg", type: "Tablet", count: 5 },
];





const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  
  { label: "Daily Reports", icon: FileText },
  { label: "Staff", icon: Users },
  { label: "Targets", icon: Target },
  { label: "Inventory", icon: Package },
  { label: "Analytics", icon: BarChart3 },
  { label: "Adjustments", icon: SlidersHorizontal },
  { label: "Audit Logs", icon: ClipboardList },
  { label: "Settings", icon: Settings },
];

// ── helpers ──────────────────────────────────────────────────────────────────

function statusColor(s) {
  if (s === "Locked") return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
  if (s === "Submitted") return "text-[#4a7c9e] bg-[#4a7c9e]/10 border-[#4a7c9e]/20";
  return "text-amber-400 bg-amber-400/10 border-amber-400/20";
}

function ProgressBar({ pct, dim }) {
  const color = pct >= 80 ? "#4a7c9e" : pct >= 60 ? "#e09c4a" : "#c05858";
  return (
    <div className="w-full h-1.5 rounded-full bg-white/5">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${pct}%`, backgroundColor: dim ? "#3a4a5a" : color }}
      />
    </div>
  );
}

function formatINR(n) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`;
  return `₹${n}`;
}

// ── sub-components ───────────────────────────────────────────────────────────

function SectionTitle({ children })
 {
  return (
    <h2 className="text-base font-semibold text-foreground tracking-tight">{children}</h2>
  );
}


// ── Notification dropdown ────────────────────────────────────────────────────

function NotifDropdown({ onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute right-0 top-12 w-80 rounded-xl border border-[rgba(74,124,158,0.2)] bg-[#1e2638] z-50"
      style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}
    >
      <div className="px-4 py-3 border-b border-[rgba(74,124,158,0.12)] flex items-center justify-between">
        <span className="text-sm font-semibold text-white">Notifications</span>
        <span className="text-xs text-[#4a7c9e] cursor-pointer hover:text-[#7ab3d4]">Mark all read</span>
      </div>
      <div className="divide-y divide-[rgba(74,124,158,0.08)]">
        {pendingActions.slice(0, 3).map((a, i) => (
          <div key={i} className="px-4 py-3 hover:bg-white/3 cursor-pointer transition-colors">
            <p className="text-xs font-medium text-white">{a.type}</p>
            <p className="text-xs text-[#6b82a0] mt-0.5">{a.detail}</p>
          </div>
        ))}
      </div>
      <div className="px-4 py-3 text-center">
        <span className="text-xs text-[#4a7c9e] cursor-pointer hover:text-[#7ab3d4]">View all notifications</span>
      </div>
    </div>
  );
}

// ── Profile dropdown ─────────────────────────────────────────────────────────

function ProfileDropdown({ onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute right-0 top-12 w-48 rounded-xl border border-[rgba(74,124,158,0.2)] bg-[#1e2638] z-50 overflow-hidden"
      style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}
    >
      <div className="px-4 py-3 border-b border-[rgba(74,124,158,0.12)]">
        <p className="text-xs font-semibold text-white">Rajesh Agarwal</p>
        <p className="text-[10px] text-[#6b82a0]">Owner</p>
      </div>
      {[
        { label: "My Profile", icon: User },
        { label: "Permissions", icon: Shield },
        { label: "Settings", icon: Settings },
      ].map(({ label, icon: Icon }) => (
        <button key={label} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-[#c0d4e8] hover:bg-white/5 transition-colors">
          <Icon size={13} className="text-[#4a7c9e]" />
          {label}
        </button>
      ))}
      <div className="border-t border-[rgba(74,124,158,0.12)]">
        <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-red-400 hover:bg-red-400/5 transition-colors">
          <LogOut size={13} />
          Sign Out
        </button>
      </div>
    </div>
  );
}


// ── KPI Card ─────────────────────────────────────────────────────────────────

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
      className={`p-6 border-t-4 ${color} bg-white hover:shadow-md transition-all duration-200`}
    >
      {/* Icon Section */}
      {Icon && (
        <div
          className={`w-11 h-11 rounded-xl ${bgColor} flex items-center justify-center mb-4`}
        >
          <Icon size={20} className={iconColor} />
        </div>
      )}

      {/* Heading */}
      <div className="mb-3">
        <span className="text-sm font-semibold text-[#475569] uppercase tracking-wide">
          {label}
        </span>
      </div>

      {/* Main Value */}
      <div className="text-4xl font-bold text-[#0F172A] tracking-tight">
        {value}
      </div>

      {/* Subtext */}
      <div className="text-sm font-medium text-[#64748B] mt-3">
        {sub}
      </div>
    </Card>
  );
}

// ── Store table ───────────────────────────────────────────────────────────────

function StoreTable({ storeSummary, totalStores }) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(null);

  return (
    <Card className="overflow-hidden">

      {/* Header */}
      <div className="px-7 py-5 border-b border-[rgba(74,124,158,0.12)] flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#0F172A] uppercase tracking-wide">
          Store Performance
        </h2>

        <span className="text-sm font-semibold text-[#2563eb] cursor-pointer hover:text-[#1d4ed8] flex items-center gap-1">
          View all <ChevronRight size={14} />
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-fixed">
          

          {/* Headings */}
          <thead>
            <tr className="border-b border-[rgba(74,124,158,0.08)]">
              {["Store", "Total Sales", "Total Bills"].map((h) => (
                <th
                  key={h}
                  className="px-6 py-4 text-left text-base font-bold text-[#334155] uppercase tracking-wide"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
  {storeSummary.map((s, i) => (
    <tr
      key={s.store_id}
      className="border-b border-[rgba(74,124,158,0.06)] hover:bg-slate-50 cursor-pointer transition-colors"
      onClick={() => navigate("/daily-reports")}
    >
      {/* Store */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-[#4a7c9e]/15 border border-[#4a7c9e]/20 flex items-center justify-center flex-shrink-0">
            <Store size={14} className="text-[#4a7c9e]" />
          </div>

          <span className="text-base font-semibold text-[#0F172A]">
            {s.store_name}
          </span>
        </div>
      </td>

      {/* Sales */}
      <td className="px-5 py-4 text-base font-bold text-[#0F172A]">
        ₹{(s.total_sales || 0).toLocaleString("en-IN")}
      </td>

      {/* Bills */}
      <td className="px-5 py-4 text-base font-semibold text-[#334155]">
        {s.total_bills || 0}
      </td>
    </tr>
  ))}
</tbody>
          

          {/* Footer */}
          <tfoot>
            <tr>
              <td
                colSpan="3"
                className="px-6 py-3 text-base font-semibold text-[#475569] border-t border-[rgba(74,124,158,0.08)]"
              >
                {Math.max(0, totalStores - storeSummary.length)} stores pending today's submission
              </td>
            </tr>
          </tfoot>

        </table>
      </div>
    </Card>
  );
}
// ── Custom tooltip ────────────────────────────────────────────────────────────

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-[rgba(74,124,158,0.25)] bg-[#1e2638] px-3 py-2 text-xs shadow-xl">
      <p className="text-[#6b82a0] mb-0.5">{label}</p>
      <p className="font-semibold text-white">{formatINR(payload[0].value)}</p>
    </div>
  );
}

// ── Main App ─────────────────────────────────────────────────────────────────
function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}


export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [salesData, setSalesData] = useState([]);
const [loading, setLoading] = useState(true);
const [comparisonData, setComparisonData] = useState([]);
  const [totalStores, setTotalStores] = useState(0);
  const [exportOpen, setExportOpen] = useState(false);
  const { user } = useAuth();
  console.log("Logged in user:", user);
  const [dashboardSummary, setDashboardSummary] = useState({
  total_sales: 0,
  total_purchases: 0,
  total_bills: 0,
  total_expenses: 0,
  submitted_reports: 0,
});
const [storeSummary, setStoreSummary] = useState([]);
console.log("STORE SUMMARY STATE:", storeSummary);
useEffect(() => {
  const loadDashboard = async () => {
    try {
      setLoading(true);

      const data = await dashboardService.getDashboardData();

      setDashboardSummary(data.summary);
      setTotalStores(data.totalStores);
      setStoreSummary(data.storeSummary);
      setSalesData(data.salesData);
      setComparisonData(data.comparisonData);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  loadDashboard();
}, []);
  
if (loading) {
  return (
    <div className="flex items-center justify-center h-full text-lg font-medium text-slate-600">
      Loading dashboard...
    </div>
  );
}
console.log("Sales Data:", salesData);
console.log("Comparison Data:", comparisonData);
 return (
  <main
    className="flex-1 px-6 lg:px-8 py-8 space-y-10 overflow-x-hidden bg-[#F8FAFC]"
    style={{
      backgroundImage: `
        linear-gradient(rgba(74,124,158,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(74,124,158,0.03) 1px, transparent 1px)
      `,
      backgroundSize: "48px 48px",
    }}
  >

        

          {/* ── Hero welcome ─── */}
          <Card className="px-8 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
  <div className="flex-1">
    {/* System Title */}
    <p className="text-2xl font-black tracking-[0.12em] text-[#1E40AF] uppercase">
      PharmaCore360
    </p>

    {/* Greeting */}
    <h1 className="text-2xl font-bold text-[#0F172A] mt-2 leading-tight">
  {getGreeting()}, {user?.full_name || "User"}
</h1>

    {/* Subtitle */}
    <p className="text-base text-[#64748B] mt-2">
      Here&apos;s today&apos;s operational overview across all stores.
    </p>
  </div>

  {/* Status Badge */}
  <div className="flex items-center gap-3 flex-shrink-0">
    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200">
      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      <span className="text-sm font-semibold text-emerald-700">
        5 Stores Active
      </span>
    </div>
  </div>
</Card>

          {/* ── KPI cards ─── */}
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 shadow-sm hover:shadow-lg
hover:-translate-y-1">
  

  <KpiCard
    label="Total Sales Today"
    value={`₹${(dashboardSummary.total_sales || 0).toLocaleString("en-IN")}`}
    sub={`${totalStores - dashboardSummary.submitted_reports} stores remaining`}
    color="border-blue-500"
    bgColor="bg-blue-100"
    iconColor="text-blue-600"
    Icon={IndianRupee}
  />

  <KpiCard
    label="Total Purchases Today"
    value={`₹${(dashboardSummary.total_purchases || 0).toLocaleString("en-IN")}`}
    sub="Across all submitted reports"
    color="border-orange-500"
    bgColor="bg-orange-100"
    iconColor="text-orange-600"
    Icon={ShoppingCart}
  />

  <KpiCard
    label="Total Bills"
    value={dashboardSummary.total_bills || 0}
    sub="Bills processed"
    color="border-violet-500"
    bgColor="bg-violet-100"
    iconColor="text-violet-600"
    Icon={Receipt}
  />

  <KpiCard
    label="Daily Expenses"
    value={`₹${(dashboardSummary.total_expenses || 0).toLocaleString("en-IN")}`}
    sub="Across all locked reports"
    color="border-emerald-500"
    bgColor="bg-emerald-100"
    iconColor="text-emerald-600"
    Icon={Wallet}
  />

</div>



           {/* ── store wise comparison─── */}
<div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

  {/* Pie Chart */}
  <Card className="overflow-hidden">
    <div className="px-7 py-5 border-b border-[rgba(74,124,158,0.12)] flex items-center justify-between">
      <h2 className="text-2xl font-bold text-[#0F172A] uppercase tracking-wide">
        Sales Distribution
      </h2>
    </div>

    <div className="p-6 flex items-center justify-center">
      <ResponsiveContainer width="100%" height={290}>
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
            {salesData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
  [
    "#FACC15", // Yellow
    "#F97316", // Orange
    "#EC4899", // Pink
    "#22C55E", // Green
    "#3B82F6", // Blue
  ][index % 5]
}
              />
            ))}
          </Pie>

          <Tooltip
            formatter={(value) => [`₹${value}`, "Sales"]}
            contentStyle={{
              backgroundColor: "#111827",
              border: "none",
              borderRadius: "12px",
              color: "#fff",
              padding: "8px 12px",
            }}
          />

          <Legend
  verticalAlign="bottom"
  align="center"
  iconType="circle"
  wrapperStyle={{
    paddingTop: "20px",
  }}
  formatter={(value) => (
    <span className="text-[#0F172A] font-medium">
      {value}
    </span>
  )}
/>
        </PieChart>
      </ResponsiveContainer>
    </div>
  </Card>

  {/* Sales vs Purchases Bar Chart */}
  <Card className="overflow-hidden">
  <div className="px-7 py-5 border-b border-[rgba(74,124,158,0.12)] flex items-center justify-between">
    <h2 className="text-2xl font-bold text-[#0F172A] uppercase tracking-wide">
      Sales vs Purchases
    </h2>
  </div>

  <div className="p-6 flex items-center justify-center">
    <ResponsiveContainer width="100%" height={290}>
      <BarChart
        data={comparisonData}
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
          tick={{ fontSize: 12 }}
        />

        <YAxis
          stroke="#64748B"
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => `${value / 1000}k`}
        />

        {/* Fixed Tooltip */}
        <Tooltip
  formatter={(value, name) => [`₹${value}`, name]}
  contentStyle={{
    backgroundColor: "#111827",
    border: "none",
    borderRadius: "12px",
    color: "#fff",
    padding: "8px 12px",
  }}
/>

        {/* Fixed Legend */}
        <Legend
  verticalAlign="bottom"
  align="center"
  wrapperStyle={{
    paddingTop: "20px",
  }}
  formatter={(value) => (
    <span className="text-[#0F172A] font-medium">
      {value}
    </span>
  )}
/>

        {/* Sales first */}
        <Bar
          dataKey="sales"
          name="Sales"
          fill="#2563eb"
          radius={[8, 8, 0, 0]}
        />

        {/* Purchases second */}
        <Bar
          dataKey="purchases"
          name="Purchases"
          fill="#8b5cf6"
          radius={[8, 8, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
</Card>

</div>

          {/* ── Store performance ─── */}
          <StoreTable
  storeSummary={storeSummary}
  totalStores={totalStores}
/>

       

          
         

          {/* Bottom spacing */}
          <div className="h-4" />
        </main>
      
  );
}
