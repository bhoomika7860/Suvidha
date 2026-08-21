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
  Wallet,
  ShoppingBag,
  Receipt,
  Truck,
  Banknote,
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

    const denominationRefs =
      useRef([]);

    /*
     * Udhaar remains read-only.
     *
     * It is calculated by the backend and
     * returned as part of the current report.
     */
    const udhaarSales =
      Number(
        report?.udhaar_sales || 0
      );

    /*
     * Expenses and purchases are also
     * read-only here.
     *
     * They are already calculated by the
     * report endpoint.
     */
    const totalExpenses =
      Number(
        report?.total_expenses || 0
      );

    const totalPurchases =
      Number(
        report?.total_purchases || 0
      );

    /*
     * Payment machine total.
     *
     * Existing PaymentMachines component
     * continues to control this value.
     */
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

    /*
     * Load all existing values for this
     * daily report.
     */
    useEffect(() => {
      if (!report?.id) {
        return;
      }

      let cancelled = false;

      async function loadSection() {
        try {
          /*
           * Cash denominations
           */
          const savedCash =
            await cashDenominationService.get(
              report.id
            );

          if (cancelled) {
            return;
          }

          /*
           * Existing report values.
           */
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

          /*
           * Deliveries
           */
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

          /*
           * Restore saved cash
           * denomination values.
           */
          if (savedCash) {
            setCash({
  note_500:
    Number(savedCash.note_500 || 0) > 0
      ? String(savedCash.note_500)
      : "",

  note_200:
    Number(savedCash.note_200 || 0) > 0
      ? String(savedCash.note_200)
      : "",

  note_100:
    Number(savedCash.note_100 || 0) > 0
      ? String(savedCash.note_100)
      : "",

  note_50:
    Number(savedCash.note_50 || 0) > 0
      ? String(savedCash.note_50)
      : "",

  note_20:
    Number(savedCash.note_20 || 0) > 0
      ? String(savedCash.note_20)
      : "",

  note_10:
    Number(savedCash.note_10 || 0) > 0
      ? String(savedCash.note_10)
      : "",

  coin_5:
    Number(savedCash.coin_5 || 0) > 0
      ? String(savedCash.coin_5)
      : "",

  coin_2:
    Number(savedCash.coin_2 || 0) > 0
      ? String(savedCash.coin_2)
      : "",

  coin_1:
    Number(savedCash.coin_1 || 0) > 0
      ? String(savedCash.coin_1)
      : "",
});
          } else {
            setCash(
              EMPTY_CASH
            );
          }

          /*
           * Restore payment machine
           * entries.
           */
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

    /*
     * CASH CALCULATIONS
     */

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

    /*
     * Cash physically generated from
     * today's operations.
     *
     * Opening cash is not today's sales.
     */
    const cashFromTill =
      cashCounted -
      OPENING_CASH;

    /*
     * Total cash sales include:
     *
     * Cash from Till + Udhaar
     */
    const totalCashSales =
      Number(
        cashFromTill || 0
      ) +
      udhaarSales;

    /*
     * Digital collection.
     */
    const digitalSales =
      Number(
        form.upi_sales || 0
      ) +
      Number(
        form.card_sales || 0
      );

    /*
     * Total Sales:
     *
     * Total Cash Sales
     * + UPI
     * + Card
     * + Expenses
     *
     * Purchases are deliberately NOT included.
     */
    const totalSales =
      totalCashSales +
      digitalSales +
      totalExpenses;

    /*
     * Difference:
     *
     * Actual Sales - System Sales
     */
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

      /*
       * Save payment machines.
       */
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

      /*
       * Save cash denominations.
       */
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

      /*
       * Save Sales.
       *
       * Existing backend logic is preserved.
       */
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

      /*
       * Save Deliveries.
       *
       * This uses the same existing
       * backend endpoint previously used
       * by DeliverySection.
       */
      await dailyReportsService.updateDeliveries(
        report.id,
        Number(
          deliveries || 0
        )
      );

      /*
       * Reload the report after everything
       * has been persisted.
       */
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

    return (
      <SectionCard title="Sales">

        <div className="space-y-6">

          {/* =================================================
              CASH DENOMINATIONS
          ================================================= */}

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

            {/* DENOMINATIONS */}

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
                      onChange={(
                        e
                      ) =>
                        handleCashChange(
                          key,
                          e.target
                            .value
                        )
                      }
                      onKeyDown={(
                        e
                      ) =>
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

            {/* CASH SUMMARY */}

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

          {/* =================================================
              DIGITAL PAYMENTS
          ================================================= */}

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

          {/* =================================================
              OPERATIONS
          ================================================= */}

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

              {/* PURCHASES */}

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

              {/* EXPENSES */}

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

              {/* DELIVERIES */}

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

              {/* TOTAL BILLS */}

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
                  onChange={handleChange}
                  onWheel={
                    handleNumberWheel
                  }
                  className={`${NUMBER_INPUT_CLASS} h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100`}
                  placeholder="Enter total bills"
                />

              </div>

            </div>

          </div>

          {/* =================================================
              SALES RECONCILIATION
          ================================================= */}

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

              {/* TOTAL SALES */}

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

              {/* SYSTEM SALES */}

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

              {/* DIFFERENCE */}

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