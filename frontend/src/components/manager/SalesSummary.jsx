import { useEffect, useState } from "react";
import analyticsService from "../../services/analyticsService";

export default function SalesSummary() {
  const [payment, setPayment] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data =
          await analyticsService.getManagerDashboard();

        setPayment(data.payment_breakdown);
      } catch (err) {
        console.error(err);
      }
    }

    load();
  }, []);

  if (!payment) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
        Loading...
      </div>
    );
  }

  const rows = [
    {
      title: "Cash",
      value: payment.cash,
      color: "text-green-600",
    },
    {
      title: "UPI",
      value: payment.upi,
      color: "text-blue-600",
    },
    {
      title: "Card",
      value: payment.card,
      color: "text-violet-600",
    },
    {
      title: "Udhaar (Credit)",
      value: payment.udhaar,
      color: "text-orange-500",
    },
  ];

  const grandTotal =
    payment.cash +
    payment.upi +
    payment.card +
    payment.udhaar;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">

      <h2 className="mb-5 text-lg font-semibold">
        Today's Sales
      </h2>

      {rows.map((row) => (

        <div
          key={row.title}
          className="flex justify-between border-b py-3"
        >

          <span className="text-sm text-gray-600">
            {row.title}
          </span>

          <span
            className={`text-sm font-semibold ${row.color}`}
          >
            ₹{Number(row.value).toLocaleString("en-IN")}
          </span>

        </div>

      ))}

      <div className="flex justify-between pt-5">

        <span className="text-sm font-semibold">
          Grand Total
        </span>

        <span className="text-xl font-bold text-blue-600">
          ₹{grandTotal.toLocaleString("en-IN")}
        </span>

      </div>

    </div>
  );
}