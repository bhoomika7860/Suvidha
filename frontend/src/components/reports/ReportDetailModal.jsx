import {
  Banknote,
  Smartphone,
  CreditCard,
  Wallet,
  X,
  UserCircle,
  ShoppingCart,
  Receipt,
  Lock,
  RotateCcw,
  Store,
  Truck,
} from "lucide-react";

import StatusBadge from "./StatusBadge";

const fmt = (n) => {
  const value = Number(n || 0);

  return value === 0
    ? "–"
    : "₹" + value.toLocaleString("en-IN");
};

export default function ReportDetailModal({ report, onClose }) {
  const paymentRows = [
    {
      label: "Cash",
      icon: (
        <Banknote
          size={14}
          className="text-green-600"
        />
      ),
      value: report.payment.cash,
    },
    {
      label: "UPI",
      icon: (
        <Smartphone
          size={14}
          className="text-blue-600"
        />
      ),
      value: report.payment.upi,
    },
    {
      label: "Card",
      icon: (
        <CreditCard
          size={14}
          className="text-purple-600"
        />
      ),
      value: report.payment.card,
    },
    {
      label: "Udhaar (Credit)",
      icon: (
        <Wallet
          size={14}
          className="text-orange-500"
        />
      ),
      value: report.payment.udhaar,
    },
  ];

  const totalPayment = Object.values(
    report.payment
  ).reduce((a, b) => a + b, 0);

  return (
    <>
      {/* =====================================================
          BACKDROP
      ===================================================== */}

      <div
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px]"
        onClick={onClose}
      />


      {/* =====================================================
          DRAWER
      ===================================================== */}

      <div
        className="
          fixed right-0 top-0 z-50
          flex h-full flex-col overflow-hidden
          bg-white shadow-2xl

          w-full
          sm:w-[460px]
        "
      >

        {/* ===================================================
            HEADER
        =================================================== */}

        <div
          className="
            flex shrink-0 items-center justify-between
            border-b border-gray-100
            px-5 py-4
            sm:px-6
          "
        >

          <div className="min-w-0">

            <div className="flex items-center gap-2">

              <Store
                size={16}
                className="shrink-0 text-blue-600"
              />

              <div className="truncate text-[15px] font-semibold text-gray-900">
                {report.store}
              </div>

            </div>

            <div className="mt-1 text-[11px] text-gray-500">
              {report.date} · Report Details
            </div>

          </div>


          <button
            type="button"
            onClick={onClose}
            className="
              ml-3 flex h-8 w-8 shrink-0
              items-center justify-center
              rounded-full
              text-gray-500
              transition
              hover:bg-gray-100
            "
          >
            <X size={17} />
          </button>

        </div>


        {/* ===================================================
            CONTENT
        =================================================== */}

        <div
          className="
            flex-1 overflow-y-auto
            px-4 py-4
            sm:px-6 sm:py-5
          "
        >

          <div className="space-y-4 sm:space-y-5">


            {/* =================================================
                REPORT STATUS
            ================================================= */}

            <section
              className="
                rounded-xl
                border border-gray-100
                bg-gray-50
                p-3
                sm:p-4
              "
            >

              <div className="flex items-center justify-between gap-3">

                <StatusBadge
                  status={report.status}
                />

                {report.submittedBy && (
                  <div className="min-w-0 text-right">

                    <div className="flex items-center justify-end gap-1 text-[11px] text-gray-500">

                      <UserCircle size={12} />

                      <span className="truncate">
                        {report.submittedBy}
                      </span>

                    </div>

                    <div className="mt-0.5 text-[10px] text-gray-400">
                      {report.submittedAt || "—"}
                    </div>

                  </div>
                )}

              </div>

            </section>


            {/* =================================================
                SALES
            ================================================= */}

            <section>

              <div className="mb-2.5 flex items-center gap-2">

                <span
                  className="
                    flex h-6 w-6 items-center justify-center
                    rounded-lg bg-blue-50
                    text-[10px] font-bold text-blue-600
                  "
                >
                  01
                </span>

                <span className="text-[15px] font-semibold text-gray-900">
                  Sales
                </span>

              </div>


              <div className="grid grid-cols-2 gap-2.5">

                {/* Total Bills */}

                <div
                  className="
                    rounded-xl
                    border border-gray-200
                    bg-gray-50
                    px-3.5 py-3
                    sm:p-4
                  "
                >

                  <div className="text-[10px] font-medium text-gray-500">
                    Total Bills
                  </div>

                  <div className="mt-1 text-[17px] font-semibold text-[#0F172A]">
                    {report.bills}
                  </div>

                </div>


                {/* Cash Sales */}

                <div
                  className="
                    rounded-xl
                    border border-gray-200
                    bg-gray-50
                    px-3.5 py-3
                    sm:p-4
                  "
                >

                  <div className="text-[10px] font-medium text-gray-500">
                    Cash Sales
                  </div>

                  <div className="mt-1 text-[17px] font-semibold text-[#0F172A]">
                    {fmt(report.payment.cash)}
                  </div>

                </div>


                {/* UPI Sales */}

                <div
                  className="
                    rounded-xl
                    border border-gray-200
                    bg-gray-50
                    px-3.5 py-3
                    sm:p-4
                  "
                >

                  <div className="text-[10px] font-medium text-gray-500">
                    UPI Sales
                  </div>

                  <div className="mt-1 text-[17px] font-semibold text-[#0F172A]">
                    {fmt(report.payment.upi)}
                  </div>

                </div>


                {/* Card Sales */}

                <div
                  className="
                    rounded-xl
                    border border-gray-200
                    bg-gray-50
                    px-3.5 py-3
                    sm:p-4
                  "
                >

                  <div className="text-[10px] font-medium text-gray-500">
                    Card Sales
                  </div>

                  <div className="mt-1 text-[17px] font-semibold text-[#0F172A]">
                    {fmt(report.payment.card)}
                  </div>

                </div>


                {/* Udhaar */}

                <div
                  className="
                    rounded-xl
                    border border-gray-200
                    bg-gray-50
                    px-3.5 py-3
                    sm:p-4
                  "
                >

                  <div className="text-[10px] font-medium text-gray-500">
                    Udhaar Included in Cash Sales
                  </div>

                  <div className="mt-1 text-[17px] font-semibold text-[#0F172A]">
                    {fmt(report.payment.udhaar)}
                  </div>

                </div>


                {/* Total Sales */}

                <div
                  className="
                    rounded-xl
                    border border-blue-200
                    bg-blue-50
                    px-3.5 py-3
                    sm:p-4
                  "
                >

                  <div className="text-[10px] font-medium text-blue-600">
                    Total Sales
                  </div>

                  <div className="mt-1 text-[17px] font-semibold text-blue-700">
                    {fmt(report.totalSales)}
                  </div>

                </div>

              </div>

            </section>


            {/* =================================================
                STORE OPERATIONS
            ================================================= */}

            <section>

              <div className="mb-2.5 flex items-center gap-2">

                <span
                  className="
                    flex h-6 w-6 items-center justify-center
                    rounded-lg bg-green-50
                    text-[10px] font-bold text-green-600
                  "
                >
                  02
                </span>

                <span className="text-[15px] font-semibold text-gray-900">
                  Store Operations
                </span>

              </div>


              <div className="grid grid-cols-2 gap-2.5">

                <div
                  className="
                    rounded-xl
                    border border-gray-200
                    bg-gray-50
                    px-3.5 py-3
                    sm:p-4
                  "
                >

                  <div className="flex items-center gap-2">

                    <Truck
                      size={14}
                      className="text-blue-600"
                    />

                    <span className="text-[10px] font-medium text-gray-500">
                      Deliveries
                    </span>

                  </div>

                  <div className="mt-1 text-[17px] font-semibold text-[#0F172A]">
                    {report.deliveries ?? 0}
                  </div>

                </div>

              </div>

            </section>


            {/* =================================================
                PAYMENT BREAKDOWN
            ================================================= */}

            <section>

              <div className="mb-2.5 flex items-center gap-2">

                <span
                  className="
                    flex h-6 w-6 items-center justify-center
                    rounded-lg bg-purple-50
                    text-[10px] font-bold text-purple-600
                  "
                >
                  03
                </span>

                <span className="text-[15px] font-semibold text-gray-900">
                  Payment Breakdown
                </span>

              </div>


              <div className="overflow-hidden rounded-xl border border-gray-200">

                {paymentRows.map(
                  (row, i) => (
                    <div
                      key={row.label}
                      className={`
                        flex items-center justify-between
                        px-3.5 py-2.5
                        sm:px-4 sm:py-3
                        ${
                          i !==
                          paymentRows.length - 1
                            ? "border-b border-gray-100"
                            : ""
                        }
                      `}
                    >

                      <div className="flex min-w-0 items-center gap-2">

                        {row.icon}

                        <span className="truncate text-[12px] text-gray-700">
                          {row.label}
                        </span>

                      </div>

                      <span className="ml-3 text-[12px] font-semibold text-gray-900">
                        {fmt(row.value)}
                      </span>

                    </div>
                  )
                )}


                <div
                  className="
                    flex items-center justify-between
                    border-t border-gray-100
                    bg-gray-50
                    px-3.5 py-2.5
                    sm:px-4 sm:py-3
                  "
                >

                  <span className="text-[12px] font-semibold text-gray-700">
                    Total Collected
                  </span>

                  <span className="text-[13px] font-semibold text-gray-900">
                    {fmt(totalPayment)}
                  </span>

                </div>

              </div>

            </section>


            {/* =================================================
                PURCHASES & EXPENSES
            ================================================= */}

            <section>

              <div className="mb-2.5 flex items-center gap-2">

                <span
                  className="
                    flex h-6 w-6 items-center justify-center
                    rounded-lg bg-orange-50
                    text-[10px] font-bold text-orange-600
                  "
                >
                  04
                </span>

                <span className="text-[15px] font-semibold text-gray-900">
                  Purchases & Expenses
                </span>

              </div>


              <div className="grid grid-cols-2 gap-2.5">

                <div
                  className="
                    rounded-xl
                    border border-gray-200
                    bg-gray-50
                    px-3.5 py-3
                    sm:p-4
                  "
                >

                  <div className="flex items-center gap-1.5">

                    <ShoppingCart
                      size={13}
                      className="text-orange-500"
                    />

                    <span className="text-[10px] font-medium text-gray-500">
                      Purchases
                    </span>

                  </div>

                  <div className="mt-1 text-[16px] font-semibold text-gray-900">
                    {fmt(report.purchases)}
                  </div>

                </div>


                <div
                  className="
                    rounded-xl
                    border border-gray-200
                    bg-gray-50
                    px-3.5 py-3
                    sm:p-4
                  "
                >

                  <div className="flex items-center gap-1.5">

                    <Receipt
                      size={13}
                      className="text-red-400"
                    />

                    <span className="text-[10px] font-medium text-gray-500">
                      Expenses
                    </span>

                  </div>

                  <div className="mt-1 text-[16px] font-semibold text-gray-900">
                    {fmt(report.expenses)}
                  </div>

                </div>

              </div>

            </section>


            {/* =================================================
                NOTES
            ================================================= */}

            <section>

              <div className="mb-2.5 flex items-center gap-2">

                <span
                  className="
                    flex h-6 w-6 items-center justify-center
                    rounded-lg bg-gray-100
                    text-[10px] font-bold text-gray-600
                  "
                >
                  05
                </span>

                <span className="text-[15px] font-semibold text-gray-900">
                  Notes
                </span>

              </div>


              <div
                className="
                  rounded-xl
                  border border-gray-200
                  bg-gray-50
                  px-3.5 py-3
                  text-[12px]
                  leading-relaxed
                  text-gray-700
                  sm:px-4 sm:py-3
                "
              >

                {report.notes === "–" ? (
                  <span className="italic text-gray-400">
                    No notes submitted
                  </span>
                ) : (
                  report.notes
                )}

              </div>

            </section>


          </div>

        </div>


        {/* ===================================================
            FOOTER ACTIONS
        =================================================== */}

        <div
          className="
            flex shrink-0 gap-2
            border-t border-gray-100
            bg-white
            px-4 py-3
            sm:gap-3 sm:px-6 sm:py-4
          "
        >

          {report.status !== "Locked" && (
            <button
              type="button"
              className="
                flex flex-1 items-center justify-center gap-1.5
                rounded-xl
                bg-[#1D4ED8]
                px-3 py-2.5
                text-[12px] font-medium
                text-white
                transition-colors
                hover:bg-[#1e3a6e]
              "
            >
              <Lock size={13} />
              Lock Report
            </button>
          )}


          <button
            type="button"
            className="
              flex flex-1 items-center justify-center gap-1.5
              rounded-xl
              border border-gray-200
              px-3 py-2.5
              text-[12px] font-medium
              text-gray-700
              transition-colors
              hover:bg-gray-50
            "
          >
            <RotateCcw size={13} />
            Request Correction
          </button>

        </div>

      </div>
    </>
  );
}