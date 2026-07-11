const purchases = [
  { vendor: "Sun Pharma", amount: "₹8,500" },
  { vendor: "Cipla", amount: "₹6,700" },
  { vendor: "Apollo Distributors", amount: "₹7,300" },
];

export default function PurchaseSummary() {
  return (
    <div className="bg-white  border-gray-200 rounded-2xl p-5 shadow-sm">

      <h2 className="text-lg font-semibold mb-6">
        Today's Purchases
      </h2>

      <div className="space-y-2">

        {purchases.map((purchase) => (
          <div
            key={purchase.vendor}
            className="flex justify-between border-b py-3"
          >
            <span className="text-sm text-gray-700">
              {purchase.vendor}
            </span>

            <span className="text-sm font-semibold">
              {purchase.amount}
            </span>
          </div>
        ))}

      </div>

      <div className="flex justify-between mt-8">

        <span className="font-semibold">
          Total
        </span>

        <span className="text-xl font-bold text-blue-600">
          ₹22,500
        </span>

      </div>

    </div>
  );
}