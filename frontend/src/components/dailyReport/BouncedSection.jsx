import { useEffect, useState } from "react";
import { AlertTriangle, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import SectionCard from "./SectionCard";
import dailyReportsService from "../../services/dailyReportsService";

export default function BouncedSection() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function load() {
      const report =
        await dailyReportsService.getTodayReport();

      const data =
        await dailyReportsService.getBouncedProducts(report.id);

      setProducts(data);
    }

    load();
  }, []);

  return (
    <SectionCard title="Bounced Products">

      <div className="flex items-center justify-between mb-5">

        <div className="flex items-center gap-3">

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
              Medicines unavailable today automatically appear here.
            </p>

          </div>

        </div>

        <Link
          to="/manager-bounced"
          className="flex items-center gap-2 h-10 px-4 rounded-xl border border-gray-200 hover:bg-gray-50"
        >
          <Eye size={17} />
          View Products
        </Link>

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

            </tr>

          </thead>

          <tbody>

            {products.map((product) => (

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

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      <div className="mt-5 flex justify-end">

        <div className="bg-red-50 border border-red-200 rounded-xl px-6 py-3">

          <p className="text-xs text-red-700">
            Total Bounced Products
          </p>

          <h2 className="text-2xl font-bold text-red-600">
            {products.length}
          </h2>

        </div>

      </div>

    </SectionCard>
  );
}