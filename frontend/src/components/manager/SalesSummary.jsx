import { useEffect, useState } from "react";
import analyticsService from "../../services/analyticsService";

export default function SalesSummary() {
  const [payment, setPayment] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await analyticsService.getManagerDashboard();
        setPayment(data.payment_breakdown);
      } catch (err) {
        console.error(err);
      }
    }

    load();
  }, []);

  if (!payment) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
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
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">

      <h2 className="text-lg font-semibold mb-6">
        Today's Sales
      </h2>

      {rows.map((row) => (
        <div
          key={row.title}
          className="flex justify-between py-3 border-b"
        >
          <span className="text-gray-600">
            {row.title}
          </span>

          <span className={`font-semibold ${row.color}`}>
            ₹{Number(row.value).toLocaleString("en-IN")}
          </span>
        </div>
      ))}

      <div className="flex justify-between pt-6">

        <span className="font-semibold text-sm">
          Grand Total
        </span>

        <span className="font-bold text-blue-600 text-xl">
          ₹{grandTotal.toLocaleString("en-IN")}
        </span>

      </div>

    </div>
  );
}