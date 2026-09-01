import { useEffect, useState } from "react";
import analyticsService from "../../services/analyticsService";

export default function PurchaseSummary() {
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const data =
          await analyticsService.getManagerDashboard();

        setPurchases(data.purchases || []);
      } catch (err) {
        console.error(err);
      }
    }

    load();
  }, []);

  const total = purchases.reduce(
    (sum, purchase) =>
      sum + Number(purchase.amount || 0),
    0
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">

      <h2 className="mb-5 text-lg font-semibold">
        Today's Purchases
      </h2>

      {purchases.length === 0 ? (

        <p className="text-sm text-gray-500">
          No purchases added today.
        </p>

      ) : (

        <div className="space-y-1">

          {purchases.map((purchase, index) => (

            <div
              key={index}
              className="flex items-center justify-between gap-3 border-b py-3"
            >

              <div className="min-w-0">

                <p className="truncate text-sm font-medium">
                  {purchase.product_name}
                </p>

                <p className="truncate text-xs text-gray-500">
                  {purchase.supplier_name ||
                    "No Supplier"}
                </p>

              </div>

              <span className="shrink-0 text-sm font-semibold">
                ₹
                {Number(
                  purchase.amount
                ).toLocaleString("en-IN")}
              </span>

            </div>

          ))}

        </div>

      )}

      <div className="mt-6 flex justify-between">

        <span className="text-sm font-semibold">
          Total
        </span>

        <span className="text-xl font-bold text-blue-600">
          ₹{total.toLocaleString("en-IN")}
        </span>

      </div>

    </div>
  );
}