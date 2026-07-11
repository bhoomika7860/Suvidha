const rows = [
  ["Cash", "₹18,500", "text-green-600"],
  ["UPI", "₹22,300", "text-blue-600"],
  ["Card", "₹9,100", "text-violet-600"],
  ["Udhaar (Credit)", "₹4,200", "text-orange-500"],
];

export default function SalesSummary() {
  return (
    <div className="bg-white border-gray-200 rounded-2xl p-5 shadow-sm">

      <h2 className="text-lg font-semibold mb-6">
        Today's Sales
      </h2>

      {rows.map(([title, value, color]) => (
        <div
          key={title}
          className="flex justify-between py-3 border-b"
        >
          <span className="text-gray-600">
            {title}
          </span>

          <span className={`font-semibold ${color}`}>
            {value}
          </span>
        </div>
      ))}

      <div className="flex justify-between pt-6">

        <span className="font-semibold text-sm">
          Grand Total
        </span>

        <span className="font-bold text-blue-600 text-xl">
          ₹54,100
        </span>

      </div>

    </div>
  );
}