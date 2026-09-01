import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Circle,
} from "lucide-react";

import analyticsService from "../../services/analyticsService";

export default function ProgressChecklist() {
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data =
          await analyticsService.getManagerDashboard();

        setProgress(data.progress);
      } catch (err) {
        console.error(err);
      }
    }

    load();
  }, []);

  if (!progress) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
        Loading...
      </div>
    );
  }

  const items = [
    {
      text: "Sales Completed",
      status: progress.sales_completed
        ? "done"
        : "todo",
    },
    {
      text: "Expenses Added",
      status: progress.expenses_completed
        ? "done"
        : "todo",
    },
    {
      text: "Purchases Added",
      status: progress.purchases_completed
        ? "done"
        : "todo",
    },
    {
      text: "Deliveries Added",
      status: progress.deliveries_completed
        ? "done"
        : "todo",
    },
    {
      text: "Report Submitted",
      status: progress.report_submitted
        ? "done"
        : "todo",
    },
  ];

  const completed = items.filter(
    (item) => item.status === "done"
  ).length;

  const percent =
    (completed / items.length) * 100;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">

      <h2 className="mb-5 text-lg font-semibold">
        Today's Progress
      </h2>

      <div className="space-y-3">

        {items.map((item) => (

          <div
            key={item.text}
            className="flex items-center gap-3"
          >

            {item.status === "done" && (
              <CheckCircle2
                className="shrink-0 text-green-500"
                size={18}
              />
            )}

            {item.status === "todo" && (
              <Circle
                className="shrink-0 text-gray-300"
                size={18}
              />
            )}

            {item.status === "pending" && (
              <Clock3
                className="shrink-0 text-orange-500"
                size={18}
              />
            )}

            <span className="text-sm text-gray-700 sm:text-[15px]">
              {item.text}
            </span>

          </div>

        ))}

      </div>

      <p className="mt-5 text-xs text-gray-500">
        {completed} of {items.length} completed
      </p>

      <div className="mt-2 h-1.5 rounded-full bg-gray-200">

        <div
          className="h-1.5 rounded-full bg-blue-600"
          style={{
            width: `${percent}%`,
          }}
        />

      </div>

    </div>
  );
}