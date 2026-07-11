import { CheckCircle2, Clock3, Circle } from "lucide-react";

const items = [
  { text: "Sales Completed", status: "done" },
  { text: "Expenses Added", status: "done" },
  { text: "Purchases Added", status: "done" },
  { text: "Deliveries Added", status: "pending" },
  { text: "Bounced Products Added", status: "todo" },
  { text: "Report Submitted", status: "todo" },
];

export default function ProgressChecklist() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">

      <h2 className="text-lg font-semibold mb-5">
        Today's Progress
      </h2>

      <div className="space-y-3">

        {items.map((item) => (
          <div key={item.text} className="flex items-center gap-3">

            {item.status === "done" && (
              <CheckCircle2 className="text-green-500" size={18} />
            )}

            {item.status === "pending" && (
              <Clock3 className="text-orange-500" size={18} />
            )}

            {item.status === "todo" && (
              <Circle className="text-gray-300" size={18} />
            )}

            <span className="text-[15px] text-gray-700">
    {item.text}
</span>

          </div>
        ))}

      </div>

      <p className="text-xs text-gray-500 mt-6">
        3 of 6 completed
      </p>

      <div className="mt-2 h-1.5 rounded-full bg-gray-200">

        <div className="h-2 w-1/2 rounded-full bg-blue-600"></div>

      </div>

    </div>
  );
}