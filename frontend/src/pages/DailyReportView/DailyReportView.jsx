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
  RotateCcw,
  ScrollText,
 
  ShoppingCart,
  Smartphone,
  Truck,
  Users,
  Wallet,
  Zap,
} from "lucide-react";

import dailyReportsService from "../../services/dailyReportsService";

import Card from "../../components/reportDetails/shared/Card";
import StatusBadge from "../../components/reportDetails/shared/StatusBadge";
import SectionHeader from "../../components/reportDetails/shared/SectionHeader";
import IconAction from "../../components/reportDetails/shared/IconAction";
import KPICard from "../../components/reportDetails/shared/KPICard";
import PaymentBreakdown from "../../components/reportDetails/PaymentBreakdown";
import ExpenseBreakdown from "../../components/reportDetails/ExpenseBreakdown";
import CompletedPurchases from "../../components/reportDetails/CompletedPurchases";
import DeliverySummary from "../../components/reportDetails/DeliverySummary";



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
const [error, setError] = useState(null);

 const loadReport = async () => {
  try {
    setLoading(true);
    setError(null);

    const data = await dailyReportsService.getReport(id);

    setReport(data);
  } catch (err) {
    console.error(err);
    setError("Failed to load report.");
  } finally {
    setLoading(false);
  }
};



useEffect(() => {
  loadReport();
}, [id]);

  if (loading) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC]">
      <div className="text-center">
        <p className="text-lg font-medium text-gray-700">
          Loading report...
        </p>
      </div>
    </div>
  );
}

if (error) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC]">
      <div className="text-center">

        <h2 className="text-xl font-semibold text-red-600">
          {error}
        </h2>

        <button
          onClick={loadReport}
          className="mt-5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 py-2 rounded-lg"
        >
          Try Again
        </button>

      </div>
    </div>
  );
}

  if (!report) return <div className="p-10">Report not found</div>;

  const paymentRows = [
    { name: "Cash", value: report.payments?.cash ?? 0, color: "#16A34A", icon: Banknote },
    { name: "UPI", value: report.payments?.upi ?? 0, color: "#7C3AED", icon: Smartphone },
    { name: "Card", value: report.payments?.card ?? 0, color: "#0891B2", icon: CreditCard },
    { name: "Credit (Udhaar)", value: report.payments?.udhaar ?? 0, color: "#D97706", icon: Users },
  ];

   
return (
  <div
    className="min-h-screen"
    style={{
      background: "#F8FAFC",
      fontFamily: "'Inter', sans-serif",
    }}
  >
    <div className="max-w-[1280px] mx-auto px-7 py-7">

      <button
        onClick={() => navigate("/daily-reports")}
        className="inline-flex items-center gap-1.5 text-[13px] font-medium mb-5 transition-colors"
        style={{ color: "#6B7280" }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.color = "#2563EB")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.color = "#6B7280")
        }
      >
        <ArrowLeft size={14} />
        Back to Daily Reports
      </button>

      <Card className="px-7 py-5 mb-5">

        <div className="flex items-center justify-between">

          <div>

            <h1 className="text-[26px] font-bold">
              {report.store?.name}
            </h1>

            <div className="flex items-center gap-3 mt-2 flex-wrap">

              <span className="text-[13px] text-gray-500">
                {report.report_date}
              </span>

              <Dot />

              <span className="text-[13px] text-gray-500">
                Submitted by{" "}
                <span className="font-semibold text-black">
                  {report.submitted_by?.name}
                </span>
              </span>

              <Dot />

              <span className="text-[11px] font-semibold px-2 py-1 rounded-md border bg-gray-100">
                {report.store?.code}
              </span>

            </div>

          </div>

          <div className="flex items-center gap-3">

            <IconAction
              icon={<RotateCcw size={14} />}
              label="Refresh Report"
              onClick={loadReport}
            />

            <StatusBadge
              status={report.status}
            />

          </div>

        </div>

      </Card>

      {/* KPI */}

      <div className="mb-6">

        <SectionHeader
          title="Executive Summary"
          sub="Daily performance snapshot"
        />

        <div className="flex gap-4">

          <KPICard
            icon={<Wallet size={14} />}
            label="Total Sales"
            value={fmt(report.summary?.sales)}
            trend="Today's total sales"
            dir="up"
          />

          <KPICard
            icon={<Receipt size={14} />}
            label="Bills Generated"
            value={report.summary?.bills}
            trend="Bills generated"
            dir="up"
          />

          <KPICard
            icon={<Truck size={14} />}
            label="Deliveries"
            value={report.summary?.deliveries}
            trend="Completed deliveries"
            dir="up"
          />

          <KPICard
            icon={<ShoppingCart size={14} />}
            label="Purchases"
            value={fmt(report.summary?.purchases)}
            trend="Today's purchases"
            dir="up"
          />

          <KPICard
            icon={<CreditCard size={14} />}
            label="Expenses"
            value={fmt(report.summary?.expenses)}
            trend="Operating expenses"
            dir="up"
          />

        </div>

      </div>

      {/* PAYMENT */}

      <div className="mb-6">

        <PaymentBreakdown
          payments={paymentRows}
        />

      </div>

      {/* EXPENSES */}

      <div className="mb-6">

        <ExpenseBreakdown
          expenses={report.expenses || []}
        />

      </div>

      {/* PURCHASES */}

      <div className="mb-6">

        <CompletedPurchases
          purchases={
            report.completed_purchases || []
          }
        />

      </div>

      {/* DELIVERIES */}

      <div className="mb-6">

        <DeliverySummary
          deliveries={
            report.delivery_assignments || []
          }
        />

      </div>

      

    </div>

  </div>
);
}