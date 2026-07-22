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
import dailyReportsService from "../../services/dailyReportsService";
import { useParams } from "react-router-dom";
import ExportReportsModal from "../../components/reports/ExportReportsModal";

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
  const [showExportModal, setShowExportModal] = useState(false);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  const fetchReports = async () => {
    try {

    setLoading(true);
    setError(null);

    let data;

    if (storeId) {
        data = await dailyReportsService.getStoreReports(storeId);
    } else {
        data = await dailyReportsService.getAllReports();
    }

    setReports(data);

}
catch (err) {

    console.error(err);

    setError("Failed to load reports.");

}
finally {

    setLoading(false);

}
  };

  fetchReports();
}, [storeId]);

  console.log("RAW REPORTS", reports);

const formattedReports = dailyReportsService.formatReports(reports);

console.log("FORMATTED REPORTS", formattedReports);

  const filtered = formattedReports.filter((r) => {
    const matchSearch =
      searchQuery === "" ||
      r.store.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStore =
  storeFilter === "All Stores" ||
  r.store_id === Number(storeFilter);
    const matchStatus = statusFilter === "All Status" || r.status === statusFilter;
    return matchSearch && matchStore && matchStatus;
  });

  if (loading) {
    return (
        <div className="flex h-full items-center justify-center">
            Loading reports...
        </div>
    );
}

if (error) {
    return (
        <div className="flex h-full items-center justify-center">
            <div className="text-center">

                <p className="text-red-600 font-medium">
                    {error}
                </p>

                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 rounded bg-blue-600 px-4 py-2 text-white"
                >
                    Retry
                </button>

            </div>
        </div>
    );
}

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
            <button
  onClick={() => setShowExportModal(true)}
  className="flex items-center gap-2 bg-[#1D4ED8] hover:bg-[#1e3a6e] text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
>
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

          
          {/* Table / Empty State */}

{filtered.length === 0 ? (
  <div className="bg-white rounded-2xl border border-gray-200 py-20 flex flex-col items-center justify-center">
    <FileText className="w-12 h-12 text-gray-300 mb-4" />

    <h3 className="text-lg font-semibold text-gray-700">
      No reports found
    </h3>

    <p className="text-sm text-gray-500 mt-2 text-center">
      Try changing your filters or wait for stores to submit their daily reports.
    </p>
  </div>
) : (
  <ReportTable
    filteredReports={filtered}
  />
)}

          

     
      <ExportReportsModal
  open={showExportModal}
  onClose={() => setShowExportModal(false)}
/>
</main>
</div>
</div>
);
}