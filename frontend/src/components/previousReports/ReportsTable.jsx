import {
  CalendarDays,
  Eye,
} from "lucide-react";

export default function ReportsTable({
  reports,
  onOpen,
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

      <table className="w-full">

        <thead className="bg-gray-50">

          <tr>

            <th className="px-6 py-4 text-left text-sm font-semibold">
              Date
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold">
              Bills
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold">
              Sales
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold">
              Expenses
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold">
              Purchases
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold">
              Deliveries
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold">
              Status
            </th>

            <th className="px-6 py-4 text-center text-sm font-semibold">
              View
            </th>

          </tr>

        </thead>

        <tbody>

          {reports.map((report) => (

            <tr
              key={report.id}
              className="border-t hover:bg-blue-50 cursor-pointer transition"
              onClick={() => onOpen(report)}
            >

              <td className="px-6 py-4">

                <div className="flex items-center gap-2">

                  <CalendarDays
                    size={17}
                    className="text-gray-400"
                  />

                  {report.date}

                </div>

              </td>

              <td className="px-6 py-4 font-medium">
                {report.bills}
              </td>

              <td className="px-6 py-4 font-semibold text-blue-600">
                ₹{report.sales.toLocaleString()}
              </td>

              <td className="px-6 py-4">
                ₹{report.expenses.toLocaleString()}
              </td>

              <td className="px-6 py-4">
                ₹{report.purchases.toLocaleString()}
              </td>

              <td className="px-6 py-4">
                {report.deliveries}
              </td>

              <td className="px-6 py-4">

                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">

                  {report.status}

                </span>

              </td>

              <td className="px-6 py-4 text-center">

                <button className="w-9 h-9 rounded-lg hover:bg-blue-100 flex items-center justify-center mx-auto">

                  <Eye
                    size={18}
                    className="text-blue-600"
                  />

                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}