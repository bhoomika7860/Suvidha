import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  Banknote,
  ClipboardList,
  CreditCard,
  Download,
  Package,
  Receipt,
  ScrollText,
  Share2,
  ShoppingCart,
  Smartphone,
  Truck,
  Users,
  Wallet,
  Zap,
} from "lucide-react";

import { dailyReportsService } from "../../services/dailyReportsService";

import Card from "../../components/reportDetails/shared/Card";
import StatusBadge from "../../components/reportDetails/shared/StatusBadge";
import SectionHeader from "../../components/reportDetails/shared/SectionHeader";
import IconAction from "../../components/reportDetails/shared/IconAction";
import KPICard from "../../components/reportDetails/shared/KPICard";
import PaymentBreakdown from "../../components/reportDetails/PaymentBreakdown";
import OperationalSummary from "../../components/reportDetails/OperationalSummary";
import ExpenseBreakdown from "../../components/reportDetails/ExpenseBreakdown";
import BouncedProducts from "../../components/reportDetails/BouncedProducts";
import StoreNotes from "../../components/reportDetails/StoreNotes";
import AdjustmentHistory from "../../components/reportDetails/AdjustmentHistory";

function fmt(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function Dot() {
  return <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: "#E5E7EB" }} />;
}

export default function DailyReportView() {
  const navigate = useNavigate();
  const { id } = useParams();

console.log("URL PARAM ID:", id);

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        console.log("Fetching report:", id);

console.log("Requesting report:", id);

const data = await dailyReportsService.getReport(id);

console.log("Backend returned:", data);
console.log("Response:", data);
        console.log("FULL REPORT", data);
console.log("EXPENSES", data.expenses);
console.log("BOUNCED", data.bounced_products);
console.log("ADJUSTMENTS", data.adjustments);
        setReport(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  if (loading) return <div className="p-10">Loading...</div>;
  if (!report) return <div className="p-10">Report not found</div>;

  const paymentRows = [
    { name: "Cash", value: report.payments?.cash ?? 0, color: "#16A34A", icon: Banknote },
    { name: "UPI", value: report.payments?.upi ?? 0, color: "#7C3AED", icon: Smartphone },
    { name: "Card", value: report.payments?.card ?? 0, color: "#0891B2", icon: CreditCard },
    { name: "Credit (Udhaar)", value: report.payments?.udhaar ?? 0, color: "#D97706", icon: Users },
  ];

  const summaryItems = [
    {
      label: "Deliveries",
      value: `${report.summary?.deliveries ?? 0}`,
      sub: "Completed today",
      icon: Truck,
      iconBg: "#EFF6FF",
      iconColor: "#2563EB",
    },
    {
  label: "Bounced",
  value: `${report.bounced_products?.length || 0} items`,
  sub:
    report.bounced_products?.length > 0
      ? "Needs attention"
      : "No current flags",
      icon: AlertTriangle,
      iconBg: "#FEF2F2",
      iconColor: "#DC2626",
    },
    {
      label: "Purchase Orders",
     value: "1",
      sub: fmt(report.summary?.purchases ?? 0),
      icon: ClipboardList,
      iconBg: "#F0FDF4",
      iconColor: "#16A34A",
    },
    {
      label: "Expense Items",
      value: `${report.expenses?.length || 0}`,
      sub: fmt(report.summary?.expenses ?? 0),
      icon: Package,
      iconBg: "#FFFBEB",
      iconColor: "#D97706",
    },
  ];

  

  return (
    <div className="min-h-screen" style={{ background: "#F8FAFC", fontFamily: "'Inter', sans-serif" }}>
      <div className="max-w-[1280px] mx-auto px-7 py-7">
        <button
          onClick={() => navigate("/daily-reports")}
          className="inline-flex items-center gap-1.5 text-[13px] font-medium mb-5 transition-colors"
          style={{ color: "#6B7280" }}
          onMouseEnter={(event) => (event.currentTarget.style.color = "#2563EB")}
          onMouseLeave={(event) => (event.currentTarget.style.color = "#6B7280")}
        >
          <ArrowLeft size={14} />
          Back to Daily Reports
        </button>

        <Card className="px-7 py-5 mb-5">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h1 className="text-[26px] font-bold tracking-tight leading-none" style={{ color: "#111827" }}>
                {report.store?.name}
              </h1>
              <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                <span className="text-[13px] font-medium" style={{ color: "#6B7280" }}>{report.report_date}</span>
                <Dot />
                <span className="text-[13px]" style={{ color: "#6B7280" }}>
                  Submitted by <span className="font-semibold" style={{ color: "#111827" }}>{report.submitted_by?.name}</span>
                </span>
                <Dot />
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md font-mono" style={{ background: "#F1F5F9", color: "#6B7280", border: "1px solid #E5E7EB" }}>
                  {report.store?.code}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <IconAction icon={<Download size={14} />} label="Export Report" />
                <IconAction icon={<ScrollText size={14} />} label="Audit Logs" />
                <IconAction icon={<Share2 size={14} />} label="Share" />
              </div>
              <div className="w-px h-7" style={{ background: "#E5E7EB" }} />
              <StatusBadge status={report.status} />
            </div>
          </div>
        </Card>

        <div className="mb-5">
          <SectionHeader title="Executive Summary" sub="Daily performance snapshot" />
          <div className="flex gap-4">
            <KPICard icon={<Wallet size={14} />} label="Total Sales" value={fmt(report.summary?.sales ?? 0)} trend="Today's total sales" dir="up" />
            <KPICard icon={<Receipt size={14} />} label="Bills Generated" value={report.summary?.bills ?? 0} trend="Bills generated" dir="up" />
            <KPICard icon={<Truck size={14} />} label="Deliveries" value={report.summary?.deliveries ?? 0} trend="Completed deliveries" dir="up" />
            <KPICard icon={<ShoppingCart size={14} />} label="Purchases" value={fmt(report.summary?.purchases ?? 0)} trend="Today's purchases" dir="down" />
            <KPICard icon={<CreditCard size={14} />} label="Expenses" value={fmt(report.summary?.expenses ?? 0)} trend="Operating expenses" dir="up" />
          </div>
        </div>


        <div className="grid grid-cols-12 gap-5 mb-5">

  <div className="col-span-8">
    <PaymentBreakdown payments={paymentRows} />
  </div>

  <div className="col-span-4">
    <OperationalSummary items={summaryItems} />
  </div>

</div>

<div className="grid grid-cols-12 gap-5 mb-5">

  <div className="col-span-6">
    <ExpenseBreakdown expenses={report.expenses || []} />
  </div>

  <div className="col-span-6">
    <BouncedProducts rows={report.bounced_products || []} />
  </div>

</div>

<div className="grid grid-cols-12 gap-5">

  <div className="col-span-8">
    <StoreNotes note={report.notes?.trim() || "No notes submitted."} />
  </div>

  <div className="col-span-4">
    <AdjustmentHistory adjustments={report.adjustments || []} />
  </div>

</div>
      </div>
    </div>
  );
}