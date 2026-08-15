import {
  useEffect,
  useState,
} from "react";

import {
  LayoutDashboard,
  Store,
  FileText,
  Users,
  Target,
  Package,
  BarChart2,
  ClipboardList,
  Settings,
  Search,
  Download,
  Bell,
  ChevronDown,
  CalendarDays,
  Receipt,
  Wallet,
  CreditCard,
  Smartphone,
  Banknote,
  PackageCheck,
  Truck,
  ShoppingCart,
  X,
  CheckCircle2,
  Lock,
  StickyNote,
  CircleDollarSign,
} from "lucide-react";

import ReportFilters from "../../components/reports/ReportFilters";
import ExportReportsModal from "../../components/reports/ExportReportsModal";

import dailyReportsService from "../../services/dailyReportsService";

import paymentMachineService from "../../services/paymentMachineService";
import paymentMachineEntryService from "../../services/paymentMachineEntryService";

import { useParams } from "react-router-dom";


// ─────────────────────────────────────────────────────────────
// NAV ITEMS
// ─────────────────────────────────────────────────────────────

const navItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Stores",
    icon: Store,
  },
  {
    label: "Daily Reports",
    icon: FileText,
    active: true,
  },
  {
    label: "Staff",
    icon: Users,
  },
  {
    label: "Targets",
    icon: Target,
  },
  {
    label: "Inventory",
    icon: Package,
  },
  {
    label: "Analytics",
    icon: BarChart2,
  },
  {
    label: "Audit Logs",
    icon: ClipboardList,
  },
  {
    label: "Settings",
    icon: Settings,
  },
];


// ─────────────────────────────────────────────────────────────
// TOP BAR
// ─────────────────────────────────────────────────────────────

function TopBar({
  searchQuery,
  onSearchChange,
}) {
  return (
    <header className="flex h-[62px] shrink-0 items-center gap-4 border-b border-gray-200 bg-white px-6">

      <div className="relative max-w-md flex-1">

        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          value={searchQuery}
          onChange={(e) =>
            onSearchChange(
              e.target.value
            )
          }
          placeholder="Search stores, reports..."
          className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-sm placeholder:text-gray-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
        />

      </div>


      <div className="ml-auto flex items-center gap-3">

        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"
        >
          <Bell size={16} />

          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />

        </button>


        <button
          type="button"
          className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 hover:bg-gray-50"
        >

          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1D4ED8] text-xs font-bold text-white">
            RA
          </div>

          <span className="text-sm font-medium text-gray-700">
            Rajesh
          </span>

          <ChevronDown
            size={13}
            className="text-gray-400"
          />

        </button>

      </div>

    </header>
  );
}


// ─────────────────────────────────────────────────────────────
// NUMBER HELPERS
// ─────────────────────────────────────────────────────────────

function money(value) {
  return `₹${Number(
    value || 0
  ).toLocaleString("en-IN")}`;
}


function numberValue(value) {
  return Number(
    value || 0
  );
}


// ─────────────────────────────────────────────────────────────
// DATE HELPER
// ─────────────────────────────────────────────────────────────

