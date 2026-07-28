import { useEffect, useState } from "react";
import { CheckCircle2, Circle, Clock3 } from "lucide-react";
import dailyReportsService from "../../services/dailyReportsService";

export default function ReportProgress() {
  const [report, setReport] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await dailyReportsService.getTodayReport();
        setReport(data);
      } catch (err) {
        console.error(err);
      }
    }

    load();
  }, []);

  if (!report) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        Loading...
      </div>
    );
  }

  const sections = [
    {
      title: "Sales",
      status:
        report.cash_sales +
          report.upi_sales +
          report.card_sales +
          report.udhaar_sales >
        0
          ? "done"
          : "todo",
    },
    {
      title: "Expenses",
      status:
        report.total_expenses > 0
          ? "done"
          : "todo",
    },
    {
      title: "Purchases",
      status:
        report.total_purchases > 0
          ? "done"
          : "todo",
    },
    {
      title: "Deliveries",
      status:
        report.deliveries > 0
          ? "done"
          : "todo",
    },
    
    
  ];

  const completed = sections.filter(
    (s) => s.status === "done"
  ).length;

  const percentage = (completed / sections.length) * 100;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">

      <div className="flex items-center justify-between mb-4">

        <div>

          <h2 className="text-lg font-semibold text-gray-900">
            Report Progress
          </h2>

          <p className="text-sm text-gray-500 mt-0.5">
            {completed} of {sections.length} sections completed
          </p>

        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
          report.is_locked
            ? "bg-green-100 text-green-700 border-green-200"
            : "bg-amber-100 text-amber-700 border-amber-200"
        }`}>
          {report.is_locked ? "Locked" : "Draft"}
        </span>

      </div>

      <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">

        <div
          className="h-full rounded-full bg-blue-600"
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>

      <div className="flex flex-wrap gap-3 mt-5">

        {sections.map((section) => {

          const isDone = section.status === "done";
          const isPending = section.status === "pending";

          return (
            <div
              key={section.title}
              className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium ${
                isDone
                  ? "bg-green-50 border-green-200 text-green-700"
                  : isPending
                  ? "bg-orange-50 border-orange-200 text-orange-700"
                  : "bg-gray-50 border-gray-200 text-gray-500"
              }`}
            >
              {isDone ? (
                <CheckCircle2 size={15} />
              ) : isPending ? (
                <Clock3 size={15} />
              ) : (
                <Circle size={15} />
              )}

              {section.title}
            </div>
          );
        })}

      </div>

    </div>
  );
}