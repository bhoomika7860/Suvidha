import { useEffect, useMemo, useState } from "react";
import { Receipt, CreditCard } from "lucide-react";
import SectionCard from "./SectionCard";
import dailyReportsService from "../../services/dailyReportsService";

export default function SalesSection() {
  const [report, setReport] = useState(null);

  const [form, setForm] = useState({
    total_bills: 0,
    cash_sales: 0,
    upi_sales: 0,
    card_sales: 0,
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
          udhaar_sales: data.udhaar_sales || 0,
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

      <div className="grid grid-cols-3 gap-6">

        <div className="col-span-2 border rounded-2xl p-5 bg-gray-50">

          <div className="flex items-center gap-2 mb-5">
            <CreditCard size={18} className="text-blue-600" />
            <h3 className="font-semibold text-gray-900">
              Payment Breakdown
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-5">

            <div>
              <label className="block text-sm font-medium mb-2">
                Cash Sales
              </label>

              <input
                name="cash_sales"
                type="number"
                value={form.cash_sales}
                onChange={handleChange}
                className="w-full h-11 rounded-xl border border-gray-200 px-4"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                UPI Sales
              </label>

              <input
                name="upi_sales"
                type="number"
                value={form.upi_sales}
                onChange={handleChange}
                className="w-full h-11 rounded-xl border border-gray-200 px-4"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Card Sales
              </label>

              <input
                name="card_sales"
                type="number"
                value={form.card_sales}
                onChange={handleChange}
                className="w-full h-11 rounded-xl border border-gray-200 px-4"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Udhaar Sales
              </label>

              <input
                name="udhaar_sales"
                type="number"
                value={form.udhaar_sales}
                onChange={handleChange}
                className="w-full h-11 rounded-xl border border-gray-200 px-4"
              />
            </div>

          </div>

        </div>

        <div className="border rounded-2xl p-5 bg-gray-50">

          <div className="flex items-center gap-2 mb-5">
            <Receipt size={18} className="text-green-600" />
            <h3 className="font-semibold text-gray-900">
              Billing
            </h3>
          </div>

          <label className="block text-sm font-medium mb-2">
            Total Bills
          </label>

          <input
            name="total_bills"
            type="number"
            value={form.total_bills}
            onChange={handleChange}
            className="w-full h-11 rounded-xl border border-gray-200 px-4"
          />

          <div className="mt-6 rounded-xl bg-white border border-gray-200 p-4">

            <p className="text-sm text-gray-500">
              Estimated Total Sales
            </p>

            <h2 className="text-2xl font-bold text-blue-600 mt-2">
              ₹{totalSales.toLocaleString("en-IN")}
            </h2>

          </div>

        </div>

      </div>

      <div className="flex justify-end mt-6">

        <button
          onClick={handleSave}
          className="h-11 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
        >
          Save Sales
        </button>

      </div>

    </SectionCard>
  );
}