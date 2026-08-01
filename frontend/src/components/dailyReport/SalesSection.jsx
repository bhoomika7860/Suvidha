import { useEffect, useMemo, useState } from "react";
import { CreditCard } from "lucide-react";
import SectionCard from "./SectionCard";
import dailyReportsService from "../../services/dailyReportsService";

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

  useEffect(() => {
    async function load() {
      try {
        const data = await dailyReportsService.getTodayReport();

        setReport(data);

        setForm({
  total_bills: data.total_bills || 0,
  cash_sales: data.cash_sales || 0,
  upi_sales: data.upi_sales || 0,
  card_sales: data.card_sales || 0,

  // Manual fields
  total_expenses: 0,
  udhaar_sales: 0,
});
      } catch (err) {
        console.error(err);
      }
    }

    load();
  }, []);

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

  async function handleSave() {
    try {
      await dailyReportsService.updateSales(report.id, form);
      alert("Sales saved successfully.");
    } catch (err) {
      console.error(err);
    }
  }

  if (!report) return null;

  return (
    <SectionCard title="Sales">
      <div className="rounded-2xl border bg-white p-6">

        <div className="flex items-center gap-2 mb-6">
          <CreditCard size={20} className="text-blue-600" />

          <h3 className="text-lg font-semibold text-gray-900">
            Sales & Billing
          </h3>
        </div>

        <div className="grid grid-cols-5 gap-6">

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Cash Sales
            </label>

            <input
              name="cash_sales"
              type="number"
              value={form.cash_sales}
              onChange={handleChange}
              className="h-11 w-full rounded-xl border border-gray-200 px-4"
            />
          </div>

          <div>
  <label className="mb-2 block text-sm font-medium text-gray-700">
    UPI + Card Sales
  </label>

  <input
    type="number"
    value={
      Number(form.upi_sales) +
      Number(form.card_sales)
    }
    onChange={(e) => {
      const value = Number(e.target.value);

      setForm((prev) => ({
        ...prev,
        upi_sales: value,
        card_sales: 0,
      }));
    }}
    className="h-11 w-full rounded-xl border border-gray-200 px-4"
  />
</div>

<div>
  <label className="mb-2 block text-sm font-medium text-gray-700">
    Expenses
  </label>

  <input
  name="total_expenses"
  type="number"
  value={form.total_expenses}
  onChange={handleChange}
  className="h-11 w-full rounded-xl border border-gray-200 px-4"
/>
</div>

<div>
  <label className="mb-2 block text-sm font-medium text-gray-700">
    Udhaar
  </label>

  <input
  name="total_expenses"
  type="number"
  value={form.total_expenses}
  onChange={handleChange}
  className="h-11 w-full rounded-xl border border-gray-200 px-4"
/>
</div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Total Bills
            </label>

            <input
              name="total_bills"
              type="number"
              value={form.total_bills}
              onChange={handleChange}
              className="h-11 w-full rounded-xl border border-gray-200 px-4"
            />
          </div>

        

        </div>

        <div className="mt-8 rounded-2xl bg-blue-50 border border-blue-100 p-6">

          <p className="text-sm font-medium text-slate-500">
            Total Sales Today
          </p>

          <h2 className="mt-2 text-4xl font-bold text-blue-600">
            ₹{totalSales.toLocaleString("en-IN")}
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Cash + UPI/Card + Expenses + Udhaar
          </p>

        </div>

      </div>

      <div className="mt-6 flex justify-end">

        <button
          onClick={handleSave}
          className="h-11 rounded-xl bg-blue-600 px-8 font-medium text-white transition hover:bg-blue-700"
        >
          Save Sales
        </button>

      </div>

    </SectionCard>
  );
}