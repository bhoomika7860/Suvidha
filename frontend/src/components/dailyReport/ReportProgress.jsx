import { CheckCircle2, Circle, Clock3 } from "lucide-react";

const sections = [
  {
    title: "Sales",
    status: "done",
  },
  {
    title: "Expenses",
    status: "done",
  },
  {
    title: "Purchases",
    status: "pending",
  },
  {
    title: "Deliveries",
    status: "todo",
  },
  {
    title: "Bounced Products",
    status: "todo",
  },
  {
    title: "Notes",
    status: "todo",
  },
];

export default function ReportProgress() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">

        <div>

          <h2 className="text-lg font-semibold text-gray-900">
            Report Progress
          </h2>

          <p className="text-sm text-gray-500 mt-0.5">
            2 of 6 sections completed
          </p>

        </div>

        <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium border border-amber-200">
          Draft
        </span>

      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">

        <div className="w-1/3 h-full rounded-full bg-blue-600"></div>

      </div>

      {/* Status Pills */}
      <div className="flex flex-wrap gap-3 mt-5">

        {sections.map((section) => {

          const isDone = section.status === "done";
          const isPending = section.status === "pending";

          return (

            <div
              key={section.title}
              className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition

                ${
                  isDone
                    ? "bg-green-50 border-green-200 text-green-700"
                    : isPending
                    ? "bg-orange-50 border-orange-200 text-orange-700"
                    : "bg-gray-50 border-gray-200 text-gray-500"
                }
              `}
            >

              {isDone && (
                <CheckCircle2 size={15} />
              )}

              {isPending && (
                <Clock3 size={15} />
              )}

              {!isDone && !isPending && (
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