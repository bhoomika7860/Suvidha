import { useState } from "react";
import {
  LayoutDashboard,
  Store,
  FileText,
  Users,
  Target,
  Package,
  BarChart2,
  SlidersHorizontal,
  ClipboardList,
  Settings,
  LogOut,
  Search,
  Download,
  Bell,
  ChevronDown,
  Calendar,
  Eye,
  Lock,
  Clock,
  AlertTriangle,
  CheckCircle2,
  X,
  IndianRupee,
  ShoppingCart,
  Receipt,
  Wallet,
  CreditCard,
  Smartphone,
  Banknote,
  UserCircle,
  Info,
  RotateCcw,
} from "lucide-react";

import ReportFilters from "../../components/reports/ReportFilters";
import ReportTable from "../../components/reports/ReportTable";

import { useEffect } from "react";
import { dailyReportsService } from "../../services/dailyReportsService";
import { useParams } from "react-router-dom";


// ── Nav Items ────────────────────────────────────────────────────────────────

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Stores", icon: Store },
  { label: "Daily Reports", icon: FileText, active: true },
  { label: "Staff", icon: Users },
  { label: "Targets", icon: Target },
  { label: "Inventory", icon: Package },
  { label: "Analytics", icon: BarChart2 },
  { label: "Adjustments", icon: SlidersHorizontal },
  { label: "Audit Logs", icon: ClipboardList },
  { label: "Settings", icon: Settings },
];

// ── Sidebar ──────────────────────────────────────────────────────────────────


// ── Top Bar ──────────────────────────────────────────────────────────────────

function TopBar({ searchQuery, onSearchChange }) {
  return (
    <header className="h-[62px] shrink-0 bg-white border-b border-gray-200 flex items-center px-6 gap-4">
      {/* Search */}
      <div className="flex-1 max-w-md relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search stores, reports..."
          className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 placeholder:text-gray-400"
        />
      </div>

      <div className="flex items-center gap-3 ml-auto">
        <button className="flex items-center gap-2 bg-[#1e3a6e] hover:bg-[#1D4ED8] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          <Download size={14} />
          Export Reports
          <ChevronDown size={13} />
        </button>
        <button className="relative w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <button className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50">
          <div className="w-7 h-7 rounded-full bg-[#1D4ED8] flex items-center justify-center text-white text-xs font-bold">
            RA
          </div>
          <span className="text-sm font-medium text-gray-700">Rajesh</span>
          <ChevronDown size={13} className="text-gray-400" />
        </button>
      </div>
    </header>
  );
}




// ── Main App ──────────────────────────────────────────────────────────────────

export default function App() {
  const { storeId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [storeFilter, setStoreFilter] = useState("All Stores");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const [reports, setReports] = useState([]);

useEffect(() => {
  const fetchReports = async () => {
    try {
      let data;

      if (storeId) {
        // when coming from dashboard store click
        data = await dailyReportsService.getStoreReports(storeId);
      } else {
        // when opening from sidebar
        data = await dailyReportsService.getAllReports();
      }

      console.log("ALL REPORTS:", data);
      console.log(data);
      setReports(data);

    } catch (error) {
      console.error("Failed to fetch reports:", error);
    }
  };

  fetchReports();
}, [storeId]);

  console.log("RAW REPORTS", reports);

const formattedReports = reports.map((r) => ({
  id: r.id,

  store: r.store_name,

  payment: {
    cash: r.cash_sales,
    upi: r.upi_sales,
    card: r.card_sales,
    udhaar: r.udhaar_sales,
  },

  deliveries: r.deliveries ?? 0,

  totalSales:
    (r.cash_sales ?? 0) +
    (r.upi_sales ?? 0) +
    (r.card_sales ?? 0) +
    (r.udhaar_sales ?? 0),

  purchases: r.total_purchases ?? 0,

  expenses: r.total_expenses ?? 0,

  bills: r.total_bills ?? 0,

  bouncedProducts: r.bounced_products ?? [],

  status: r.is_locked ? "Locked" : "Open",
}));

console.log("FORMATTED REPORTS", formattedReports);

  const filtered = formattedReports.filter((r) => {
    const matchSearch =
      searchQuery === "" ||
      r.store.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStore = storeFilter === "All Stores" || r.store === storeFilter;
    const matchStatus = statusFilter === "All Status" || r.status === statusFilter;
    return matchSearch && matchStore && matchStatus;
  });

  return (
    <div
      className="flex h-screen w-full overflow-hidden bg-[#f1f5f9]"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        <main className="flex-1 overflow-y-auto px-6 py-6">
          {/* Page Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Daily Reports</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Track and review store-wise daily reports
              </p>
            </div>
            <button className="flex items-center gap-2 bg-[#1D4ED8] hover:bg-[#1e3a6e] text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors">
              <Download size={14} />
              Export Reports
            </button>
          </div>

          {/* Filter Row */}
          <ReportFilters
  searchQuery={searchQuery}
  setSearchQuery={setSearchQuery}
  storeFilter={storeFilter}
  setStoreFilter={setStoreFilter}
  statusFilter={statusFilter}
  setStatusFilter={setStatusFilter}
  reports={reports}
/>

          
          {/* Table */}
          <ReportTable
  filteredReports={filtered}
/>

          

      {/* Drawer */}
      
</main>
</div>
</div>
);
}