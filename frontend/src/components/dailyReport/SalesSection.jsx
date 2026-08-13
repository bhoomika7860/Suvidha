import {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";

import { CreditCard } from "lucide-react";

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

/*
 * Prevent values such as:
 *
 * 01864
 * 00100
 *
 * from appearing in numeric fields.
 *
 * Empty input remains empty.
 * A single zero remains zero.
 */
function normalizeNumberInput(value) {
  if (value === "") {
    return "";
  }

  return value.replace(
    /^0+(?=\d)/,
    ""
  );
}

export default function SalesSection({
  report,
  refreshReport,
}) {
  const [form, setForm] =
    useState({
      total_bills: "",
      cash_sales: "",
      upi_sales: "",
      card_sales: "",
      total_expenses: "",
      udhaar_sales: "",
      system_sales: "",
    });

  const [machineEntries, setMachineEntries] =
    useState([]);

  const [cash, setCash] =
    useState(EMPTY_CASH);

  const denominationRefs =
    useRef([]);

  const handleMachineTotal =
    useCallback(
      (total) => {
        setForm((prev) => ({
          ...prev,
          upi_sales:
            String(total || 0),
          card_sales: "0",
        }));
      },
      []
    );

  useEffect(() => {
    if (!report?.id) return;

    let cancelled = false;

    async function loadSection() {
      try {
        setCash(EMPTY_CASH);
        setMachineEntries([]);

        setForm({
          total_bills:
            report.total_bills != null
              ? String(
                  report.total_bills
                )
              : "",

          cash_sales:
            report.cash_sales != null
              ? String(
                  report.cash_sales
                )
              : "",

          upi_sales:
            report.upi_sales != null
              ? String(
                  report.upi_sales
                )
              : "",

          card_sales:
            report.card_sales != null
              ? String(
                  report.card_sales
                )
              : "",

          total_expenses:
            report.total_expenses != null
              ? String(
                  report.total_expenses
                )
              : "",

          udhaar_sales:
            report.udhaar_sales != null
              ? String(
                  report.udhaar_sales
                )
              : "0",

          system_sales:
            report.system_sales != null
              ? String(
                  report.system_sales
                )
              : "",
        });

        const savedCash =
          await cashDenominationService.get(
            report.id
          );

        if (cancelled) return;

        if (savedCash) {
          setCash({
            note_500:
              savedCash.note_500 != null
                ? String(
                    savedCash.note_500
                  )
                : "",

            note_200:
              savedCash.note_200 != null
                ? String(
                    savedCash.note_200
                  )
                : "",

            note_100:
              savedCash.note_100 != null
                ? String(
                    savedCash.note_100
                  )
                : "",

            note_50:
              savedCash.note_50 != null
                ? String(
                    savedCash.note_50
                  )
                : "",

            note_20:
              savedCash.note_20 != null
                ? String(
                    savedCash.note_20
                  )
                : "",

            note_10:
              savedCash.note_10 != null
                ? String(
                    savedCash.note_10
                  )
                : "",

            coin_5:
              savedCash.coin_5 != null
                ? String(
                    savedCash.coin_5
                  )
                : "",

            coin_2:
              savedCash.coin_2 != null
                ? String(
                    savedCash.coin_2
                  )
                : "",

            coin_1:
              savedCash.coin_1 != null
                ? String(
                    savedCash.coin_1
                  )
                : "",
          });
        }

        const machineData =
          await paymentMachineEntryService.get(
            report.id
          );

        if (cancelled) return;

        setMachineEntries(
          Array.isArray(machineData)
            ? machineData.map(
                (machine) => ({
                  machine_id:
                    machine.machine_id,

                  amount:
                    machine.amount != null
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

  const calculatedCashSales =
    cashCounted - OPENING_CASH;

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      cash_sales:
        String(
          calculatedCashSales || 0
        ),
    }));
  }, [calculatedCashSales]);

  const totalSales =
    useMemo(() => {
      return (
        Number(
          form.cash_sales || 0
        ) +

        Number(
          form.upi_sales || 0
        ) +

        Number(
          form.card_sales || 0
        ) +

        Number(
          form.total_expenses || 0
        ) +

        Number(
          form.udhaar_sales || 0
        )
      );
    }, [
      form.cash_sales,
      form.upi_sales,
      form.card_sales,
      form.total_expenses,
      form.udhaar_sales,
    ]);

  const balance =
    useMemo(() => {
      return (
        totalSales -
        Number(
          form.system_sales || 0
        )
      );
    }, [
      totalSales,
      form.system_sales,
    ]);

  function handleChange(e) {
    const {
      name,
      value,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        normalizeNumberInput(value),
    }));
  }

  function handleCashChange(
    name,
    value
  ) {
    setCash((prev) => ({
      ...prev,
      [name]:
        normalizeNumberInput(value),
    }));
  }

  function handleCashKeyDown(
    e,
    index
  ) {
    if (e.key !== "Enter") {
      return;
    }

    e.preventDefault();

    denominationRefs.current[
      index + 1
    ]?.focus();
  }

  async function handleSave() {
    try {
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
                    item.amount || 0
                  ),
              })
            ),
        }
      );

      await cashDenominationService.save(
        {
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
        }
      );

      await dailyReportsService.updateSales(
        report.id,
        {
          total_bills:
            Number(
              form.total_bills || 0
            ),

          cash_sales:
            Number(
              calculatedCashSales || 0
            ),

          upi_sales:
            machineEntries.reduce(
              (sum, item) =>
                sum +
                Number(
                  item.amount || 0
                ),
              0
            ),

          card_sales: 0,

          udhaar_sales:
            Number(
              form.udhaar_sales || 0
            ),

          system_sales:
            Number(
              form.system_sales || 0
            ),
        }
      );

      await refreshReport();

      alert(
        "Sales saved successfully."
      );

    } catch (err) {
      console.error(
        "Failed to save sales:",
        err
      );

      alert(
        err.response?.data?.detail ||
          "Failed to save sales."
      );
    }
  }

  if (!report) {
    return null;
  }

  const denominations = [
    ["note_500", "₹500"],
    ["note_200", "₹200"],
    ["note_100", "₹100"],
    ["note_50", "₹50"],
    ["note_20", "₹20"],
    ["note_10", "₹10"],
    ["coin_5", "₹5"],
    ["coin_2", "₹2"],
    ["coin_1", "₹1"],
  ];

  return (
    <SectionCard title="Sales">

      <div className="space-y-4">

        {/* CASH */}

        <div className="rounded-xl border p-4">

          <div className="mb-3 flex items-center justify-between">

            <h4 className="font-semibold">
              Cash Denominations
            </h4>

            <span className="text-sm text-gray-500">
              Count notes & coins
            </span>

          </div>

          <div className="grid grid-cols-2 gap-2 md:grid-cols-3">

            {denominations.map(
              (
                [key, label],
                index
              ) => (
                <div
                  key={key}
                  className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2"
                >

                  <span className="text-sm font-medium">
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
                    value={cash[key]}
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
                    className="h-8 w-16 rounded-md border bg-white text-center text-sm"
                  />

                </div>
              )
            )}

          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm">

            <span>
              Cash Counted:{" "}
              <strong>
                ₹
                {cashCounted.toLocaleString(
                  "en-IN"
                )}
              </strong>
            </span>

            <span>
              Opening:{" "}
              <strong>
                ₹
                {OPENING_CASH.toLocaleString(
                  "en-IN"
                )}
              </strong>
            </span>

            <span
              className={
                calculatedCashSales < 0
                  ? "font-bold text-red-600"
                  : "font-bold text-green-600"
              }
            >
              Cash Sales: ₹
              {calculatedCashSales.toLocaleString(
                "en-IN"
              )}
            </span>

          </div>

        </div>

        {/* SUMMARY */}

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">

          <div className="rounded-xl border bg-gray-50 p-3">
            <p className="text-xs text-gray-500">
              Cash
            </p>

            <p className="mt-1 text-lg font-bold">
              ₹
              {Number(
                form.cash_sales || 0
              ).toLocaleString(
                "en-IN"
              )}
            </p>
          </div>

          <div className="rounded-xl border bg-gray-50 p-3">
            <p className="text-xs text-gray-500">
              UPI / Card
            </p>

            <p className="mt-1 text-lg font-bold">
              ₹
              {(
                Number(
                  form.upi_sales || 0
                ) +
                Number(
                  form.card_sales || 0
                )
              ).toLocaleString(
                "en-IN"
              )}
            </p>
          </div>

          <div className="rounded-xl border bg-gray-50 p-3">
            <p className="text-xs text-gray-500">
              Expenses
            </p>

            <p className="mt-1 text-lg font-bold">
              ₹
              {Number(
                form.total_expenses || 0
              ).toLocaleString(
                "en-IN"
              )}
            </p>
          </div>

          <div className="rounded-xl border bg-gray-50 p-3">
            <p className="text-xs text-gray-500">
              Udhaar
            </p>

            <p className="mt-1 text-lg font-bold">
              ₹
              {Number(
                form.udhaar_sales || 0
              ).toLocaleString(
                "en-IN"
              )}
            </p>
          </div>

        </div>

        {/* BILLS + SYSTEM SALES */}

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">

          <div className="rounded-xl border p-3">

            <label className="mb-1 block text-xs font-medium text-gray-500">
              Total Bills
            </label>

            <input
              name="total_bills"
              type="number"
              min="0"
              value={form.total_bills}
              onChange={handleChange}
              className="h-10 w-full rounded-lg border px-3"
            />

          </div>

          <div className="rounded-xl border bg-gray-50 p-3">

            <p className="text-xs text-gray-500">
              Outstanding Udhaar
            </p>

            <p className="mt-1 text-lg font-bold">
              ₹
              {Number(
                form.udhaar_sales || 0
              ).toLocaleString(
                "en-IN"
              )}
            </p>

          </div>

          <div className="rounded-xl border p-3">

            <label className="mb-1 block text-xs font-medium text-gray-500">
              System Sales
            </label>

            <input
              name="system_sales"
              type="number"
              min="0"
              value={form.system_sales}
              onChange={handleChange}
              className="h-10 w-full rounded-lg border px-3"
            />

          </div>

        </div>

        {/* PAYMENT MACHINES */}

        <div className="rounded-xl border p-4">

          <div className="mb-3 flex items-center gap-2">

            <CreditCard
              size={18}
              className="text-blue-600"
            />

            <h4 className="font-semibold">
              UPI / Card Payments
            </h4>

          </div>

          <PaymentMachines
            reportId={report.id}
            onTotalChange={
              handleMachineTotal
            }
            onMachinesChange={
              setMachineEntries
            }
          />

        </div>

        {/* TOTAL */}

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">

          <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">

            <p className="text-xs text-blue-700">
              Total Sales
            </p>

            <p className="mt-1 text-2xl font-bold text-blue-600">
              ₹
              {totalSales.toLocaleString(
                "en-IN"
              )}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Cash + UPI/Card + Expenses + Udhaar
            </p>

          </div>

          <div className="rounded-xl border px-4 py-3">

            <p className="text-xs text-gray-500">
              Sales Difference
            </p>

            <p
              className={`mt-1 text-2xl font-bold ${
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

            <p className="mt-1 text-xs text-gray-500">
              Actual Sales − System Sales
            </p>

          </div>

        </div>

        {/* SAVE */}

        <div className="flex justify-end">

          <button
            onClick={handleSave}
            disabled={report.is_locked}
            className={`h-10 rounded-lg px-6 text-sm font-medium text-white ${
              report.is_locked
                ? "cursor-not-allowed bg-gray-400"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {report.is_locked
              ? "Report Locked"
              : "Save Sales"}
          </button>

        </div>

      </div>

    </SectionCard>
  );
}