function getIndiaDate(value) {
  if (!value) {
    return null;
  }

  try {
    return new Intl.DateTimeFormat(
      "en-CA",
      {
        timeZone:
          "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }
    ).format(
      new Date(value)
    );
  } catch {
    return null;
  }
}


// ─────────────────────────────────────────────────────────────
// PURCHASE TOTAL
// ONLY RECEIVED PURCHASES FOR THAT REPORT DATE
// ─────────────────────────────────────────────────────────────

function getTodaysReceivedPurchases(
  purchases,
  report
) {
  if (
    !Array.isArray(
      purchases
    )
  ) {
    return 0;
  }

  const reportDate =
    getIndiaDate(
      report.report_date ||
        report.date
    );

  if (!reportDate) {
    return 0;
  }

  return purchases
    .filter(
      (purchase) => {

        const status =
          String(
            purchase.status ||
              ""
          ).toLowerCase();

        if (
          status !==
          "received"
        ) {
          return false;
        }

        const receivedDate =
          getIndiaDate(
            purchase.received_date ||
              purchase.received_at ||
              purchase.created_at
          );

        return (
          receivedDate ===
          reportDate
        );
      }
    )
    .reduce(
      (
        total,
        purchase
      ) =>
        total +
        Number(
          purchase.purchase_amount ??
            purchase.amount ??
            0
        ),
      0
    );
}


// ─────────────────────────────────────────────────────────────
// REPORT DETAIL DRAWER
// ─────────────────────────────────────────────────────────────

function OwnerReportDrawer({
  report,
  onClose,
}) {
  const [
    fullReport,
    setFullReport,
  ] = useState(
    report
  );

  const [
    expenses,
    setExpenses,
  ] = useState([]);

  const [
    purchases,
    setPurchases,
  ] = useState([]);

  const [
    machines,
    setMachines,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);


  useEffect(() => {
    let cancelled = false;

    async function loadReportDetails() {
      try {
        setLoading(
          true
        );


        // ─────────────────────────────
        // COMPLETE REPORT
        // ─────────────────────────────

        let detailed =
          report;

        try {
          const data =
            await dailyReportsService.getReport(
              Number(
                report.id
              )
            );

          if (data) {
            detailed =
              data;
          }
        } catch (err) {
          console.error(
            "Failed to load detailed report:",
            err
          );
        }


        if (
          cancelled
        ) {
          return;
        }

        setFullReport(
          detailed
        );


        // ─────────────────────────────
        // EXPENSES
        // ─────────────────────────────

        try {
          const expenseData =
            await dailyReportsService.getExpenses(
              Number(
                report.id
              )
            );

          if (
            Array.isArray(
              expenseData
            )
          ) {
            setExpenses(
              expenseData
            );
          }
        } catch (err) {
          console.error(
            "Failed to load expenses:",
            err
          );
        }


        // ─────────────────────────────
        // PURCHASES
        // ─────────────────────────────

        try {
          const purchaseData =
            await dailyReportsService.getPurchases(
              Number(
                report.id
              )
            );

          if (
            Array.isArray(
              purchaseData
            )
          ) {
            setPurchases(
              purchaseData
            );
          }
        } catch (err) {
          console.error(
            "Failed to load purchases:",
            err
          );
        }


        // ─────────────────────────────
        // PAYMENT MACHINES
        // ─────────────────────────────

        try {
          const machineList =
            await paymentMachineService.getMachines();

          const entries =
            await paymentMachineEntryService.get(
              Number(
                report.id
              )
            );

          const merged =
            Array.isArray(
              machineList
            )
              ? machineList.map(
                  (machine) => {

                    const existing =
                      Array.isArray(
                        entries
                      )
                        ? entries.find(
                            (
                              entry
                            ) =>
                              entry.machine_id ===
                              machine.id
                          )
                        : null;

                    return {
                      ...machine,
                      amount:
                        existing?.amount ??
                        0,
                    };
                  }
                )
              : [];

          if (
            !cancelled
          ) {
            setMachines(
              merged
            );
          }
        } catch (err) {
          console.error(
            "Failed to load payment machines:",
            err
          );
        }

      } finally {
        if (
          !cancelled
        ) {
          setLoading(
            false
          );
        }
      }
    }


    loadReportDetails();


    return () => {
      cancelled = true;
    };

  }, [report]);


  if (!fullReport) {
    return null;
  }


  // ─────────────────────────────────────
  // SALES
  // ─────────────────────────────────────

  const cashSales =
    numberValue(
      fullReport.cash_sales
    );

  const upiSales =
    numberValue(
      fullReport.upi_sales
    );

  const cardSales =
    numberValue(
      fullReport.card_sales
    );

  const udhaarSales =
    numberValue(
      fullReport.udhaar_sales
    );


  /*
   * Udhaar is already part of
   * Total Cash Sales according to
   * the current manager workflow.
   */
  const totalCashSales =
    cashSales +
    udhaarSales;


  const actualSales =
    totalCashSales +
    upiSales +
    cardSales;


  const totalBills =
    numberValue(
      fullReport.total_bills
    );


  const deliveries =
    numberValue(
      fullReport.deliveries
    );


  // ─────────────────────────────────────
  // EXPENSES
  // ─────────────────────────────────────

  const totalExpenses =
    expenses.reduce(
      (
        total,
        expense
      ) =>
        total +
        numberValue(
          expense.amount
        ),
      0
    );


  // ─────────────────────────────────────
  // PURCHASES
  // ─────────────────────────────────────

  const todaysPurchases =
    getTodaysReceivedPurchases(
      purchases,
      fullReport
    );


  // ─────────────────────────────────────
  // DIGITAL COLLECTION
  // ─────────────────────────────────────

  const digitalTotal =
    machines.reduce(
      (
        total,
        machine
      ) =>
        total +
        numberValue(
          machine.amount
        ),
      0
    );


  // ─────────────────────────────────────
  // CASH DENOMINATIONS
  // ─────────────────────────────────────

  const denominations = [
    500,
    200,
    100,
    50,
    20,
    10,
    5,
    2,
    1,
  ];


  const denominationValues =
    fullReport.cash_denominations ||
    fullReport.denominations ||
    {};


  const cashCounted =
    denominations.reduce(
      (
        total,
        denomination
      ) => {

        const quantity =
          Number(
            denominationValues[
              denomination
            ] ||
              denominationValues[
                `₹${denomination}`
              ] ||
              0
          );

        return (
          total +
          denomination *
            quantity
        );
      },
      0
    );


  // ─────────────────────────────────────
  // BOUNCED PRODUCTS
  // ─────────────────────────────────────

  const bouncedProducts =
    Array.isArray(
      fullReport.bounced_products
    )
      ? fullReport.bounced_products
      : [];


  // ─────────────────────────────────────
  // NOTES
  // ─────────────────────────────────────

  const notes =
    fullReport.notes ||
    "";


  return (
    <>

      {/* Overlay */}

      <div
        onClick={
          onClose
        }
        className="fixed inset-0 z-40 bg-black/30"
      />


      {/* Drawer */}

      <aside className="fixed right-0 top-0 z-50 flex h-screen w-full flex-col bg-white shadow-2xl sm:w-[760px]">

        {/* Header */}

        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-7 py-5">

          <div>

            <div className="flex items-center gap-3">

              <h2 className="text-2xl font-bold text-gray-900">
                Daily Report
              </h2>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">

                <Lock size={12} />

                Locked

              </span>

            </div>

            <p className="mt-1 flex items-center gap-2 text-sm text-gray-500">

              <CalendarDays
                size={15}
              />

              {fullReport.report_date ||
                fullReport.date}

            </p>

            {fullReport.store_name && (
              <p className="mt-1 text-sm font-medium text-blue-600">
                {fullReport.store_name}
              </p>
            )}

          </div>


          <button
            type="button"
            onClick={
              onClose
            }
            className="rounded-xl p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
          >
            <X size={22} />
          </button>

        </div>


        {/* Content */}

        <div className="flex-1 overflow-y-auto">

          {loading ? (

            <div className="flex min-h-[500px] items-center justify-center">

              <p className="text-sm text-gray-500">
                Loading report...
              </p>

            </div>

          ) : (

            <div className="space-y-8 p-7">

              {/* ─────────────────────────────
                  SALES
              ───────────────────────────── */}

              <ReportSection
                number="01"
                title="Sales"
                icon={
                  <Receipt
                    size={19}
                  />
                }
              >

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                  <Metric
                    label="Total Bills"
                    value={
                      totalBills
                    }
                  />

                  <Metric
                    label="Cash Sales"
                    value={money(
                      totalCashSales
                    )}
                  />

                  <Metric
                    label="UPI Sales"
                    value={money(
                      upiSales
                    )}
                  />

                  <Metric
                    label="Card Sales"
                    value={money(
                      cardSales
                    )}
                  />

                </div>


                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">

                  <Metric
                    label="Udhaar Included in Cash Sales"
                    value={money(
                      udhaarSales
                    )}
                    muted
                  />

                  <Metric
                    label="Total Sales"
                    value={money(
                      actualSales
                    )}
                    highlighted
                  />

                </div>

              </ReportSection>


              {/* ─────────────────────────────
                  CASH VERIFICATION
              ───────────────────────────── */}

              <ReportSection
                number="02"
                title="Cash Verification"
                icon={
                  <Banknote
                    size={19}
                  />
                }
              >

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                  <Metric
                    label="Opening Cash"
                    value={money(
                      fullReport.opening_cash
                    )}
                  />

                  <Metric
                    label="Cash Counted"
                    value={money(
                      cashCounted
                    )}
                  />

                  <Metric
                    label="Physical Cash Sales"
                    value={money(
                      cashCounted -
                        numberValue(
                          fullReport.opening_cash
                        )
                    )}
                  />

                </div>


                <div className="mt-5">

                  <p className="mb-3 text-sm font-semibold text-gray-700">
                    Cash Denominations
                  </p>


                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">

                    {denominations.map(
                      (
                        denomination
                      ) => (

                        <div
                          key={
                            denomination
                          }
                          className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3"
                        >

                          <span className="font-medium text-gray-700">
                            ₹
                            {
                              denomination
                            }
                          </span>

                          <span className="font-semibold text-gray-900">

                            {Number(
                              denominationValues[
                                denomination
                              ] ||
                                denominationValues[
                                  `₹${denomination}`
                                ] ||
                                0
                            )}

                          </span>

                        </div>

                      )
                    )}

                  </div>

                </div>

              </ReportSection>


              {/* ─────────────────────────────
                  DELIVERIES
              ───────────────────────────── */}

              <ReportSection
                number="03"
                title="Deliveries"
                icon={
                  <Truck
                    size={19}
                  />
                }
              >

                <Metric
                  label="Total Deliveries Completed"
                  value={
                    deliveries
                  }
                />

              </ReportSection>


              {/* ─────────────────────────────
                  EXPENSES
              ───────────────────────────── */}

              <ReportSection
                number="04"
                title="Expenses"
                icon={
                  <Wallet
                    size={19}
                  />
                }
                optional
              >

                {expenses.length ===
                0 ? (

                  <EmptyState text="No expenses were submitted for this report." />

                ) : (

                  <>

                    <div className="space-y-3">

                      {expenses.map(
                        (
                          expense
                        ) => (

                          <div
                            key={
                              expense.id
                            }
                            className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3"
                          >

                            <div>

                              <p className="font-medium text-gray-800">
                                {
                                  expense.expense_type ||
                                  "Expense"
                                }
                              </p>

                              {expense.remarks && (
                                <p className="mt-1 text-sm text-gray-500">
                                  {
                                    expense.remarks
                                  }
                                </p>
                              )}

                            </div>

                            <p className="font-semibold text-gray-900">
                              {money(
                                expense.amount
                              )}
                            </p>

                          </div>

                        )
                      )}

                    </div>


                    <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">

                      <span className="font-semibold text-gray-700">
                        Total Expenses
                      </span>

                      <span className="text-xl font-bold text-orange-600">
                        {money(
                          totalExpenses
                        )}
                      </span>

                    </div>

                  </>

                )}

              </ReportSection>


              {/* ─────────────────────────────
                  PURCHASES
              ───────────────────────────── */}

              <ReportSection
                number="05"
                title="Purchases"
                icon={
                  <ShoppingCart
                    size={19}
                  />
                }
                optional
              >

                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">

                  <p className="text-sm font-medium text-blue-700">
                    Purchases Received Today
                  </p>

                  <p className="mt-2 text-3xl font-bold text-blue-700">
                    {money(
                      todaysPurchases
                    )}
                  </p>

                  <p className="mt-2 text-sm text-blue-700/70">
                    Only purchase bills received on this business date are included.
                  </p>

                </div>

              </ReportSection>


              {/* ─────────────────────────────
                  UPI / CARD MACHINES
              ───────────────────────────── */}

              <ReportSection
                number="06"
                title="UPI / Card Payments"
                icon={
                  <CreditCard
                    size={19}
                  />
                }
              >

                {machines.length ===
                0 ? (

                  <EmptyState text="No payment machines were recorded for this report." />

                ) : (

                  <>

                    <div className="space-y-3">

                      {machines.map(
                        (
                          machine
                        ) => (

                          <div
                            key={
                              machine.id
                            }
                            className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-4"
                          >

                            <div className="flex items-center gap-3">

                              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">

                                <Smartphone
                                  size={17}
                                  className="text-blue-600"
                                />

                              </div>

                              <span className="font-medium text-gray-800">
                                {
                                  machine.machine_name
                                }
                              </span>

                            </div>

                            <span className="font-semibold text-gray-900">
                              {money(
                                machine.amount
                              )}
                            </span>

                          </div>

                        )
                      )}

                    </div>


                    <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">

                      <span className="font-semibold text-gray-700">
                        Total Digital Collection
                      </span>

                      <span className="text-xl font-bold text-blue-600">
                        {money(
                          digitalTotal
                        )}
                      </span>

                    </div>

                  </>

                )}

              </ReportSection>


              {/* ─────────────────────────────
                  BOUNCED PRODUCTS
              ───────────────────────────── */}

              <ReportSection
                number="07"
                title="Bounced Products"
                icon={
                  <PackageCheck
                    size={19}
                  />
                }
              >

                {bouncedProducts.length ===
                0 ? (

                  <EmptyState text="No bounced products were submitted for this report." />

                ) : (

                  <div className="space-y-3">

                    {bouncedProducts.map(
                      (
                        product,
                        index
                      ) => (

                        <div
                          key={
                            product.id ??
                            index
                          }
                          className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3"
                        >

                          <span className="font-medium text-gray-800">
                            {
                              product.product_name ||
                              product.name ||
                              "-"
                            }
                          </span>

                          <span className="text-sm font-semibold text-gray-600">
                            Qty:{" "}
                            {
                              product.quantity ??
                              0
                            }
                          </span>

                        </div>

                      )
                    )}

                  </div>

                )}

              </ReportSection>


              {/* ─────────────────────────────
                  NOTES
              ───────────────────────────── */}

              <ReportSection
                number="08"
                title="Notes"
                icon={
                  <StickyNote
                    size={19}
                  />
                }
              >

                {notes ? (

                  <div className="rounded-xl bg-gray-50 p-5 leading-7 text-gray-700">
                    {notes}
                  </div>

                ) : (

                  <EmptyState text="No notes were submitted for this report." />

                )}

              </ReportSection>


              {/* ─────────────────────────────
                  SUBMISSION STATUS
              ───────────────────────────── */}

              <div className="flex items-start gap-4 rounded-2xl border border-green-200 bg-green-50 p-5">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100">

                  <CheckCircle2
                    size={20}
                    className="text-green-600"
                  />

                </div>

                <div>

                  <p className="font-semibold text-green-700">
                    Report Submitted
                  </p>

                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    This report was submitted by the store manager and is locked for editing.
                  </p>

                </div>

              </div>

            </div>

          )}

        </div>

      </aside>

    </>
  );
}


// ─────────────────────────────────────────────────────────────
// REPORT SECTION
// ─────────────────────────────────────────────────────────────

function ReportSection({
  number,
  title,
  icon,
  children,
  optional = false,
}) {
  return (
    <section>

      <div className="mb-4 flex items-center gap-3">

        <span className="text-sm font-semibold tracking-wider text-blue-600">
          {number}
        </span>

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          {icon}
        </div>

        <div>

          <div className="flex items-center gap-2">

            <h3 className="text-xl font-bold text-gray-900">
              {title}
            </h3>

            {optional && (
              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500">
                Optional
              </span>
            )}

          </div>

        </div>

      </div>


      <div className="rounded-2xl border border-gray-200 bg-white p-5">

        {children}

      </div>

    </section>
  );
}


// ─────────────────────────────────────────────────────────────
// METRIC
// ─────────────────────────────────────────────────────────────

function Metric({
  label,
  value,
  muted = false,
  highlighted = false,
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        highlighted
          ? "border-blue-200 bg-blue-50"
          : "border-gray-200 bg-gray-50"
      }`}
    >

      <p
        className={`text-sm ${
          muted
            ? "text-gray-400"
            : "text-gray-500"
        }`}
      >
        {label}
      </p>

      <p
        className={`mt-2 text-2xl font-bold ${
          highlighted
            ? "text-blue-700"
            : "text-gray-900"
        }`}
      >
        {value}
      </p>

    </div>
  );
}


// ─────────────────────────────────────────────────────────────
// EMPTY STATE
// ─────────────────────────────────────────────────────────────

function EmptyState({
  text,
}) {
  return (
    <div className="rounded-xl bg-gray-50 px-5 py-6 text-center text-sm text-gray-500">
      {text}
    </div>
  );
}


// ─────────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────────

export default function App() {
  const {
    storeId,
  } = useParams();


  const [
    searchQuery,
    setSearchQuery,
  ] = useState("");


  const [
    storeFilter,
    setStoreFilter,
  ] = useState(
    "All Stores"
  );


  const [
    statusFilter,
    setStatusFilter,
  ] = useState(
    "All Status"
  );


  const [
    showExportModal,
    setShowExportModal,
  ] = useState(
    false
  );


  const [
    reports,
    setReports,
  ] = useState([]);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState(null);


  const [
    selectedReport,
    setSelectedReport,
  ] = useState(null);


  // ─────────────────────────────────────
  // LOAD REPORTS
  // ─────────────────────────────────────

  useEffect(() => {
    const fetchReports =
      async () => {

        try {

          setLoading(
            true
          );

          setError(
            null
          );


          let data;


          if (
            storeId
          ) {

            data =
              await dailyReportsService.getStoreReports(
                storeId
              );

          } else {

            data =
              await dailyReportsService.getTodayReports();

          }


          setReports(
            Array.isArray(
              data
            )
              ? data
              : []
          );

        } catch (err) {

          console.error(
            "Failed to load reports:",
            err
          );

          setError(
            "Failed to load reports."
          );

        } finally {

          setLoading(
            false
          );

        }

      };


    fetchReports();

  }, [storeId]);


  // ─────────────────────────────────────
  // FORMAT REPORTS
  // ─────────────────────────────────────

  const formattedReports =
    dailyReportsService.formatReports(
      reports
    );


  // ─────────────────────────────────────
  // FILTER
  // ─────────────────────────────────────

  const filtered =
    formattedReports.filter(
      (report) => {

        const searchValue =
          searchQuery
            .toLowerCase()
            .trim();


        const matchSearch =
          searchValue ===
            "" ||
          report.store
            ?.toLowerCase()
            .includes(
              searchValue
            );


        const matchStore =
          storeFilter ===
            "All Stores" ||
          report.store_id ===
            Number(
              storeFilter
            );


        const matchStatus =
          statusFilter ===
            "All Status" ||
          report.status ===
            statusFilter;


        return (
          matchSearch &&
          matchStore &&
          matchStatus
        );
      }
    );


  // ─────────────────────────────────────
  // LOADING
  // ─────────────────────────────────────

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        Loading reports...
      </div>
    );
  }


  // ─────────────────────────────────────
  // ERROR
  // ─────────────────────────────────────

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">

        <div className="text-center">

          <p className="font-medium text-red-600">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
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
      style={{
        fontFamily:
          "Inter, sans-serif",
      }}
    >

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">


        {/* ─────────────────────────────
            TOP BAR
        ───────────────────────────── */}

        <TopBar
          searchQuery={
            searchQuery
          }
          onSearchChange={
            setSearchQuery
          }
        />


        {/* ─────────────────────────────
            MAIN
        ───────────────────────────── */}

        <main className="flex-1 overflow-y-auto px-6 py-6">


          {/* Header */}

          <div className="mb-6 flex items-start justify-between">

            <div>

              <h1 className="text-xl font-bold text-gray-900">
                Daily Reports
              </h1>

              <p className="mt-0.5 text-sm text-gray-500">
                Track and review store-wise daily reports
              </p>

            </div>


            <button
              type="button"
              onClick={() =>
                setShowExportModal(
                  true
                )
              }
              className="flex items-center gap-2 rounded-xl bg-[#1D4ED8] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1e3a6e]"
            >

              <Download
                size={14}
              />

              Export Reports

            </button>

          </div>


          {/* Filters */}

          <ReportFilters
            searchQuery={
              searchQuery
            }
            setSearchQuery={
              setSearchQuery
            }
            storeFilter={
              storeFilter
            }
            setStoreFilter={
              setStoreFilter
            }
            statusFilter={
              statusFilter
            }
            setStatusFilter={
              setStatusFilter
            }
            reports={
              reports
            }
          />


          {/* Reports */}

          {filtered.length ===
          0 ? (

            <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white py-20">

              <FileText className="mb-4 h-12 w-12 text-gray-300" />

              <h3 className="text-lg font-semibold text-gray-700">
                No reports found
              </h3>

              <p className="mt-2 text-center text-sm text-gray-500">
                Try changing your filters or wait for stores to submit their daily reports.
              </p>

            </div>

          ) : (

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

              <div className="overflow-x-auto">

                <table className="w-full min-w-[1000px]">

                  <thead className="bg-gray-50">

                    <tr>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Date
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Store
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Bills
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Sales
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Expenses
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Purchases
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Deliveries
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Status
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {filtered.map(
                      (
                        report
                      ) => (

                        <tr
                          key={
                            report.id
                          }
                          onClick={() =>
                            setSelectedReport(
                              report
                            )
                          }
                          className="cursor-pointer border-t border-gray-200 transition hover:bg-blue-50"
                        >

                          <td className="px-6 py-4">

                            <div className="flex items-center gap-2">

                              <CalendarDays
                                size={17}
                                className="text-gray-400"
                              />

                              <span>
                                {
                                  report.date
                                }
                              </span>

                            </div>

                          </td>


                          <td className="px-6 py-4 font-medium text-gray-700">
                            {
                              report.store
                            }
                          </td>


                          <td className="px-6 py-4 font-medium">
                            {
                              report.bills ??
                              0
                            }
                          </td>


                          <td className="px-6 py-4 font-semibold text-blue-600">
                            {money(
                              report.sales
                            )}
                          </td>


                          <td className="px-6 py-4">
                            {money(
                              report.expenses
                            )}
                          </td>


                          <td className="px-6 py-4">
                            {money(
                              report.purchases
                            )}
                          </td>


                          <td className="px-6 py-4">
                            {
                              report.deliveries ??
                              0
                            }
                          </td>


                          <td className="px-6 py-4">

                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                                report.status ===
                                "Locked"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {
                                report.status
                              }
                            </span>

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            </div>

          )}


          {/* Export */}

          <ExportReportsModal
            open={
              showExportModal
            }
            onClose={() =>
              setShowExportModal(
                false
              )
            }
          />

        </main>

      </div>


      {/* ─────────────────────────────
          REPORT DETAIL
      ───────────────────────────── */}

      {selectedReport && (
        <OwnerReportDrawer
          report={
            selectedReport
          }
          onClose={() =>
            setSelectedReport(
              null
            )
          }
        />
      )}

    </div>
  );
}