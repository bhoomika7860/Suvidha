import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Plus,
  Trash2,
} from "lucide-react";

import SectionCard from "./SectionCard";
import dailyReportsService from "../../services/dailyReportsService";
import bouncedProductService from "../../services/bouncedProductService";

export default function BouncedSection() {
  
  const [reportId, setReportId] = useState(null);

  const [products, setProducts] = useState([]);

  const [productName, setProductName] = useState("");

  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const report =
        await dailyReportsService.getTodayReport();

      setReportId(report.id);

      const data =
        await dailyReportsService.getBouncedProducts(
          report.id
        );

      setProducts(data);

    } catch (err) {
      console.error(err);
    }
  }

  async function addProduct() {
  if (
    productName.trim() === "" ||
    quantity === ""
  ) {
    return;
  }

  try {
    await bouncedProductService.create({
      daily_report_id: reportId,
      product_name: productName,
      quantity: Number(quantity),
    });

    await loadProducts();

    setProductName("");
    setQuantity("");

  } catch (err) {
    console.error(err);
  }
}

  async function deleteProduct(id) {
    try {
      await bouncedProductService.delete(id);

      await loadProducts();

    } catch (err) {
      console.error(err);
    }
  }

  const total = products.reduce(
    (sum, item) => sum + Number(item.quantity),
    0
  );

  return (
    <SectionCard title="Bounced Products">

      <div className="flex items-center gap-3 mb-6">

        <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">

          <AlertTriangle
            size={18}
            className="text-red-600"
          />

        </div>

        <div>

          <h3 className="font-semibold">
            Today's Bounced Products
          </h3>

          <p className="text-sm text-gray-500">
            Record medicines unavailable today.
          </p>

        </div>

      </div>

      <div className="grid grid-cols-12 gap-3 mb-6">

        <input
  className="col-span-7 h-11 rounded-xl border border-gray-200 px-4"
  placeholder="Medicine Name"
  value={productName}
  onChange={(e) => {
    console.log("Medicine:", e.target.value);
    setProductName(e.target.value);
  }}
/>

<input
  type="number"
  className="col-span-2 h-11 rounded-xl border border-gray-200 px-4"
  placeholder="Qty"
  value={quantity}
  onChange={(e) => {
    console.log("Quantity:", e.target.value);
    setQuantity(e.target.value);
  }}
/>

        <button
          onClick={addProduct}
          className="col-span-3 h-11 rounded-xl bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2"
        >
          <Plus size={17} />

          Add

        </button>

      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200">

        <table className="w-full">

          <thead className="bg-gray-50">

            <tr>

              <th className="px-5 py-3 text-left">
                Medicine
              </th>

              <th className="px-5 py-3 text-left">
                Quantity
              </th>

              <th className="px-5 py-3 text-center">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {products.length === 0 ? (

              <tr>

                <td
                  colSpan={3}
                  className="text-center py-8 text-gray-500"
                >
                  No bounced products today.

                </td>

              </tr>

            ) : (

              products.map((product) => (

                <tr
                  key={product.id}
                  className="border-t"
                >

                  <td className="px-5 py-3">

                    {product.product_name}

                  </td>

                  <td className="px-5 py-3">

                    {product.quantity}

                  </td>

                  <td className="px-5 py-3 text-center">

                    <button
                      onClick={() =>
                        deleteProduct(product.id)
                      }
                      className="text-red-600 hover:text-red-700"
                    >

                      <Trash2 size={18} />

                    </button>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

      <div className="mt-5 flex justify-end">

        <div className="bg-red-50 border border-red-200 rounded-xl px-6 py-3">

          <p className="text-xs text-red-700">
            Total Bounced Quantity
          </p>

          <h2 className="text-2xl font-bold text-red-600">
            {total}
          </h2>

        </div>

      </div>

    </SectionCard>
  );
}