import { Store, Eye } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { useNavigate } from "react-router-dom";

const fmt = (n) => {
  const value = Number(n || 0);

  return value === 0
    ? "–"
    : "₹" + value.toLocaleString("en-IN");
};

export default function ReportTable({ filteredReports, onSelectReport }) {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="text-sm font-bold text-gray-900 uppercase tracking-wider">
          Reports Table
        </div>
        <div className="text-xs text-gray-400">
          Showing {filteredReports.length} entries
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/60">
              {[
  "Store",
  "Sales",
  "Bills",
  "Deliveries",
  "Status",
].map((col) => (
                <th
                  key={col}
                  className="px-5 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
  {filteredReports.map((r, i) => (
    <tr
      key={r.id}
      onClick={() => {
  console.log("Clicked report:", r);
  navigate(`/daily-reports/report/${r.id}`);
}}
      className={`border-b border-gray-50 hover:bg-blue-50/30 transition-colors cursor-pointer ${
        i === filteredReports.length - 1 ? "border-b-0" : ""
      }`}
    >
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
            <Store size={14} className="text-blue-600" />
          </div>

          <span className="font-semibold text-gray-900">
            {r.store}
          </span>
        </div>
      </td>

      <td className="px-5 py-4 font-semibold">
  {fmt(r.sales)}
</td>

      <td className="px-5 py-4">
        {r.bills}
      </td>

      <td className="px-5 py-4">
        {r.deliveries}
      </td>

      <td className="px-5 py-4">
        <StatusBadge status={r.status} />
      </td>
    </tr>
  ))}
</tbody>
        </table>
      </div>
    </div>
  );
}