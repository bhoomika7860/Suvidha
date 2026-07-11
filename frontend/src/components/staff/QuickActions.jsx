import { Link } from "react-router-dom";

export default function QuickActions() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">

      <h2 className="text-xl font-bold">
        Quick Actions
      </h2>

      <div className="mt-6 space-y-3">

        <Link
          to="/staff-purchases"
          className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-medium"
        >
          Open Purchases
        </Link>

        <Link
          to="/staff-expenses"
          className="block w-full text-center border border-gray-200 hover:bg-gray-50 rounded-xl py-3 font-medium"
        >
          Open Expenses
        </Link>

      </div>

    </div>
  );
}