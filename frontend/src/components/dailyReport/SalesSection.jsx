import { useEffect, useMemo, useState } from "react";
import { CreditCard } from "lucide-react";
import SectionCard from "./SectionCard";
import dailyReportsService from "../../services/dailyReportsService";
import cashDenominationService from "../../services/cashDenominationService";
import PaymentMachines from "./PaymentMachines";
import udhaarService from "../../services/udhaarService";
const OPENING_CASH = 20000;

export default function SalesSection() {
  const [report, setReport] = useState(null);

  const [form, setForm] = useState({
    total_bills: 0,
    cash_sales: 0,
    upi_sales: 0,
    card_sales: 0,
    total_expenses: 0,
    udhaar_sales: 0,
  });

  const [cash, setCash] = useState({
    note_500: 0,
    note_200: 0,
    note_100: 0,
    note_50: 0,
    note_20: 0,
    note_10: 0,
    coin_5: 0,
    coin_2: 0,
    coin_1: 0,
  });

  async function loadReport() {
  try {
    const data = await dailyReportsService.getTodayReport();
    const outstanding =
      await udhaarService.getOutstanding();

    setReport(data);

    setForm({
      total_bills: data.total_bills || 0,
      cash_sales: data.cash_sales || 0,
      upi_sales: data.upi_sales || 0,
      card_sales: data.card_sales || 0,
      total_expenses: data.total_expenses || 0,
      udhaar_sales: outstanding.outstanding || 0,
    });

    const saved =
      await cashDenominationService.get(data.id);

    if (saved) {
      setCash({
        note_500: saved.note_500,
        note_200: saved.note_200,
        note_100: saved.note_100,
        note_50: saved.note_50,
        note_20: saved.note_20,
        note_10: saved.note_10,
        coin_5: saved.coin_5,
        coin_2: saved.coin_2,
        coin_1: saved.coin_1,
      });
    }

  } catch (err) {
    console.error(err);
  }
}
  useEffect(() => {
    loadReport();
  }, []);

  const cashCounted =
    cash.note_500 * 500 +
    cash.note_200 * 200 +
    cash.note_100 * 100 +
    cash.note_50 * 50 +
    cash.note_20 * 20 +
    cash.note_10 * 10 +
    cash.coin_5 * 5 +
    cash.coin_2 * 2 +
    cash.coin_1;

  const calculatedCashSales = cashCounted - OPENING_CASH;

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      cash_sales: calculatedCashSales,
    }));
  }, [calculatedCashSales]);

  const totalSales = useMemo(() => {
    return (
      Number(form.cash_sales) +
      Number(form.upi_sales) +
      Number(form.card_sales) +
      Number(form.total_expenses) +
      Number(form.udhaar_sales)
    );
  }, [form]);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  }

  function handleCashChange(name, value) {
    setCash((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  }

  async function handleSave() {
  try {
    await dailyReportsService.updateSales(
      report.id,
      {
        total_bills: form.total_bills,
        cash_sales: form.cash_sales,
        upi_sales: form.upi_sales,
        card_sales: 0,
      }
    );

    await cashDenominationService.save({
      daily_report_id: report.id,
      ...cash,
    });

    alert("Sales saved successfully.");

    await loadReport();

  } catch (err) {
    console.error(err);
  }
}

  if (!report) return null;

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
    <div className="rounded-2xl border bg-white p-6">

      <div className="mb-6 flex items-center gap-2">
        <CreditCard size={20} className="text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Sales & Billing
        </h3>
      </div>

      {/* Cash Denominations */}
      <div className="rounded-2xl border border-gray-200 p-5">
        <h4 className="mb-5 text-lg font-semibold">
          Cash Denominations
        </h4>

        <div className="grid grid-cols-3 gap-4">
          {denominations.map(([key, label]) => (
            <div
              key={key}
              className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3"
            >
              <span className="font-semibold">{label}</span>

              <input
                type="number"
                min="0"
                value={cash[key]}
                onChange={(e) =>
                  handleCashChange(key, e.target.value)
                }
                className="h-10 w-20 rounded-lg border text-center"
              />
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-5">
          <div className="flex justify-between">
            <span>Cash Counted</span>
            <span className="font-semibold">
              ₹{cashCounted.toLocaleString("en-IN")}
            </span>
          </div>

          <div className="mt-2 flex justify-between">
            <span>Opening Cash</span>
            <span>₹20,000</span>
          </div>

          <div className="mt-4 flex justify-between border-t border-blue-200 pt-4">
            <span className="font-semibold">
              Today's Cash Sales
            </span>

            <span
              className={`text-2xl font-bold ${
                calculatedCashSales < 0
                  ? "text-red-600"
                  : "text-green-600"
              }`}
            >
              ₹{calculatedCashSales.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">

        <PaymentMachines
          reportId={report.id}
          onTotalChange={(total) =>
            setForm((prev) => ({
              ...prev,
              upi_sales: total,
              card_sales: 0,
            }))
          }
        />

        <div className="rounded-2xl border border-gray-200 p-5">
          <div className="space-y-5">

            <div>
              <label className="mb-2 block font-medium">
                Total Bills
              </label>

              <input
                name="total_bills"
                type="number"
                value={form.total_bills}
                onChange={handleChange}
                className="h-12 w-full rounded-xl border px-4"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Expenses
              </label>

              <input
                readOnly
                value={form.total_expenses}
                className="h-12 w-full rounded-xl border bg-gray-100 px-4 font-semibold"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Outstanding Udhaar
              </label>

              <input
                readOnly
                value={form.udhaar_sales}
                className="h-12 w-full rounded-xl border bg-gray-100 px-4 font-semibold"
              />
            </div>

          </div>
        </div>

      </div>

      {/* Total */}
      <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-6">
        <p className="text-sm text-gray-500">
          Total Sales Today
        </p>

        <h2 className="mt-2 text-4xl font-bold text-blue-600">
          ₹{totalSales.toLocaleString("en-IN")}
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Cash + UPI/Card + Expenses + Udhaar
        </p>
      </div>

    </div>

    <div className="mt-6 flex justify-end">
      <button
        onClick={handleSave}
        className="h-11 rounded-xl bg-blue-600 px-8 font-medium text-white hover:bg-blue-700"
      >
        Save Sales
      </button>
    </div>

  </SectionCard>
);
}