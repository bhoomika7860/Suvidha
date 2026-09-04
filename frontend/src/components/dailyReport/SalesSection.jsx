import {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";

import {
  CreditCard,
  ShoppingBag,
  Wallet,
  Receipt,
  Truck,
  Banknote,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  ClipboardCheck,
  ShieldCheck,
} from "lucide-react";

import SectionCard from "./SectionCard";
import PaymentMachines from "./PaymentMachines";

import dailyReportsService from "../../services/dailyReportsService";
import cashDenominationService from "../../services/cashDenominationService";
import paymentMachineEntryService from "../../services/paymentMachineEntryService";

const OPENING_CASH = 20000;

const EMPTY_CASH = {
  note_500: "",
  note_200: "",
  note_100: "",
  note_50: "",
  note_20: "",
  note_10: "",
  coin_5: "",
  coin_2: "",
  coin_1: "",
};

const NUMBER_INPUT_CLASS =
  "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

function normalizeNumberInput(value) {
  if (value === "") {
    return "";
  }

  return value.replace(
    /^0+(?=\d)/,
    ""
  );
}

function handleNumberWheel(e) {
  e.currentTarget.blur();
}

const SalesSection = forwardRef(
  function SalesSection(
    {
      report,
      refreshReport,
      mobile = false,
    },
    ref
  ) {

    const [form, setForm] = useState({
      total_bills: "",
      cash_sales: "",
      upi_sales: "",
      card_sales: "",
      total_expenses: "",
      system_sales: "",
    });

    const [deliveries, setDeliveries] =
      useState("");

    const [
      machineEntries,
      setMachineEntries,
    ] = useState([]);

    const [
      cash,
      setCash,
    ] = useState(EMPTY_CASH);

    const [
      mobileSection,
      setMobileSection,
    ] = useState("collections");

    const denominationRefs =
      useRef([]);

    const udhaarSales =
      Number(
        report?.udhaar_sales || 0
      );

    const totalExpenses =
      Number(
        report?.total_expenses || 0
      );

    const totalPurchases =
      Number(
        report?.total_purchases || 0
      );

    const handleMachineTotal =
      useCallback(
        (total) => {
          setForm(
            (prev) => ({
              ...prev,

              upi_sales:
                String(
                  total || 0
                ),

              card_sales:
                "0",
            })
          );
        },
        []
      );

    useEffect(() => {
      if (!report?.id) {
        return;
      }

      let cancelled = false;

      async function loadSection() {
        try {

          const savedCash =
            await cashDenominationService.get(
              report.id
            );

          if (cancelled) {
            return;
          }

          setForm({
            total_bills:
              Number(
                report.total_bills || 0
              ) > 0
                ? String(
                    report.total_bills
                  )
                : "",

            cash_sales:
              report.cash_sales !=
              null
                ? String(
                    report.cash_sales
                  )
                : "",

            upi_sales:
              report.upi_sales !=
              null
                ? String(
                    report.upi_sales
                  )
                : "",

            card_sales:
              report.card_sales !=
              null
                ? String(
                    report.card_sales
                  )
                : "",

            total_expenses:
              report.total_expenses !=
              null
                ? String(
                    report.total_expenses
                  )
                : "",

            system_sales:
              report.system_sales !=
              null
                ? String(
                    report.system_sales
                  )
                : "",
          });

          const deliveryValue =
            Number(
              report.deliveries || 0
            );

          setDeliveries(
            deliveryValue > 0
              ? String(
                  deliveryValue
                )
              : ""
          );

          if (savedCash) {

            setCash({
              note_500:
                Number(
                  savedCash.note_500 || 0
                ) > 0
                  ? String(
                      savedCash.note_500
                    )
                  : "",

              note_200:
                Number(
                  savedCash.note_200 || 0
                ) > 0
                  ? String(
                      savedCash.note_200
                    )
                  : "",

              note_100:
                Number(
                  savedCash.note_100 || 0
                ) > 0
                  ? String(
                      savedCash.note_100
                    )
                  : "",

              note_50:
                Number(
                  savedCash.note_50 || 0
                ) > 0
                  ? String(
                      savedCash.note_50
                    )
                  : "",

              note_20:
                Number(
                  savedCash.note_20 || 0
                ) > 0
                  ? String(
                      savedCash.note_20
                    )
                  : "",

              note_10:
                Number(
                  savedCash.note_10 || 0
                ) > 0
                  ? String(
                      savedCash.note_10
                    )
                  : "",

              coin_5:
                Number(
                  savedCash.coin_5 || 0
                ) > 0
                  ? String(
                      savedCash.coin_5
                    )
                  : "",

              coin_2:
                Number(
                  savedCash.coin_2 || 0
                ) > 0
                  ? String(
                      savedCash.coin_2
                    )
                  : "",

              coin_1:
                Number(
                  savedCash.coin_1 || 0
                ) > 0
                  ? String(
                      savedCash.coin_1
                    )
                  : "",
            });

          } else {

            setCash(
              EMPTY_CASH
            );

          }

          const machineData =
            await paymentMachineEntryService.get(
              report.id
            );

          if (cancelled) {
            return;
          }

          setMachineEntries(
            Array.isArray(
              machineData
            )
              ? machineData.map(
                  (machine) => ({
                    machine_id:
                      machine.machine_id,

                    amount:
                      machine.amount !=
                        null
                        ? Number(
                            machine.amount
                          )
                        : 0,
                  })
                )
              : []
          );

        } catch (err) {

          if (!cancelled) {
            console.error(
              "Failed to load sales section:",
              err
            );
          }

        }
      }

      loadSection();

      return () => {
        cancelled = true;
      };
    }, [report?.id]);

    const cashCounted =
      useMemo(() => {
        return (
          Number(
            cash.note_500 || 0
          ) * 500 +

          Number(
            cash.note_200 || 0
          ) * 200 +

          Number(
            cash.note_100 || 0
          ) * 100 +

          Number(
            cash.note_50 || 0
          ) * 50 +

          Number(
            cash.note_20 || 0
          ) * 20 +

          Number(
            cash.note_10 || 0
          ) * 10 +

          Number(
            cash.coin_5 || 0
          ) * 5 +

          Number(
            cash.coin_2 || 0
          ) * 2 +

          Number(
            cash.coin_1 || 0
          )
        );
      }, [cash]);

    const cashFromTill =
      cashCounted -
      OPENING_CASH;

    const totalCashSales =
      Number(
        cashFromTill || 0
      ) +
      udhaarSales;

    const digitalSales =
      Number(
        form.upi_sales || 0
      ) +
      Number(
        form.card_sales || 0
      );

    const totalSales =
      totalCashSales +
      digitalSales +
      totalExpenses;

    const salesDifference =
      totalSales -
      Number(
        form.system_sales || 0
      );

    function handleChange(e) {
      const {
        name,
        value,
      } = e.target;

      setForm(
        (prev) => ({
          ...prev,

          [name]:
            normalizeNumberInput(
              value
            ),
        })
      );
    }

    function handleCashChange(
      name,
      value
    ) {
      setCash(
        (prev) => ({
          ...prev,

          [name]:
            normalizeNumberInput(
              value
            ),
        })
      );
    }

    function handleCashKeyDown(
      e,
      index
    ) {
      if (
        e.key !== "Enter"
      ) {
        return;
      }

      e.preventDefault();

      denominationRefs.current[
        index + 1
      ]?.focus();
    }

    async function handleSave() {
      if (
        !report ||
        report.is_locked
      ) {
        return;
      }

      await paymentMachineEntryService.save({
        daily_report_id:
          report.id,

        entries:
          machineEntries.map(
            (item) => ({
              machine_id:
                item.machine_id,

              amount:
                Number(
                  item.amount || 0
                ),
            })
          ),
      });

      await cashDenominationService.save({
        daily_report_id:
          report.id,

        note_500:
          Number(
            cash.note_500 || 0
          ),

        note_200:
          Number(
            cash.note_200 || 0
          ),

        note_100:
          Number(
            cash.note_100 || 0
          ),

        note_50:
          Number(
            cash.note_50 || 0
          ),

        note_20:
          Number(
            cash.note_20 || 0
          ),

        note_10:
          Number(
            cash.note_10 || 0
          ),

        coin_5:
          Number(
            cash.coin_5 || 0
          ),

        coin_2:
          Number(
            cash.coin_2 || 0
          ),

        coin_1:
          Number(
            cash.coin_1 || 0
          ),
      });

      await dailyReportsService.updateSales(
        report.id,
        {
          total_bills:
            Number(
              form.total_bills || 0
            ),

          cash_sales:
            Number(
              cashFromTill || 0
            ),

          upi_sales:
            machineEntries.reduce(
              (
                sum,
                item
              ) =>
                sum +
                Number(
                  item.amount || 0
                ),
              0
            ),

          card_sales:
            0,

          udhaar_sales:
            udhaarSales,

          system_sales:
            Number(
              form.system_sales || 0
            ),
        }
      );

      await dailyReportsService.updateDeliveries(
        report.id,
        Number(
          deliveries || 0
        )
      );

      await refreshReport();
    }

    useImperativeHandle(
      ref,
      () => ({
        save:
          handleSave,
      }),
      [
        report,
        machineEntries,
        cash,
        form,
        deliveries,
        cashFromTill,
        udhaarSales,
        refreshReport,
      ]
    );

    if (!report) {
      return null;
    }

    const denominations = [
      [
        "note_500",
        "₹500",
      ],
      [
        "note_200",
        "₹200",
      ],
      [
        "note_100",
        "₹100",
      ],
      [
        "note_50",
        "₹50",
      ],
      [
        "note_20",
        "₹20",
      ],
      [
        "note_10",
        "₹10",
      ],
      [
        "coin_5",
        "₹5",
      ],
      [
        "coin_2",
        "₹2",
      ],
      [
        "coin_1",
        "₹1",
      ],
    ];


    /* =========================================================
       MOBILE
    ========================================================= */

    if (mobile) {

      const collectionsComplete =
        cashCounted > 0 ||
        machineEntries.some(
          (entry) =>
            Number(
              entry.amount || 0
            ) > 0
        );

      const operationsComplete =
        Number(
          form.total_bills || 0
        ) > 0 ||
        Number(
          deliveries || 0
        ) > 0;

      const reconciliationComplete =
        Number(
          form.system_sales || 0
        ) > 0;

      const reviewComplete =
        report.is_locked;

      const sections = [
        {
          id: "collections",
          number: "01",
          title:
            "Collections & Payments",
          subtitle:
            "Record cash and digital collections.",
          icon: Banknote,
          iconClass:
            "bg-blue-50 text-blue-600",
          complete:
            collectionsComplete,
        },

        {
          id: "operations",
          number: "02",
          title:
            "Daily Operations",
          subtitle:
            "Record today's bills and deliveries.",
          icon: ClipboardCheck,
          iconClass:
            "bg-violet-50 text-violet-600",
          complete:
            operationsComplete,
        },

        {
          id: "reconciliation",
          number: "03",
          title:
            "Reconciliation",
          subtitle:
            "Compare actual sales with system sales.",
          icon: ShieldCheck,
          iconClass:
            "bg-orange-50 text-orange-600",
          complete:
            reconciliationComplete,
        },

        {
          id: "review",
          number: "04",
          title:
            "Review & Submit",
          subtitle:
            "Check everything before locking.",
          icon: CheckCircle2,
          iconClass:
            "bg-green-50 text-green-600",
          complete:
            reviewComplete,
        },
      ];

      function toggleSection(id) {
        setMobileSection(
          (current) =>
            current === id
              ? null
              : id
        );
      }

      return (
        <div className="space-y-3">

          {sections.map(
            (section) => {

              const Icon =
                section.icon;

              const isOpen =
                mobileSection ===
                section.id;

              return (
                <div
                  key={section.id}
                  className={`overflow-hidden rounded-2xl border bg-white shadow-sm ${
                    isOpen
                      ? "border-blue-200"
                      : "border-gray-200"
                  }`}
                >

                  {/* SECTION HEADER */}

                  <button
                    type="button"
                    onClick={() =>
                      toggleSection(
                        section.id
                      )
                    }
                    className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
                  >

                    <span className="w-5 shrink-0 text-xs font-semibold tracking-wide text-blue-600">
                      {section.number}
                    </span>

                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${section.iconClass}`}
                    >
                      <Icon size={18} />
                    </div>

                    <div className="min-w-0 flex-1">

                      <div className="flex items-center gap-1.5">

                        <h2 className="text-[15px] font-bold text-gray-900">
                          {section.title}
                        </h2>

                        {section.complete && (
                          <CheckCircle2
                            size={15}
                            className="shrink-0 text-green-500"
                          />
                        )}

                      </div>

                      <p className="mt-0.5 text-[11px] leading-4 text-gray-500">
                        {section.subtitle}
                      </p>

                    </div>

                    {isOpen ? (
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


                  {/* =================================================
                      SECTION CONTENT
                  ================================================= */}

                  {isOpen && (
                    <div className="border-t border-gray-100 px-3.5 pb-3.5 pt-3.5">


                      {/* =================================================
                          01 COLLECTIONS & PAYMENTS
                      ================================================= */}

                      {section.id ===
                        "collections" && (

                        <div className="space-y-3">

                          {/* CASH */}

                          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-3.5">

                            <div className="flex items-center gap-3">

                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-100">

                                <Banknote
                                  size={18}
                                  className="text-green-600"
                                />

                              </div>

                              <div className="min-w-0">

                                <h3 className="text-[15px] font-bold text-gray-900">
                                  Cash Collection
                                </h3>

                                <p className="text-[11px] text-gray-500">
                                  Count today's cash
                                </p>

                              </div>

                            </div>


                            <div className="mt-3 rounded-xl bg-white px-3 py-2">

                              <p className="text-[10px] text-gray-400">
                                Opening Cash
                              </p>

                              <p className="text-sm font-semibold text-gray-800">
                                ₹
                                {OPENING_CASH.toLocaleString(
                                  "en-IN"
                                )}
                              </p>

                            </div>


                            <div className="mt-2.5 grid grid-cols-2 gap-2">

                              {denominations.map(
                                (
                                  [
                                    key,
                                    label,
                                  ],
                                  index
                                ) => (

                                  <div
                                    key={key}
                                    className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-2.5 py-2"
                                  >

                                    <span className="text-xs font-semibold text-gray-700">
                                      {label}
                                    </span>

                                    <input
                                      ref={(el) =>
                                        (denominationRefs.current[
                                          index
                                        ] = el)
                                      }
                                      type="number"
                                      min="0"
                                      value={
                                        cash[
                                          key
                                        ]
                                      }
                                      disabled={
                                        report.is_locked
                                      }
                                      onChange={(e) =>
                                        handleCashChange(
                                          key,
                                          e
                                            .target
                                            .value
                                        )
                                      }
                                      onKeyDown={(e) =>
                                        handleCashKeyDown(
                                          e,
                                          index
                                        )
                                      }
                                      onWheel={
                                        handleNumberWheel
                                      }
                                      className={`${NUMBER_INPUT_CLASS} h-8 w-[52px] rounded-lg border border-gray-200 px-1 text-center text-xs font-semibold outline-none focus:border-blue-500 disabled:bg-gray-100`}
                                      placeholder="0"
                                    />

                                  </div>

                                )
                              )}

                            </div>


                            <div className="mt-2.5 flex items-center justify-between rounded-xl bg-blue-50 px-3 py-2.5">

                              <span className="text-xs font-semibold text-blue-700">
                                Cash Counted
                              </span>

                              <span className="text-base font-bold text-blue-600">
                                ₹
                                {cashCounted.toLocaleString(
                                  "en-IN"
                                )}
                              </span>

                            </div>

                          </div>


                          {/* DIGITAL PAYMENTS */}

                          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-3.5">

                            <div className="mb-3 flex items-center justify-between gap-3">

                              <div className="flex items-center gap-3">

                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100">

                                  <CreditCard
                                    size={18}
                                    className="text-blue-600"
                                  />

                                </div>

                                <div>

                                  <h3 className="text-[15px] font-bold text-gray-900">
                                    Digital Payments
                                  </h3>

                                  <p className="text-[11px] text-gray-500">
                                    UPI / Card collections
                                  </p>

                                </div>

                              </div>

                            </div>

                            <div className="rounded-xl bg-white p-3">

                              <PaymentMachines
                                reportId={
                                  report.id
                                }
                                onTotalChange={
                                  handleMachineTotal
                                }
                                onMachinesChange={
                                  setMachineEntries
                                }
                              />

                            </div>

                          </div>


                          {/* COLLECTION SUMMARY */}

                          <div className="grid grid-cols-2 gap-2">

                            <div className="rounded-xl border border-gray-200 bg-white p-3">

                              <p className="text-[10px] text-gray-400">
                                Cash from Till
                              </p>

                              <p className="mt-1 text-base font-bold text-gray-900">
                                ₹
                                {cashFromTill.toLocaleString(
                                  "en-IN"
                                )}
                              </p>

                            </div>

                            <div className="rounded-xl border border-green-100 bg-green-50 p-3">

                              <p className="text-[10px] text-green-700">
                                Total Cash Sales
                              </p>

                              <p className="mt-1 text-base font-bold text-green-600">
                                ₹
                                {totalCashSales.toLocaleString(
                                  "en-IN"
                                )}
                              </p>

                            </div>

                          </div>

                        </div>
                      )}


                      {/* =================================================
                          02 DAILY OPERATIONS
                      ================================================= */}

                      {section.id ===
                        "operations" && (

                        <div className="space-y-3">

                          {/* INPUTS */}

                          <div className="grid grid-cols-2 gap-2.5">

                            {/* BILLS */}

                            <div className="rounded-2xl border border-gray-200 bg-white p-3.5">

                              <div className="flex items-center gap-2">

                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">

                                  <Receipt
                                    size={16}
                                    className="text-blue-600"
                                  />

                                </div>

                                <p className="text-xs font-semibold text-gray-700">
                                  Total Bills
                                </p>

                              </div>

                              <input
                                name="total_bills"
                                type="number"
                                min="0"
                                value={
                                  form.total_bills
                                }
                                disabled={
                                  report.is_locked
                                }
                                onChange={
                                  handleChange
                                }
                                onWheel={
                                  handleNumberWheel
                                }
                                className={`${NUMBER_INPUT_CLASS} mt-3 h-10 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm font-semibold outline-none focus:border-blue-500 disabled:bg-gray-100`}
                                placeholder="0"
                              />

                            </div>


                            {/* DELIVERIES */}

                            <div className="rounded-2xl border border-gray-200 bg-white p-3.5">

                              <div className="flex items-center gap-2">

                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50">

                                  <Truck
                                    size={16}
                                    className="text-violet-600"
                                  />

                                </div>

                                <p className="text-xs font-semibold text-gray-700">
                                  Deliveries
                                </p>

                              </div>

                              <input
                                type="number"
                                min="0"
                                value={
                                  deliveries
                                }
                                disabled={
                                  report.is_locked
                                }
                                onChange={(e) =>
                                  setDeliveries(
                                    normalizeNumberInput(
                                      e
                                        .target
                                        .value
                                    )
                                  )
                                }
                                onWheel={
                                  handleNumberWheel
                                }
                                className={`${NUMBER_INPUT_CLASS} mt-3 h-10 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm font-semibold outline-none focus:border-blue-500 disabled:bg-gray-100`}
                                placeholder="0"
                              />

                            </div>

                          </div>


                          {/* PURCHASES + EXPENSES */}

                          <div className="rounded-2xl border border-gray-200 bg-white p-3.5">

                            <div className="mb-3">

                              <h3 className="text-[15px] font-bold text-gray-900">
                                Today's Activity
                              </h3>

                              <p className="mt-0.5 text-[11px] text-gray-500">
                                Automatically pulled from the store records.
                              </p>

                            </div>

                            <div className="grid grid-cols-2 gap-2">

                              <div className="rounded-xl bg-gray-50 p-3">

                                <div className="flex items-center gap-2">

                                  <ShoppingBag
                                    size={15}
                                    className="text-blue-600"
                                  />

                                  <p className="text-[11px] font-medium text-gray-500">
                                    Purchases
                                  </p>

                                </div>

                                <p className="mt-1 text-base font-bold text-gray-900">
                                  ₹
                                  {totalPurchases.toLocaleString(
                                    "en-IN"
                                  )}
                                </p>

                              </div>


                              <div className="rounded-xl bg-gray-50 p-3">

                                <div className="flex items-center gap-2">

                                  <Wallet
                                    size={15}
                                    className="text-orange-500"
                                  />

                                  <p className="text-[11px] font-medium text-gray-500">
                                    Expenses
                                  </p>

                                </div>

                                <p className="mt-1 text-base font-bold text-gray-900">
                                  ₹
                                  {totalExpenses.toLocaleString(
                                    "en-IN"
                                  )}
                                </p>

                              </div>

                            </div>

                          </div>

                        </div>
                      )}


                      {/* =================================================
                          03 RECONCILIATION
                      ================================================= */}

                      {section.id ===
                        "reconciliation" && (

                        <div className="space-y-2.5">

                          {/* COMPACT SUMMARY */}

                          <div className="grid grid-cols-2 gap-2">

                            <div className="rounded-xl bg-blue-50 px-3.5 py-3">

                              <p className="text-[10px] font-medium text-blue-600">
                                Calculated Sales
                              </p>

                              <p className="mt-0.5 text-lg font-bold text-blue-600">
                                ₹
                                {totalSales.toLocaleString(
                                  "en-IN"
                                )}
                              </p>

                            </div>


                            <div
                              className={`rounded-xl px-3.5 py-3 ${
                                salesDifference === 0
                                  ? "bg-green-50"
                                  : "bg-red-50"
                              }`}
                            >

                              <p
                                className={`text-[10px] font-medium ${
                                  salesDifference === 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                Difference
                              </p>

                              <p
                                className={`mt-0.5 text-lg font-bold ${
                                  salesDifference === 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                ₹
                                {salesDifference.toLocaleString(
                                  "en-IN"
                                )}
                              </p>

                            </div>

                          </div>


                          {/* SYSTEM SALES */}

                          <div className="rounded-xl border border-gray-200 bg-white p-3.5">

                            <div className="flex items-center justify-between gap-3">

                              <label className="text-xs font-semibold text-gray-700">
                                System Sales Today
                              </label>

                              {salesDifference ===
                                0 && (
                                <CheckCircle2
                                  size={16}
                                  className="text-green-500"
                                />
                              )}

                            </div>

                            <input
                              name="system_sales"
                              type="number"
                              min="0"
                              value={
                                form.system_sales
                              }
                              disabled={
                                report.is_locked
                              }
                              onChange={
                                handleChange
                              }
                              onWheel={
                                handleNumberWheel
                              }
                              className={`${NUMBER_INPUT_CLASS} mt-2.5 h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm font-semibold outline-none focus:border-blue-500 disabled:bg-gray-100`}
                              placeholder="Enter system sales"
                            />

                          </div>


                          {/* EXPLANATION */}

                          <div
                            className={`rounded-xl px-3.5 py-2.5 ${
                              salesDifference === 0
                                ? "bg-green-50"
                                : "bg-red-50"
                            }`}
                          >

                            <p
                              className={`text-[10px] ${
                                salesDifference === 0
                                  ? "text-green-700"
                                  : "text-red-700"
                              }`}
                            >
                              Actual Sales − System Sales
                            </p>

                          </div>

                        </div>
                      )}


                      {/* =================================================
                          04 REVIEW
                      ================================================= */}

                      {section.id ===
                        "review" && (

                        <div className="space-y-2.5">

                          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-3.5">

                            <div className="flex items-center justify-between">

                              <span className="text-xs text-gray-500">
                                Total Sales
                              </span>

                              <span className="text-sm font-bold text-gray-900">
                                ₹
                                {totalSales.toLocaleString(
                                  "en-IN"
                                )}
                              </span>

                            </div>

                            <div className="mt-2.5 flex items-center justify-between">

                              <span className="text-xs text-gray-500">
                                Total Bills
                              </span>

                              <span className="text-sm font-semibold text-gray-900">
                                {form.total_bills ||
                                  0}
                              </span>

                            </div>

                            <div className="mt-2.5 flex items-center justify-between">

                              <span className="text-xs text-gray-500">
                                Deliveries
                              </span>

                              <span className="text-sm font-semibold text-gray-900">
                                {deliveries ||
                                  0}
                              </span>

                            </div>

                            <div className="mt-2.5 flex items-center justify-between">

                              <span className="text-xs text-gray-500">
                                Difference
                              </span>

                              <span
                                className={`text-sm font-bold ${
                                  salesDifference ===
                                  0
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                ₹
                                {salesDifference.toLocaleString(
                                  "en-IN"
                                )}
                              </span>

                            </div>

                          </div>


                          <div
                            className={`rounded-xl px-3.5 py-3 ${
                              report.is_locked
                                ? "bg-green-50"
                                : "bg-amber-50"
                            }`}
                          >

                            <p
                              className={`text-xs font-semibold ${
                                report.is_locked
                                  ? "text-green-700"
                                  : "text-amber-700"
                              }`}
                            >
                              {report.is_locked
                                ? "Report is locked"
                                : "Ready for submission"}
                            </p>

                            <p
                              className={`mt-0.5 text-[10px] ${
                                report.is_locked
                                  ? "text-green-700/70"
                                  : "text-amber-700/70"
                              }`}
                            >
                              {report.is_locked
                                ? "This report has already been submitted."
                                : "Review the information before submitting."}
                            </p>

                          </div>

                        </div>
                      )}

                    </div>
                  )}

                </div>
              );
            }
          )}

        </div>
      );
    }


    /* =========================================================
       DESKTOP UI
       ========================================================= */

    return (
      <SectionCard title="Sales">

        <div className="space-y-6">

          {/* CASH */}

          <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">

            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100">

                  <Banknote
                    size={19}
                    className="text-green-600"
                  />

                </div>

                <div>

                  <h3 className="text-base font-semibold text-gray-900">
                    Cash Collection
                  </h3>

                  <p className="text-sm text-gray-500">
                    Count today's cash and separate the opening
                    balance.
                  </p>

                </div>

              </div>

              <span className="w-fit rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                Opening Cash ₹
                {OPENING_CASH.toLocaleString(
                  "en-IN"
                )}
              </span>

            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">

              {denominations.map(
                (
                  [
                    key,
                    label,
                  ],
                  index
                ) => (

                  <div
                    key={key}
                    className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2"
                  >

                    <span className="text-sm font-semibold text-gray-700">
                      {label}
                    </span>

                    <input
                      ref={(el) =>
                        (denominationRefs.current[
                          index
                        ] = el)
                      }
                      type="number"
                      min="0"
                      value={
                        cash[key]
                      }
                      disabled={
                        report.is_locked
                      }
                      onChange={(e) =>
                        handleCashChange(
                          key,
                          e.target.value
                        )
                      }
                      onKeyDown={(e) =>
                        handleCashKeyDown(
                          e,
                          index
                        )
                      }
                      onWheel={
                        handleNumberWheel
                      }
                      className={`${NUMBER_INPUT_CLASS} h-8 w-14 rounded-lg border border-gray-200 bg-white px-1 text-center text-sm font-medium outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100`}
                    />

                  </div>

                )
              )}

            </div>

            <div className="mt-4 grid grid-cols-2 gap-2.5 lg:grid-cols-4">

              <div className="rounded-xl border border-blue-100 bg-blue-50 px-3 py-3">

                <p className="text-xs font-medium text-blue-700">
                  Cash Counted
                </p>

                <p className="mt-1 text-lg font-bold text-blue-600">
                  ₹
                  {cashCounted.toLocaleString(
                    "en-IN"
                  )}
                </p>

              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-3">

                <p className="text-xs font-medium text-gray-600">
                  Cash from Till
                </p>

                <p className="mt-1 text-lg font-bold text-gray-900">
                  ₹
                  {cashFromTill.toLocaleString(
                    "en-IN"
                  )}
                </p>

                <p className="text-[11px] text-gray-500">
                  After opening cash
                </p>

              </div>

              <div className="rounded-xl border border-yellow-100 bg-yellow-50 px-3 py-3">

                <p className="text-xs font-medium text-yellow-700">
                  Udhaar
                </p>

                <p className="mt-1 text-lg font-bold text-yellow-700">
                  ₹
                  {udhaarSales.toLocaleString(
                    "en-IN"
                  )}
                </p>

                <p className="text-[11px] text-yellow-700/70">
                  Current outstanding
                </p>

              </div>

              <div className="rounded-xl border border-green-100 bg-green-50 px-3 py-3">

                <p className="text-xs font-medium text-green-700">
                  Total Cash Sales
                </p>

                <p className="mt-1 text-lg font-bold text-green-600">
                  ₹
                  {totalCashSales.toLocaleString(
                    "en-IN"
                  )}
                </p>

                <p className="text-[11px] text-green-700/70">
                  Cash + Udhaar
                </p>

              </div>

            </div>

          </div>


          {/* DIGITAL PAYMENTS */}

          <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">

            <div className="mb-4 flex items-center gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100">

                <CreditCard
                  size={19}
                  className="text-blue-600"
                />

              </div>

              <div>

                <h3 className="text-base font-semibold text-gray-900">
                  UPI / Card Payments
                </h3>

                <p className="text-sm text-gray-500">
                  Record today's digital collections.
                </p>

              </div>

            </div>

            <PaymentMachines
              reportId={
                report.id
              }
              onTotalChange={
                handleMachineTotal
              }
              onMachinesChange={
                setMachineEntries
              }
            />

          </div>


          {/* OPERATIONS */}

          <div>

            <div className="mb-3">

              <h3 className="text-base font-semibold text-gray-900">
                Daily Operations
              </h3>

              <p className="text-sm text-gray-500">
                Review today's operational figures and enter
                the remaining values.
              </p>

            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">

                <div className="flex items-center justify-between gap-3">

                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100">

                      <ShoppingBag
                        size={17}
                        className="text-blue-600"
                      />

                    </div>

                    <div>

                      <p className="text-xs font-medium text-gray-500">
                        Purchases
                      </p>

                      <p className="mt-0.5 text-sm text-gray-500">
                        Read only
                      </p>

                    </div>

                  </div>

                  <p className="text-lg font-bold text-gray-900">
                    ₹
                    {totalPurchases.toLocaleString(
                      "en-IN"
                    )}
                  </p>

                </div>

              </div>


              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">

                <div className="flex items-center justify-between gap-3">

                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-100">

                      <Wallet
                        size={17}
                        className="text-orange-600"
                      />

                    </div>

                    <div>

                      <p className="text-xs font-medium text-gray-500">
                        Expenses
                      </p>

                      <p className="mt-0.5 text-sm text-gray-500">
                        Read only
                      </p>

                    </div>

                  </div>

                  <p className="text-lg font-bold text-gray-900">
                    ₹
                    {totalExpenses.toLocaleString(
                      "en-IN"
                    )}
                  </p>

                </div>

              </div>


              <div className="rounded-xl border border-gray-200 bg-white p-4">

                <div className="mb-2 flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100">

                    <Truck
                      size={17}
                      className="text-violet-600"
                    />

                  </div>

                  <div>

                    <p className="text-sm font-semibold text-gray-900">
                      Deliveries
                    </p>

                    <p className="text-xs text-gray-500">
                      Completed today
                    </p>

                  </div>

                </div>

                <input
                  type="number"
                  min="0"
                  value={
                    deliveries
                  }
                  disabled={
                    report.is_locked
                  }
                  onChange={(e) =>
                    setDeliveries(
                      normalizeNumberInput(
                        e.target.value
                      )
                    )
                  }
                  onWheel={
                    handleNumberWheel
                  }
                  className={`${NUMBER_INPUT_CLASS} h-10 w-full rounded-lg border border-gray-200 px-3 text-sm font-medium outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100`}
                  placeholder="Enter deliveries"
                />

              </div>


              <div className="rounded-xl border border-gray-200 bg-white p-4">

                <div className="mb-2 flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100">

                    <Receipt
                      size={17}
                      className="text-indigo-600"
                    />

                  </div>

                  <div>

                    <p className="text-sm font-semibold text-gray-900">
                      Total Bills
                    </p>

                    <p className="text-xs text-gray-500">
                      Bills generated today
                    </p>

                  </div>

                </div>

                <input
                  name="total_bills"
                  type="number"
                  min="0"
                  value={
                    form.total_bills
                  }
                  disabled={
                    report.is_locked
                  }
                  onChange={
                    handleChange
                  }
                  onWheel={
                    handleNumberWheel
                  }
                  className={`${NUMBER_INPUT_CLASS} h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100`}
                  placeholder="Enter total bills"
                />

              </div>

            </div>

          </div>


          {/* RECONCILIATION */}

          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:p-5">

            <div className="mb-5">

              <h3 className="text-lg font-semibold text-gray-900">
                Sales Reconciliation
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Compare the day's calculated sales with the
                sales recorded in the system.
              </p>

            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">

              <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">

                <p className="text-sm font-medium text-blue-700">
                  Total Sales
                </p>

                <p className="mt-1 text-2xl font-bold text-blue-600">
                  ₹
                  {totalSales.toLocaleString(
                    "en-IN"
                  )}
                </p>

                <p className="mt-1 text-xs text-blue-700/70">
                  Cash + UPI + Card + Expenses
                </p>

              </div>


              <div className="rounded-xl border border-gray-200 bg-white p-4">

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  System Sales Today
                </label>

                <input
                  name="system_sales"
                  type="number"
                  min="0"
                  value={
                    form.system_sales
                  }
                  disabled={
                    report.is_locked
                  }
                  onChange={
                    handleChange
                  }
                  onWheel={
                    handleNumberWheel
                  }
                  className={`${NUMBER_INPUT_CLASS} h-11 w-full rounded-lg border border-gray-200 px-3 text-base font-semibold outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100`}
                  placeholder="Enter system sales"
                />

              </div>


              <div
                className={`rounded-xl border p-4 ${
                  salesDifference === 0
                    ? "border-green-200 bg-green-50"
                    : "border-red-200 bg-red-50"
                }`}
              >

                <p
                  className={`text-sm font-medium ${
                    salesDifference === 0
                      ? "text-green-700"
                      : "text-red-700"
                  }`}
                >
                  Difference
                </p>

                <p
                  className={`mt-1 text-2xl font-bold ${
                    salesDifference === 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  ₹
                  {salesDifference.toLocaleString(
                    "en-IN"
                  )}
                </p>

                <p
                  className={`mt-1 text-xs ${
                    salesDifference === 0
                      ? "text-green-700/70"
                      : "text-red-700/70"
                  }`}
                >
                  Actual Sales − System Sales
                </p>

              </div>

            </div>

          </div>

        </div>

      </SectionCard>
    );
  }
);

export default SalesSection;