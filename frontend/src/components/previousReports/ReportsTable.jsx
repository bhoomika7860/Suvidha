import {
  CalendarDays,
} from "lucide-react";

export default function ReportsTable({
  reports,
  onOpen,
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

      <div className="overflow-x-auto">

        <table className="w-full min-w-[900px]">

          <thead className="bg-gray-50">

            <tr>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Date
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Store
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Bills
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Sales
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Expenses
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Purchases
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Deliveries
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {reports.length === 0 ? (

              <tr>

                <td
                  colSpan={8}
                  className="px-6 py-16 text-center text-gray-500"
                >
                  No previous reports found.
                </td>

              </tr>

            ) : (

              reports.map((report) => (

                <tr
                  key={report.id}
                  onClick={() =>
                    onOpen(report)
                  }
                  className="border-t border-gray-200 cursor-pointer hover:bg-blue-50 transition"
                >

                  <td className="px-6 py-4">

                    <div className="flex items-center gap-2">

                      <CalendarDays
                        size={17}
                        className="text-gray-400"
                      />

                      <span>
                        {report.date}
                      </span>

                    </div>

                  </td>

                  <td className="px-6 py-4 font-medium text-gray-700">
                    {report.store}
                  </td>

                  <td className="px-6 py-4 font-medium">
                    {report.bills}
                  </td>

                  <td className="px-6 py-4 font-semibold text-blue-600">
                    ₹
                    {Number(
                      report.sales || 0
                    ).toLocaleString("en-IN")}
                  </td>

                  <td className="px-6 py-4">
                    ₹
                    {Number(
                      report.expenses || 0
                    ).toLocaleString("en-IN")}
                  </td>

                  <td className="px-6 py-4">
                    ₹
                    {Number(
                      report.purchases || 0
                    ).toLocaleString("en-IN")}
                  </td>

                  <td className="px-6 py-4">
                    {report.deliveries}
                  </td>

                  <td className="px-6 py-4">

                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        report.status === "Locked"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {report.status}
                    </span>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}