import { useEffect, useState } from "react";
import { CheckCircle2, Clock3, Circle } from "lucide-react";
import analyticsService from "../../services/analyticsService";

export default function ProgressChecklist() {
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await analyticsService.getManagerDashboard();
        setProgress(data.progress);
      } catch (err) {
        console.error(err);
      }
    }

    load();
  }, []);

  if (!progress) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        Loading...
      </div>
    );
  }

  const items = [
    {
      text: "Sales Completed",
      status: progress.sales_completed ? "done" : "todo",
    },
    {
      text: "Expenses Added",
      status: progress.expenses_completed ? "done" : "todo",
    },
    {
      text: "Purchases Added",
      status: progress.purchases_completed ? "done" : "todo",
    },
    {
      text: "Deliveries Added",
      status: progress.deliveries_completed ? "done" : "todo",
    },
    
    {
      text: "Report Submitted",
      status: progress.report_submitted ? "done" : "todo",
    },
  ];

  const completed = items.filter(i => i.status === "done").length;
  const percent = (completed / items.length) * 100;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">

      <h2 className="text-lg font-semibold mb-5">
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
                className="text-green-500"
                size={18}
              />
            )}

            {item.status === "todo" && (
              <Circle
                className="text-gray-300"
                size={18}
              />
            )}

            {item.status === "pending" && (
              <Clock3
                className="text-orange-500"
                size={18}
              />
            )}

            <span className="text-[15px] text-gray-700">
              {item.text}
            </span>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500 mt-6">
        {completed} of {items.length} completed
      </p>

      <div className="mt-2 h-1.5 rounded-full bg-gray-200">
        <div
          className="h-1.5 rounded-full bg-blue-600"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}