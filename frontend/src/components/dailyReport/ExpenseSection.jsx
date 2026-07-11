import { Eye, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import SectionCard from "./SectionCard";

export default function ExpenseSection() {
  return (
    <SectionCard title="Expenses">

      {/* Header */}

      <div className="flex items-center justify-between mb-5">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">

            <Wallet
              size={18}
              className="text-orange-600"
            />

          </div>

          <div>

            <h3 className="font-semibold text-gray-900">
              Today's Expenses
            </h3>

            <p className="text-sm text-gray-500">
              Automatically synced from the Expenses module.
            </p>

          </div>

        </div>

        <Link
          to="/manager-expenses"
          className="flex items-center gap-2 h-10 px-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition"
        >
          <Eye size={17} />
          View Expenses
        </Link>

      </div>

      {/* Table */}

      <div className="overflow-hidden rounded-xl border border-gray-200">

        <table className="w-full">

          <thead className="bg-gray-50">

            <tr>

              <th className="px-5 py-3 text-left text-sm font-semibold">
                Expense
              </th>

              <th className="px-5 py-3 text-left text-sm font-semibold">
                Amount
              </th>

              <th className="px-5 py-3 text-left text-sm font-semibold">
                Added By
              </th>

            </tr>

          </thead>

          <tbody>

            <tr className="border-t hover:bg-gray-50">

              <td className="px-5 py-3">
                Electricity
              </td>

              <td className="px-5 py-3 font-medium">
                ₹1,200
              </td>

              <td className="px-5 py-3">
                Rahul
              </td>

            </tr>

            <tr className="border-t hover:bg-gray-50">

              <td className="px-5 py-3">
                Tea & Snacks
              </td>

              <td className="px-5 py-3 font-medium">
                ₹250
              </td>

              <td className="px-5 py-3">
                Amit
              </td>

            </tr>

          </tbody>

        </table>

      </div>

      {/* Footer */}

      <div className="mt-5 flex justify-end">

        <div className="bg-orange-50 border border-orange-200 rounded-xl px-6 py-3">

          <p className="text-xs text-orange-700">
            Total Expenses
          </p>

          <h2 className="text-2xl font-bold text-orange-600">
            ₹1,450
          </h2>

        </div>

      </div>

    </SectionCard>
  );
}