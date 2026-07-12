import { useEffect, useState } from "react";
import analyticsService from "../../services/analyticsService";

export default function BouncedProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const data = await analyticsService.getManagerDashboard();
        setProducts(data.bounced_products || []);
      } catch (err) {
        console.error(err);
      }
    }

    load();
  }, []);

  const total = products.reduce(
    (sum, product) => sum + Number(product.quantity || 0),
    0
  );

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">

      <h2 className="text-xl font-semibold mb-6">
        Today's Bounced Products
      </h2>

      {products.length === 0 ? (
        <p className="text-gray-500 text-sm">
          No bounced products today.
        </p>
      ) : (
        <div className="space-y-3">

          {products.map((product, index) => (
            <div
              key={index}
              className="flex items-center justify-between border-b pb-3"
            >
              <div>

                <p>{product.product_name}</p>

                <p className="text-xs text-gray-500">
                  Qty : {product.quantity}
                </p>

              </div>

              <span className="text-sm bg-red-100 text-red-600 px-3 py-1 rounded-full">
                Out of Stock
              </span>

            </div>
          ))}

        </div>
      )}

      <div className="flex justify-between mt-8">

        <span className="font-semibold">
          Total
        </span>

        <span className="text-2xl font-bold text-red-600">
          {total}
        </span>

      </div>

    </div>
  );
}