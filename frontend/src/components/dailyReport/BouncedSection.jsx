import { AlertTriangle, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import SectionCard from "./SectionCard";

export default function BouncedSection() {
  return (
    <SectionCard title="Bounced Products">

      {/* Header */}

      <div className="flex items-center justify-between mb-5">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">

            <AlertTriangle
              size={18}
              className="text-red-600"
            />

          </div>

          <div>

            <h3 className="font-semibold text-gray-900">
              Today's Bounced Products
            </h3>

            <p className="text-sm text-gray-500">
              Medicines unavailable today automatically appear here.
            </p>

          </div>

        </div>

        <Link
          to="/manager-bounced"
          className="flex items-center gap-2 h-10 px-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition"
        >
          <Eye size={17} />
          View Products
        </Link>

      </div>

      {/* Table */}

      <div className="overflow-hidden rounded-xl border border-gray-200">

        <table className="w-full">

          <thead className="bg-gray-50">

            <tr>

              <th className="px-5 py-3 text-left text-sm font-semibold">
                Medicine
              </th>

              <th className="px-5 py-3 text-left text-sm font-semibold">
                Reason
              </th>

            </tr>

          </thead>

          <tbody>

            <tr className="border-t hover:bg-gray-50">

              <td className="px-5 py-3">
                Dolo 650
              </td>

              <td className="px-5 py-3">
                Out of Stock
              </td>

            </tr>

            <tr className="border-t hover:bg-gray-50">

              <td className="px-5 py-3">
                Augmentin 625
              </td>

              <td className="px-5 py-3">
                Supplier Delay
              </td>

            </tr>

          </tbody>

        </table>

      </div>

      {/* Footer */}

      <div className="mt-5 flex justify-end">

        <div className="bg-red-50 border border-red-200 rounded-xl px-6 py-3">

          <p className="text-xs text-red-700">
            Total Bounced Products
          </p>

          <h2 className="text-2xl font-bold text-red-600">
            2
          </h2>

        </div>

      </div>

    </SectionCard>
  );
}