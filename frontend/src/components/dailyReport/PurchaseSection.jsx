import { Eye, Package } from "lucide-react";
import { Link } from "react-router-dom";
import SectionCard from "./SectionCard";

export default function PurchaseSection() {
  return (
    <SectionCard title="Purchases">

      {/* Header */}

      <div className="flex items-center justify-between mb-5">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">

            <Package
              size={18}
              className="text-blue-600"
            />

          </div>

          <div>

            <h3 className="font-semibold text-gray-900">
              Today's Purchases
            </h3>

            <p className="text-sm text-gray-500">
              Bills received today automatically appear here.
            </p>

          </div>

        </div>

        <Link
          to="/manager-purchases"
          className="flex items-center gap-2 h-10 px-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition"
        >
          <Eye size={17} />
          View Purchases
        </Link>

      </div>

      {/* Table */}

      <div className="overflow-hidden rounded-xl border border-gray-200">

        <table className="w-full">

          <thead className="bg-gray-50">

            <tr>

              <th className="px-5 py-3 text-left text-sm font-semibold">
                Party
              </th>

              <th className="px-5 py-3 text-left text-sm font-semibold">
                Bill No.
              </th>

              <th className="px-5 py-3 text-left text-sm font-semibold">
                Amount
              </th>

              <th className="px-5 py-3 text-left text-sm font-semibold">
                Stage
              </th>

            </tr>

          </thead>

          <tbody>

            <tr className="border-t hover:bg-gray-50">

              <td className="px-5 py-3">
                Sun Pharma
              </td>

              <td className="px-5 py-3">
                SP1023
              </td>

              <td className="px-5 py-3 font-semibold">
                ₹8,500
              </td>

              <td className="px-5 py-3">

                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">

                  Completed

                </span>

              </td>

            </tr>

            <tr className="border-t hover:bg-gray-50">

              <td className="px-5 py-3">
                Cipla
              </td>

              <td className="px-5 py-3">
                CP871
              </td>

              <td className="px-5 py-3 font-semibold">
                ₹6,700
              </td>

              <td className="px-5 py-3">

                <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-medium">

                  Waiting Check

                </span>

              </td>

            </tr>

          </tbody>

        </table>

      </div>

      {/* Footer */}

      <div className="mt-5 flex justify-end">

        <div className="bg-blue-50 border border-blue-200 rounded-xl px-6 py-3">

          <p className="text-xs text-blue-700">
            Total Purchases
          </p>

          <h2 className="text-2xl font-bold text-blue-600">
            ₹15,200
          </h2>

        </div>

      </div>

    </SectionCard>
  );
}