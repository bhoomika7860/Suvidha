import { Eye, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import SectionCard from "./SectionCard";
import dailyReportsService from "../../services/dailyReportsService";

export default function PurchaseSection({
  report,
  refreshReport,
}) {
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    if (!report?.id) return;

    async function loadPurchases() {
      try {
        const data =
          await dailyReportsService.getPurchases(
            report.id
          );

        setPurchases(data);

      } catch (err) {
        console.error(
          "Failed to load purchases:",
          err
        );
      }
    }

    loadPurchases();
  }, [report?.id]);

  const total = purchases.reduce(
    (sum, purchase) =>
      sum +
      Number(
        purchase.purchase_amount || 0
      ),
    0
  );

  return (
    <SectionCard title="Purchases">

      <div className="flex items-center justify-between mb-5">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">

            <Package
              size={18}
              className="text-blue-600"
            />

          </div>

          <div>

            <h3 className="font-semibold">
              Purchases
            </h3>

            <p className="text-sm text-gray-500">
              Purchases for this report.
            </p>

          </div>

        </div>

        <Link
          to={`/manager-purchases?report=${report.id}`}
          className="flex items-center gap-2 h-10 px-4 rounded-xl border border-gray-200 hover:bg-gray-50"
        >
          <Eye size={17} />
          View Purchases
        </Link>

      </div>

      <div className="overflow-hidden rounded-xl border">

        <table className="w-full">

          <thead className="bg-gray-50">

            <tr>

              <th className="px-5 py-3 text-left">
                Product
              </th>

              <th className="px-5 py-3 text-left">
                Supplier
              </th>

              <th className="px-5 py-3 text-left">
                Amount
              </th>

            </tr>

          </thead>

          <tbody>

            {purchases.length === 0 ? (

              <tr>
                <td
                  colSpan={3}
                  className="px-5 py-8 text-center text-gray-500"
                >
                  No purchases recorded for this report.
                </td>
              </tr>

            ) : (

              purchases.map((purchase) => (

                <tr
                  key={purchase.id}
                  className="border-t"
                >

                  <td className="px-5 py-3">
                    {purchase.product_name}
                  </td>

                  <td className="px-5 py-3">
                    {purchase.supplier_name || "-"}
                  </td>

                  <td className="px-5 py-3 font-medium">
                    ₹
                    {Number(
                      purchase.purchase_amount || 0
                    ).toLocaleString("en-IN")}
                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

      <div className="mt-5 flex justify-end">

        <div className="bg-blue-50 border border-blue-200 rounded-xl px-6 py-3">

          <p className="text-xs text-blue-700">
            Total Purchases
          </p>

          <h2 className="text-2xl font-bold text-blue-600">
            ₹{total.toLocaleString("en-IN")}
          </h2>

        </div>

      </div>

    </SectionCard>
  );
}