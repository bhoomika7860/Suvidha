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

function normalizeNumberInput(
  value
) {
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

const SalesSection =
  forwardRef(
    function SalesSection(
      {
        report,
        refreshReport,
      },
      ref
    ) {
      const [form, setForm] =
        useState({
          total_bills: "",
          cash_sales: "",
          upi_sales: "",
          card_sales: "",
          total_expenses: "",
          system_sales: "",
        });

      const [
        machineEntries,
        setMachineEntries,
      ] = useState([]);

      const [
        cash,
        setCash,
      ] = useState(
        EMPTY_CASH
      );

      const denominationRefs =
        useRef([]);

      /*
       * Udhaar is read-only here.
       *
       * It comes from the current
       * daily report.
       */
      const udhaarSales =
        Number(
          report?.udhaar_sales ||
            0
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

        let cancelled =
          false;

        async function loadSection() {
          try {

            /*
             * Load saved cash denominations.
             */
            const savedCash =
              await cashDenominationService.get(
                report.id
              );

            if (
              cancelled
            ) {
              return;
            }

            /*
             * Always load the report's
             * current values.
             */
            setForm({
              total_bills:
                report.total_bills !=
                null
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
             * Restore saved cash
             * denomination values.
             */
            if (savedCash) {
              setCash({
                note_500:
                  savedCash.note_500 !=
                  null
                    ? String(
                        savedCash.note_500
                      )
                    : "",

                note_200:
                  savedCash.note_200 !=
                  null
                    ? String(
                        savedCash.note_200
                      )
                    : "",

                note_100:
                  savedCash.note_100 !=
                  null
                    ? String(
                        savedCash.note_100
                      )
                    : "",

                note_50:
                  savedCash.note_50 !=
                  null
                    ? String(
                        savedCash.note_50
                      )
                    : "",

                note_20:
                  savedCash.note_20 !=
                  null
                    ? String(
                        savedCash.note_20
                      )
                    : "",

                note_10:
                  savedCash.note_10 !=
                  null
                    ? String(
                        savedCash.note_10
                      )
                    : "",

                coin_5:
                  savedCash.coin_5 !=
                  null
                    ? String(
                        savedCash.coin_5
                      )
                    : "",

                coin_2:
                  savedCash.coin_2 !=
                  null
                    ? String(
                        savedCash.coin_2
                      )
                    : "",

                coin_1:
                  savedCash.coin_1 !=
                  null
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

            /*
             * Restore saved payment
             * machine amounts.
             */
            const machineData =
              await paymentMachineEntryService.get(
                report.id
              );

            if (
              cancelled
            ) {
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

            if (
              !cancelled
            ) {
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
              cash.note_500 ||
                0
            ) * 500 +

            Number(
              cash.note_200 ||
                0
            ) * 200 +

            Number(
              cash.note_100 ||
                0
            ) * 100 +

            Number(
              cash.note_50 ||
                0
            ) * 50 +

            Number(
              cash.note_20 ||
                0
            ) * 20 +

            Number(
              cash.note_10 ||
                0
            ) * 10 +

            Number(
              cash.coin_5 ||
                0
            ) * 5 +

            Number(
              cash.coin_2 ||
                0
            ) * 2 +

            Number(
              cash.coin_1 ||
                0
            )
          );

        }, [cash]);


      const calculatedCashSales =
        cashCounted -
        OPENING_CASH;


      const totalCashSales =
        Number(
          calculatedCashSales ||
            0
        ) +
        udhaarSales;


      const totalSales =
        totalCashSales +
        Number(
          form.upi_sales ||
            0
        ) +
        Number(
          form.card_sales ||
            0
        );


      const balance =
        totalSales -
        Number(
          form.system_sales ||
            0
        );


      function handleChange(
        e
      ) {
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
          e.key !==
          "Enter"
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
        await paymentMachineEntryService.save(
          {
            daily_report_id:
              report.id,

            entries:
              machineEntries.map(
                (item) => ({
                  machine_id:
                    item.machine_id,

                  amount:
                    Number(
                      item.amount ||
                        0
                    ),
                })
              ),
          }
        );

        /*
         * Save cash denominations.
         */
        await cashDenominationService.save(
          {
            daily_report_id:
              report.id,

            note_500:
              Number(
                cash.note_500 ||
                  0
              ),

            note_200:
              Number(
                cash.note_200 ||
                  0
              ),

            note_100:
              Number(
                cash.note_100 ||
                  0
              ),

            note_50:
              Number(
                cash.note_50 ||
                  0
              ),

            note_20:
              Number(
                cash.note_20 ||
                  0
              ),

            note_10:
              Number(
                cash.note_10 ||
                  0
              ),

            coin_5:
              Number(
                cash.coin_5 ||
                  0
              ),

            coin_2:
              Number(
                cash.coin_2 ||
                  0
              ),

            coin_1:
              Number(
                cash.coin_1 ||
                  0
              ),
          }
        );

        /*
         * Save report sales.
         *
         * Udhaar is read-only and comes
         * from the current report.
         */
        await dailyReportsService.updateSales(
          report.id,
          {
            total_bills:
              Number(
                form.total_bills ||
                  0
              ),

            cash_sales:
              Number(
                calculatedCashSales ||
                  0
              ),

            upi_sales:
              machineEntries.reduce(
                (
                  sum,
                  item
                ) =>
                  sum +
                  Number(
                    item.amount ||
                      0
                  ),
                0
              ),

            card_sales:
              0,

            udhaar_sales:
              udhaarSales,

            system_sales:
              Number(
                form.system_sales ||
                  0
              ),
          }
        );

        /*
         * Reload the saved values from
         * the backend after saving.
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
          calculatedCashSales,
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

          <div className="space-y-5">

            {/* CASH */}

            <div className="rounded-xl border p-5">

              <div className="mb-4 flex items-center justify-between">

                <div>

                  <h4 className="text-lg font-semibold text-gray-900">
                    Cash Denominations
                  </h4>

                  <p className="mt-1 text-base text-gray-500">
                    Count today's notes and coins.
                  </p>

                </div>

                <span className="text-base font-medium text-gray-500">
                  Opening: ₹
                  {OPENING_CASH.toLocaleString(
                    "en-IN"
                  )}
                </span>

              </div>


              <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3">

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
                      className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2.5"
                    >

                      <span className="text-base font-semibold text-gray-700">
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
                        className={`${NUMBER_INPUT_CLASS} h-9 w-16 rounded-lg border border-gray-200 bg-white px-1.5 text-center text-base font-medium outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100`}
                      />

                    </div>

                  )
                )}

              </div>


              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-4">

                {/* CASH COUNTED */}

                <div className="rounded-xl bg-blue-50 px-4 py-3">

                  <p className="text-base font-medium text-blue-700">
                    Cash Counted
                  </p>

                  <p className="mt-1 text-2xl font-bold text-blue-600">
                    ₹
                    {cashCounted.toLocaleString(
                      "en-IN"
                    )}
                  </p>

                </div>


                {/* PHYSICAL CASH SALES */}

                <div className="rounded-xl bg-gray-50 px-4 py-3">

                  <p className="text-base font-medium text-gray-500">
                    Physical Cash Sales
                  </p>

                  <p className="mt-1 text-2xl font-bold text-gray-900">
                    ₹
                    {calculatedCashSales.toLocaleString(
                      "en-IN"
                    )}
                  </p>

                </div>


                {/* UDHAAR */}

                <div className="rounded-xl bg-yellow-50 px-4 py-3">

                  <p className="text-base font-medium text-yellow-700">
                    Udhaar
                  </p>

                  <div className="mt-1 flex h-9 w-24 items-center rounded-lg border border-yellow-200 bg-white px-2 text-lg font-bold text-yellow-700">
                    ₹
                    {udhaarSales.toLocaleString(
                      "en-IN"
                    )}
                  </div>

                  <p className="mt-1 text-sm font-medium text-yellow-700/70">
                    Current Udhaar
                  </p>

                </div>


                {/* TOTAL CASH SALES */}

                <div className="rounded-xl bg-green-50 px-4 py-3">

                  <p className="text-base font-medium text-green-700">
                    Total Cash Sales
                  </p>

                  <p className="mt-1 text-2xl font-bold text-green-600">
                    ₹
                    {totalCashSales.toLocaleString(
                      "en-IN"
                    )}
                  </p>

                  <p className="mt-1 text-sm font-medium text-green-700/70">
                    Cash + Udhaar
                  </p>

                </div>

              </div>

            </div>


            {/* BILLS + SYSTEM */}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

              <div className="rounded-xl border p-4">

                <label className="mb-2 block text-base font-semibold text-gray-700">
                  Total Bills
                </label>

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
                  className={`${NUMBER_INPUT_CLASS} h-11 w-full rounded-lg border border-gray-200 px-3 text-base font-medium outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100`}
                />

              </div>


              <div className="rounded-xl border p-4">

                <label className="mb-2 block text-base font-semibold text-gray-700">
                  System Sales
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
                  className={`${NUMBER_INPUT_CLASS} h-11 w-full rounded-lg border border-gray-200 px-3 text-base font-medium outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100`}
                />

              </div>

            </div>


            {/* PAYMENT MACHINES */}

            <div className="rounded-xl border p-5">

              <div className="mb-4 flex items-center gap-3">

                <CreditCard
                  size={22}
                  className="text-blue-600"
                />

                <div>

                  <h4 className="text-lg font-semibold text-gray-900">
                    UPI / Card Payments
                  </h4>

                  <p className="text-base text-gray-500">
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


            {/* TOTAL */}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

              <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">

                <p className="text-base font-medium text-blue-700">
                  Total Sales
                </p>

                <p className="mt-1 text-3xl font-bold text-blue-600">
                  ₹
                  {totalSales.toLocaleString(
                    "en-IN"
                  )}
                </p>

                <p className="mt-1 text-base font-medium text-blue-700/70">
                  Total Cash Sales + UPI / Card
                </p>

              </div>


              <div className="rounded-xl border p-5">

                <p className="text-base font-medium text-gray-500">
                  Sales Difference
                </p>

                <p
                  className={`mt-1 text-3xl font-bold ${
                    balance === 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  ₹
                  {balance.toLocaleString(
                    "en-IN"
                  )}
                </p>

                <p className="mt-1 text-base font-medium text-gray-500">
                  Actual Sales − System Sales
                </p>

              </div>

            </div>

          </div>

        </SectionCard>
      );
    }
  );

export default SalesSection;