import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Banknote,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CreditCard,
  FileText,
  Package,
  RefreshCw,
  RotateCcw,
  ShoppingCart,
  Smartphone,
  Truck,
  Users,
  Wallet,
  X,
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
  return (
    <span
      className="h-1 w-1 shrink-0 rounded-full"
      style={{ background: "#E5E7EB" }}
    />
  );
}


/* =========================================================
   MOBILE SECTION
========================================================= */

function MobileSectionHeader({
  number,
  icon: Icon,
  title,
}) {
  return (
    <div className="flex items-center gap-3">

      <span className="w-3.5 shrink-0 text-[11px] font-medium text-blue-600">
        {number}
      </span>

      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <Icon size={15} />
      </div>

      <h2 className="text-[16px] font-bold leading-none tracking-tight text-[#0F172A]">
        {title}
      </h2>

    </div>
  );
}


/* =========================================================
   MOBILE VALUE CARD
========================================================= */

function MobileValueCard({
  label,
  value,
  highlight = false,
}) {
  return (
    <div
      className={`flex min-h-[64px] items-center justify-between rounded-xl border px-3.5 py-3 ${
        highlight
          ? "border-blue-200 bg-blue-50"
          : "border-gray-200 bg-[#F8FAFC]"
      }`}
    >
      <p
        className={`min-w-0 pr-3 text-[11px] font-medium leading-tight ${
          highlight
            ? "text-blue-600"
            : "text-gray-500"
        }`}
      >
        {label}
      </p>

      <p
        className={`shrink-0 text-[17px] font-semibold leading-none tracking-tight ${
          highlight
            ? "text-blue-600"
            : "text-[#0F172A]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}


/* =========================================================
   MOBILE REPORT VIEW
========================================================= */

function MobileDailyReport({
  report,
  loadReport,
  navigate,
}) {
  // All report sections start collapsed so the user gets a clean
  // overview first and opens only the information they need.
  const [expanded, setExpanded] = useState({
    sales: false,
    cash: false,
    payments: false,
    expenses: false,
    purchases: false,
    deliveries: false,
  });

  const toggleSection = (section) => {
    setExpanded((previous) => ({
      ...previous,
      [section]: !previous[section],
    }));
  };

  const payments = report.payments || {};

  const totalSales = Number(report.summary?.sales || 0);
  const totalBills = Number(report.summary?.bills || 0);
  const totalDeliveries = Number(
    report.summary?.deliveries || 0
  );
  const totalPurchases = Number(
    report.summary?.purchases || 0
  );
  const totalExpenses = Number(
    report.summary?.expenses || 0
  );

  const cashSales = Number(payments.cash || 0);
  const upiSales = Number(payments.upi || 0);
  const cardSales = Number(payments.card || 0);
  const udhaarSales = Number(payments.udhaar || 0);

  const paymentTotal =
    cashSales +
    upiSales +
    cardSales +
    udhaarSales;

  const completedPurchases = Array.isArray(
    report.completed_purchases
  )
    ? report.completed_purchases
    : [];

  const deliveryAssignments = Array.isArray(
    report.delivery_assignments
  )
    ? report.delivery_assignments
    : [];

  const sectionClass =
    "overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm";

  const sectionButtonClass =
    "flex w-full items-center gap-3 px-4 py-4 text-left transition active:bg-gray-50";

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#F8FAFC] pb-20">
      {/* =====================================================
          MOBILE HEADER
      ===================================================== */}

      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between px-5 pb-4 pt-5">
          <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-2.5">
              <h1 className="truncate text-3xl font-bold leading-tight tracking-tight text-[#0F172A]">
                Daily Report
              </h1>

              <StatusBadge status={report.status} />
            </div>

            <div className="mt-1.5 flex items-center gap-2">
              <FileText
                size={13}
                className="shrink-0 text-gray-400"
              />

              <span className="text-[11px] font-medium text-gray-500">
                {report.report_date}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={loadReport}
              className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 active:bg-gray-100"
              aria-label="Refresh report"
            >
              <RefreshCw size={17} />
            </button>

            <button
              type="button"
              onClick={() => navigate("/daily-reports")}
              className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 active:bg-gray-100"
              aria-label="Close report"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* =====================================================
          REPORT CONTEXT
      ===================================================== */}

      <div className="px-4 pt-4">
        <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3.5 shadow-sm">
          <div className="flex min-w-0 items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-[16px] font-bold tracking-tight text-[#0F172A]">
                {report.store?.name || "Store"}
              </p>

              <div className="mt-1 flex min-w-0 items-center gap-2">
                <span className="shrink-0 text-[11px] text-gray-500">
                  {report.store?.code || "-"}
                </span>

                <Dot />

                <span className="truncate text-[11px] text-gray-500">
                  Submitted by{" "}
                  <span className="font-semibold text-gray-700">
                    {report.submitted_by?.name || "-"}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          REPORT OVERVIEW
      ===================================================== */}

      <main className="space-y-3 px-4 pt-5">
        <div className="mb-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-blue-600">
            Report Details
          </p>
          <p className="mt-1 text-[12px] text-gray-500">
            Tap a section to view its details.
          </p>
        </div>

        {/* ===================================================
            01 SALES
        =================================================== */}

        <section className={sectionClass}>
          <button
            type="button"
            onClick={() => toggleSection("sales")}
            className={sectionButtonClass}
            aria-expanded={expanded.sales}
          >
            <span className="w-5 shrink-0 text-[10px] font-semibold text-blue-600">
              01
            </span>

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Wallet size={16} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-bold text-[#0F172A]">
                Sales
              </p>
              <p className="mt-0.5 text-[11px] text-gray-500">
                {totalBills} bills generated
              </p>
            </div>

            <div className="mr-1 shrink-0 text-right">
              <p className="text-[13px] font-bold text-[#0F172A]">
                {fmt(totalSales)}
              </p>
              <p className="mt-0.5 text-[9px] font-medium uppercase tracking-wide text-gray-400">
                Total
              </p>
            </div>

            {expanded.sales ? (
              <ChevronUp
                size={18}
                className="shrink-0 text-gray-400"
              />
            ) : (
              <ChevronDown
                size={18}
                className="shrink-0 text-gray-400"
              />
            )}
          </button>

          {expanded.sales && (
            <div className="border-t border-gray-100 px-3.5 pb-3.5 pt-3">
              <div className="space-y-2">
                <MobileValueCard
                  label="Total Bills"
                  value={totalBills}
                />

                <MobileValueCard
                  label="Cash Sales"
                  value={fmt(cashSales)}
                />

                <MobileValueCard
                  label="UPI Sales"
                  value={fmt(upiSales)}
                />

                <MobileValueCard
                  label="Card Sales"
                  value={fmt(cardSales)}
                />

                <MobileValueCard
                  label="Udhaar Included in Cash Sales"
                  value={fmt(udhaarSales)}
                />

                <MobileValueCard
                  label="Total Sales"
                  value={fmt(totalSales)}
                  highlight
                />
              </div>
            </div>
          )}
        </section>

        {/* ===================================================
            02 CASH VERIFICATION
        =================================================== */}

        <section className={sectionClass}>
          <button
            type="button"
            onClick={() => toggleSection("cash")}
            className={sectionButtonClass}
            aria-expanded={expanded.cash}
          >
            <span className="w-5 shrink-0 text-[10px] font-semibold text-blue-600">
              02
            </span>

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Banknote size={16} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-bold text-[#0F172A]">
                Cash Verification
              </p>
              <p className="mt-0.5 text-[11px] text-gray-500">
                Cash and udhaar reconciliation
              </p>
            </div>

            <div className="mr-1 shrink-0 text-right">
              <p className="text-[13px] font-bold text-[#0F172A]">
                {fmt(cashSales + udhaarSales)}
              </p>
              <p className="mt-0.5 text-[9px] font-medium uppercase tracking-wide text-gray-400">
                Verified
              </p>
            </div>

            {expanded.cash ? (
              <ChevronUp size={18} className="shrink-0 text-gray-400" />
            ) : (
              <ChevronDown size={18} className="shrink-0 text-gray-400" />
            )}
          </button>

          {expanded.cash && (
            <div className="border-t border-gray-100 px-3.5 pb-3.5 pt-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-[#F8FAFC] px-3.5 py-3.5">
                  <span className="text-[11px] font-medium text-gray-500">
                    Cash Collected
                  </span>
                  <span className="text-[17px] font-bold text-[#0F172A]">
                    {fmt(cashSales)}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-[#F8FAFC] px-3.5 py-3.5">
                  <span className="text-[11px] font-medium text-gray-500">
                    Udhaar
                  </span>
                  <span className="text-[17px] font-bold text-[#0F172A]">
                    {fmt(udhaarSales)}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-3.5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      size={16}
                      className="text-emerald-600"
                    />
                    <span className="text-[11px] font-semibold text-emerald-700">
                      Cash + Udhaar
                    </span>
                  </div>

                  <span className="text-[17px] font-bold text-emerald-700">
                    {fmt(cashSales + udhaarSales)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ===================================================
            03 PAYMENT BREAKDOWN
        =================================================== */}

        <section className={sectionClass}>
          <button
            type="button"
            onClick={() => toggleSection("payments")}
            className={sectionButtonClass}
            aria-expanded={expanded.payments}
          >
            <span className="w-5 shrink-0 text-[10px] font-semibold text-blue-600">
              03
            </span>

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <CreditCard size={16} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-bold text-[#0F172A]">
                Payment Breakdown
              </p>
              <p className="mt-0.5 text-[11px] text-gray-500">
                Collection by payment method
              </p>
            </div>

            <div className="mr-1 shrink-0 text-right">
              <p className="text-[13px] font-bold text-[#0F172A]">
                {fmt(paymentTotal)}
              </p>
              <p className="mt-0.5 text-[9px] font-medium uppercase tracking-wide text-gray-400">
                Total
              </p>
            </div>

            {expanded.payments ? (
              <ChevronUp size={18} className="shrink-0 text-gray-400" />
            ) : (
              <ChevronDown size={18} className="shrink-0 text-gray-400" />
            )}
          </button>

          {expanded.payments && (
            <div className="border-t border-gray-100 px-3.5 pb-3.5 pt-3">
              <div className="space-y-2">
                {[
                  {
                    label: "Cash",
                    value: cashSales,
                    icon: Banknote,
                    iconClass: "bg-green-50 text-green-600",
                  },
                  {
                    label: "UPI",
                    value: upiSales,
                    icon: Smartphone,
                    iconClass: "bg-purple-50 text-purple-600",
                  },
                  {
                    label: "Card",
                    value: cardSales,
                    icon: CreditCard,
                    iconClass: "bg-cyan-50 text-cyan-600",
                  },
                  {
                    label: "Udhaar",
                    value: udhaarSales,
                    icon: Users,
                    iconClass: "bg-orange-50 text-orange-600",
                  },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="flex items-center justify-between rounded-xl border border-gray-200 bg-[#F8FAFC] px-3 py-3"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-lg ${item.iconClass}`}
                        >
                          <Icon size={15} />
                        </div>

                        <span className="text-[12px] font-medium text-gray-700">
                          {item.label}
                        </span>
                      </div>

                      <span className="text-[15px] font-bold text-[#0F172A]">
                        {fmt(item.value)}
                      </span>
                    </div>
                  );
                })}

                <div className="flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-3">
                  <span className="text-[12px] font-semibold text-blue-600">
                    Total
                  </span>

                  <span className="text-[17px] font-bold text-blue-600">
                    {fmt(paymentTotal)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ===================================================
            04 EXPENSES
        =================================================== */}

        <section className={sectionClass}>
          <button
            type="button"
            onClick={() => toggleSection("expenses")}
            className={sectionButtonClass}
            aria-expanded={expanded.expenses}
          >
            <span className="w-5 shrink-0 text-[10px] font-semibold text-blue-600">
              04
            </span>

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
              <Wallet size={16} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-bold text-[#0F172A]">
                Expenses
              </p>
              <p className="mt-0.5 text-[11px] text-gray-500">
                Today&apos;s operational costs
              </p>
            </div>

            <div className="mr-1 shrink-0 text-right">
              <p className="text-[13px] font-bold text-[#0F172A]">
                {fmt(totalExpenses)}
              </p>
              <p className="mt-0.5 text-[9px] font-medium uppercase tracking-wide text-gray-400">
                Total
              </p>
            </div>

            {expanded.expenses ? (
              <ChevronUp size={18} className="shrink-0 text-gray-400" />
            ) : (
              <ChevronDown size={18} className="shrink-0 text-gray-400" />
            )}
          </button>

          {expanded.expenses && (
            <div className="border-t border-gray-100 px-3.5 pb-3.5 pt-3">
              {report.expenses?.length > 0 ? (
                <div className="space-y-2">
                  {report.expenses.map((expense, index) => (
                    <div
                      key={expense.id || index}
                      className="flex items-center justify-between rounded-xl border border-gray-200 bg-[#F8FAFC] px-3.5 py-3"
                    >
                      <span className="min-w-0 truncate pr-3 text-[12px] font-medium text-gray-700">
                        {expense.title ||
                          expense.expense_type ||
                          expense.category ||
                          "Other"}
                      </span>

                      <span className="shrink-0 text-[15px] font-bold text-[#0F172A]">
                        {fmt(expense.amount)}
                      </span>
                    </div>
                  ))}

                  <div className="flex items-center justify-between border-t border-gray-200 px-1 pt-3">
                    <span className="text-[12px] font-semibold text-gray-600">
                      Total Expenses
                    </span>

                    <span className="text-[17px] font-bold text-[#0F172A]">
                      {fmt(totalExpenses)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-gray-200 bg-[#F8FAFC] px-4 py-6 text-center">
                  <p className="text-[12px] font-medium text-gray-500">
                    No expenses available.
                  </p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* ===================================================
            05 PURCHASES
        =================================================== */}

        <section className={sectionClass}>
          <button
            type="button"
            onClick={() => toggleSection("purchases")}
            className={sectionButtonClass}
            aria-expanded={expanded.purchases}
          >
            <span className="w-5 shrink-0 text-[10px] font-semibold text-blue-600">
              05
            </span>

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <ShoppingCart size={16} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-bold text-[#0F172A]">
                Completed Purchases
              </p>
              <p className="mt-0.5 text-[11px] text-gray-500">
                {completedPurchases.length} purchase
                {completedPurchases.length === 1 ? "" : "s"} included
              </p>
            </div>

            <div className="mr-1 shrink-0 text-right">
              <p className="text-[13px] font-bold text-[#0F172A]">
                {fmt(totalPurchases)}
              </p>
              <p className="mt-0.5 text-[9px] font-medium uppercase tracking-wide text-gray-400">
                Total
              </p>
            </div>

            {expanded.purchases ? (
              <ChevronUp size={18} className="shrink-0 text-gray-400" />
            ) : (
              <ChevronDown size={18} className="shrink-0 text-gray-400" />
            )}
          </button>

          {expanded.purchases && (
            <div className="border-t border-gray-100 px-3.5 pb-3.5 pt-3">
              <div className="space-y-2.5">
                {completedPurchases.length > 0 ? (
                  completedPurchases.map((purchase, index) => (
                    <div
                      key={purchase.id || index}
                      className="rounded-xl border border-gray-200 bg-[#F8FAFC] p-3.5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-semibold text-[#0F172A]">
                            {purchase.supplier_name || "Supplier"}
                          </p>

                          <p className="mt-1 text-[10px] text-gray-500">
                            Bill No. {purchase.bill_number || "-"}
                          </p>
                        </div>

                        <span className="shrink-0 rounded-full bg-green-100 px-2.5 py-1 text-[10px] font-medium text-green-700">
                          Completed
                        </span>
                      </div>

                      <div className="mt-3 flex items-center justify-between border-t border-gray-200 pt-3">
                        <span className="text-[11px] font-medium text-gray-500">
                          Amount
                        </span>

                        <span className="text-[16px] font-bold text-[#0F172A]">
                          {fmt(purchase.purchase_amount)}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl border border-gray-200 bg-[#F8FAFC] px-4 py-6 text-center">
                    <p className="text-[12px] font-medium text-gray-500">
                      No completed purchases.
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between border-t border-gray-200 px-1 pt-3">
                  <span className="text-[12px] font-semibold text-gray-600">
                    Total Purchases
                  </span>

                  <span className="text-[17px] font-bold text-[#0F172A]">
                    {fmt(totalPurchases)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ===================================================
            06 DELIVERIES
        =================================================== */}

        <section className={sectionClass}>
          <button
            type="button"
            onClick={() => toggleSection("deliveries")}
            className={sectionButtonClass}
            aria-expanded={expanded.deliveries}
          >
            <span className="w-5 shrink-0 text-[10px] font-semibold text-blue-600">
              06
            </span>

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Truck size={16} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-bold text-[#0F172A]">
                Today&apos;s Deliveries
              </p>
              <p className="mt-0.5 text-[11px] text-gray-500">
                Completed delivery assignments
              </p>
            </div>

            <div className="mr-1 shrink-0 text-right">
              <p className="text-[13px] font-bold text-[#0F172A]">
                {totalDeliveries}
              </p>
              <p className="mt-0.5 text-[9px] font-medium uppercase tracking-wide text-gray-400">
                Completed
              </p>
            </div>

            {expanded.deliveries ? (
              <ChevronUp size={18} className="shrink-0 text-gray-400" />
            ) : (
              <ChevronDown size={18} className="shrink-0 text-gray-400" />
            )}
          </button>

          {expanded.deliveries && (
            <div className="border-t border-gray-100 px-3.5 pb-3.5 pt-3">
              <div className="space-y-2">
                {deliveryAssignments.length > 0 ? (
                  deliveryAssignments.map((delivery, index) => (
                    <div
                      key={delivery.id || index}
                      className="flex items-center justify-between rounded-xl border border-gray-200 bg-[#F8FAFC] px-3.5 py-3"
                    >
                      <span className="min-w-0 truncate pr-3 text-[12px] font-medium text-gray-700">
                        {delivery.delivery_boy_name ||
                          "Delivery Boy"}
                      </span>

                      <span className="shrink-0 text-[16px] font-bold text-[#0F172A]">
                        {delivery.deliveries_completed || 0}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl border border-gray-200 bg-[#F8FAFC] px-4 py-6 text-center">
                    <p className="text-[12px] font-medium text-gray-500">
                      No delivery data available.
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between border-t border-gray-200 px-1 pt-3">
                  <span className="text-[12px] font-semibold text-gray-600">
                    Total Deliveries
                  </span>

                  <span className="text-[17px] font-bold text-[#0F172A]">
                    {totalDeliveries}
                  </span>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function DailyReportView() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const loadReport = async () => {
    try {
      setLoading(true);
      setError(null);

      const data =
        await dailyReportsService.getReport(id);

      setReport(data);

    } catch (err) {
      console.error(err);

      setError(
        "Failed to load report."
      );

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadReport();
  }, [id]);


  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">

        <div className="text-center">

          <RefreshCw
            size={22}
            className="mx-auto animate-spin text-blue-600"
          />

          <p className="mt-3 text-sm font-medium text-gray-700">
            Loading report...
          </p>

        </div>

      </div>
    );
  }


  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-6">

        <div className="text-center">

          <h2 className="text-xl font-semibold text-red-600">
            {error}
          </h2>

          <button
            onClick={loadReport}
            className="mt-5 rounded-lg bg-[#2563EB] px-5 py-2 text-white hover:bg-[#1D4ED8]"
          >
            Try Again
          </button>

        </div>

      </div>
    );
  }


  if (!report) {
    return (
      <div className="p-10">
        Report not found
      </div>
    );
  }


  const paymentRows = [
    {
      name: "Cash",
      value: report.payments?.cash ?? 0,
      color: "#16A34A",
      icon: Banknote,
    },
    {
      name: "UPI",
      value: report.payments?.upi ?? 0,
      color: "#7C3AED",
      icon: Smartphone,
    },
    {
      name: "Card",
      value: report.payments?.card ?? 0,
      color: "#0891B2",
      icon: CreditCard,
    },
    {
      name: "Credit (Udhaar)",
      value: report.payments?.udhaar ?? 0,
      color: "#D97706",
      icon: Users,
    },
  ];


  return (
    <>
      {/* =====================================================
          DESKTOP — UNCHANGED
      ===================================================== */}

      <div
        className="hidden min-h-screen lg:block"
        style={{
          background: "#F8FAFC",
          fontFamily: "'Inter', sans-serif",
        }}
      >

        <div className="mx-auto max-w-[1280px] px-7 py-7">

          <button
            onClick={() =>
              navigate("/daily-reports")
            }
            className="mb-5 inline-flex items-center gap-1.5 text-[13px] font-medium transition-colors"
            style={{ color: "#6B7280" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color =
                "#2563EB")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color =
                "#6B7280")
            }
          >
            <ArrowLeft size={14} />
            Back to Daily Reports
          </button>


          <Card className="mb-5 px-7 py-5">

            <div className="flex items-center justify-between">

              <div>

                <h1 className="text-[26px] font-bold">
                  {report.store?.name}
                </h1>

                <div className="mt-2 flex flex-wrap items-center gap-3">

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

                  <span className="rounded-md border bg-gray-100 px-2 py-1 text-[11px] font-semibold">
                    {report.store?.code}
                  </span>

                </div>

              </div>


              <div className="flex items-center gap-3">

                <IconAction
                  icon={
                    <RotateCcw size={14} />
                  }
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
                value={fmt(
                  report.summary?.sales
                )}
                trend="Today's total sales"
                dir="up"
              />

              <KPICard
                icon={<FileText size={14} />}
                label="Bills Generated"
                value={
                  report.summary?.bills
                }
                trend="Bills generated"
                dir="up"
              />

              <KPICard
                icon={<Truck size={14} />}
                label="Deliveries"
                value={
                  report.summary?.deliveries
                }
                trend="Completed deliveries"
                dir="up"
              />

              <KPICard
                icon={
                  <ShoppingCart size={14} />
                }
                label="Purchases"
                value={fmt(
                  report.summary?.purchases
                )}
                trend="Today's purchases"
                dir="up"
              />

              <KPICard
                icon={
                  <CreditCard size={14} />
                }
                label="Expenses"
                value={fmt(
                  report.summary?.expenses
                )}
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
              expenses={
                report.expenses || []
              }
            />

          </div>


          {/* PURCHASES */}

          <div className="mb-6">

            <CompletedPurchases
              purchases={
                report.completed_purchases ||
                []
              }
            />

          </div>


          {/* DELIVERIES */}

          <div className="mb-6">

            <DeliverySummary
              deliveries={
                report.delivery_assignments ||
                []
              }
            />

          </div>

        </div>

      </div>


      {/* =====================================================
          MOBILE
      ===================================================== */}

      <div className="lg:hidden">

        <MobileDailyReport
          report={report}
          loadReport={loadReport}
          navigate={navigate}
        />

      </div>
    </>
  );
}