const expenses = [
  ["Transport", "₹700"],
  ["Electricity", "₹500"],
  ["Tea & Snacks", "₹300"],
  ["Miscellaneous", "₹700"],
];

export default function ExpenseSummary() {
  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">

      <h2 className="text-xl font-semibold mb-6">
        Today's Expenses
      </h2>

      <div className="space-y-4">

        {expenses.map(([name, value]) => (
          <div
            key={name}
            className="flex justify-between border-b pb-3"
          >
            <span className="text-gray-600">
              {name}
            </span>

            <span className="font-semibold">
              {value}
            </span>
          </div>
        ))}

      </div>

      <div className="flex justify-between mt-8">

        <span className="font-semibold">
          Total
        </span>

        <span className="text-2xl font-bold text-red-500">
          ₹2,200
        </span>

      </div>

    </div>
  );
}