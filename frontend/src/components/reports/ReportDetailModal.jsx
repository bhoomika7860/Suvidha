import {
  Banknote,
  Smartphone,
  CreditCard,
  Wallet,
  X,
  UserCircle,
  ShoppingCart,
  Receipt,
  CheckCircle2,
  Lock,
  RotateCcw,
} from "lucide-react";

import StatusBadge from "./StatusBadge";
const fmt = (n) => (n === 0 ? "–" : "₹" + n.toLocaleString("en-IN"));

export default function ReportDetailModal({ report, onClose }) {
  const paymentRows = [
    { label: "Cash", icon: <Banknote size={14} className="text-green-600" />, value: report.payment.cash },
    { label: "UPI", icon: <Smartphone size={14} className="text-blue-600" />, value: report.payment.upi },
    { label: "Card", icon: <CreditCard size={14} className="text-purple-600" />, value: report.payment.card },
    { label: "Udhaar (Credit)", icon: <Wallet size={14} className="text-orange-500" />, value: report.payment.udhaar },
  ];

  const totalPayment = Object.values(report.payment).reduce((a, b) => a + b, 0);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-40 backdrop-blur-[1px]"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-[460px] bg-white shadow-2xl z-50 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <div className="text-base font-bold text-gray-900">{report.store}</div>
            <div className="text-xs text-gray-500 mt-0.5">{report.date} · Report Details</div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Report Status */}
<div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
  <div className="flex items-center justify-between">
    <StatusBadge status={report.status} />

    {report.submittedBy && (
      <div className="text-right">
        <div className="flex items-center gap-1 text-xs text-gray-500 justify-end">
          <UserCircle size={12} />
          {report.submittedBy}
        </div>

        <div className="text-xs text-gray-400">
          {report.submittedAt || "—"}
        </div>
      </div>
    )}
  </div>
</div>

{/* Sales Summary */}
<section>
  <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
    Sales Summary
  </div>

  <div className="grid grid-cols-2 gap-3">
    <div className="rounded-xl border border-gray-100 p-4">
      <div className="text-xs text-gray-500 uppercase mb-1">
        Total Sales
      </div>

      <div className="text-2xl font-bold text-[#0F172A]">
        {fmt(report.totalSales)}
      </div>
    </div>

    <div className="rounded-xl border border-gray-100 p-4">
      <div className="text-xs text-gray-500 uppercase mb-1">
        Bills Generated
      </div>

      <div className="text-2xl font-bold text-[#0F172A]">
        {report.bills}
      </div>
    </div>
  </div>
</section>

{/* Store Operations */}
<section>
  <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
    Store Operations
  </div>

  <div className="grid grid-cols-2 gap-3">
    <div className="rounded-xl border border-gray-100 p-4">
      <div className="text-xs text-gray-500 uppercase mb-1">
        Deliveries
      </div>

      <div className="text-2xl font-bold text-[#0F172A]">
        {report.deliveries ?? 0}
      </div>
    </div>

    <div className="rounded-xl border border-gray-100 p-4">
      <div className="text-xs text-gray-500 uppercase mb-1">
        Bounced Products
      </div>

      <div className="text-2xl font-bold text-[#0F172A]">
        {report.bouncedProducts?.length || 0}
      </div>
    </div>
  </div>
</section>

          {/* Payment Breakdown */}
          <section>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
              Payment Breakdown
            </div>
            <div className="rounded-xl border border-gray-100 overflow-hidden">
              {paymentRows.map((row, i) => (
                <div
                  key={row.label}
                  className={`flex items-center justify-between px-4 py-3 ${
                    i !== paymentRows.length - 1 ? "border-b border-gray-50" : ""
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {row.icon}
                    <span className="text-sm text-gray-700">{row.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{fmt(row.value)}</span>
                </div>
              ))}
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-100">
                <span className="text-sm font-semibold text-gray-700">Total Collected</span>
                <span className="text-sm font-bold text-gray-900">{fmt(totalPayment)}</span>
              </div>
            </div>
          </section>

          {/* Purchases & Expenses */}
          <section className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-gray-100 p-4">
              <div className="flex items-center gap-2 mb-2">
                <ShoppingCart size={14} className="text-orange-500" />
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Purchases</span>
              </div>
              <div className="text-xl font-bold text-gray-900">{fmt(report.purchases)}</div>
            </div>
            <div className="rounded-xl border border-gray-100 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Receipt size={14} className="text-red-400" />
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Expenses</span>
              </div>
              <div className="text-xl font-bold text-gray-900">{fmt(report.expenses)}</div>
            </div>
          </section>

          {/* Bounced Products */}
          <section>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
              Bounced Products ({report.bouncedProducts?.length || 0})
            </div>
            {(report.bouncedProducts?.length || 0) === 0 ? (
              <div className="flex items-center gap-2 text-sm text-gray-400 py-3 px-4 bg-gray-50 rounded-xl">
                <CheckCircle2 size={14} className="text-green-500" />
                No bounced products
              </div>
            ) : (
              <div className="rounded-xl border border-gray-100 overflow-hidden">
                {(report.bouncedProducts || []).map((p, i) => (
                  <div
                    key={i}
                    className={`px-4 py-3 ${
                      i !== report.bouncedProducts.length - 1 ? "border-b border-gray-50" : ""
                    }`}
                  >
                    <div className="text-sm font-medium text-gray-900">{p.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      Qty: {p.qty} · {p.reason}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Notes */}
          <section>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Notes</div>
            <div className="text-sm text-gray-700 bg-gray-50 rounded-xl px-4 py-3 leading-relaxed border border-gray-100">
              {report.notes === "–" ? (
                <span className="text-gray-400 italic">No notes submitted</span>
              ) : (
                report.notes
              )}
            </div>
          </section>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          {report.status !== "Locked" && (
            <button className="flex-1 flex items-center justify-center gap-2 bg-[#1D4ED8] text-white text-sm font-medium py-2.5 rounded-xl hover:bg-[#1e3a6e] transition-colors">
              <Lock size={14} />
              Lock Report
            </button>
          )}
          <button className="flex-1 flex items-center justify-center gap-2 border border-gray-200 text-gray-700 text-sm font-medium py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
            <RotateCcw size={14} />
            Request Correction
          </button>
        </div>
      </div>
    </>
  );
}