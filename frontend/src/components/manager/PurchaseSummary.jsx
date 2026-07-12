import { useEffect, useState } from "react";
import analyticsService from "../../services/analyticsService";

export default function PurchaseSummary() {
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const data = await analyticsService.getManagerDashboard();
        setPurchases(data.purchases || []);
      } catch (err) {
        console.error(err);
      }
    }

    load();
  }, []);

  const total = purchases.reduce(
    (sum, purchase) => sum + Number(purchase.amount || 0),
    0
  );

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">

      <h2 className="text-lg font-semibold mb-6">
        Today's Purchases
      </h2>

      {purchases.length === 0 ? (
        <p className="text-gray-500 text-sm">
          No purchases added today.
        </p>
      ) : (
        <div className="space-y-2">

          {purchases.map((purchase, index) => (
            <div
              key={index}
              className="flex justify-between border-b py-3"
            >
              <div>

                <p className="text-sm font-medium">
                  {purchase.product_name}
                </p>

                <p className="text-xs text-gray-500">
                  {purchase.supplier_name || "No Supplier"}
                </p>

              </div>

              <span className="text-sm font-semibold">
                ₹{Number(purchase.amount).toLocaleString("en-IN")}
              </span>

            </div>
          ))}

        </div>
      )}

      <div className="flex justify-between mt-8">

        <span className="font-semibold">
          Total
        </span>

        <span className="text-xl font-bold text-blue-600">
          ₹{total.toLocaleString("en-IN")}
        </span>

      </div>

    </div>
  );
}