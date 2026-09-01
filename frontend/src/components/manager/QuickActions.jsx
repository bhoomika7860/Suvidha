import {
  FileText,
  Plus,
  Package,
  ChevronRight,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      icon: FileText,
      text: "Continue Daily Report",
      primary: true,
      path: "/daily-report",
    },
    {
      icon: Plus,
      text: "Add Expense",
      path: "/manager-expenses",
    },
    {
      icon: Package,
      text: "Add Purchase",
      path: "/manager-purchases",
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">

      <h2 className="mb-5 text-lg font-semibold">
        Quick Actions
      </h2>

      <div className="space-y-3">

        {actions.map((action) => {

          const Icon = action.icon;

          return (
            <button
              key={action.text}
              onClick={() =>
                navigate(action.path)
              }
              className={`flex h-11 w-full items-center justify-between rounded-xl px-4 text-sm transition sm:h-12 ${
                action.primary
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "border border-gray-200 hover:bg-gray-50"
              }`}
            >

              <div className="flex items-center gap-3">

                <Icon size={18} />

                <span>
                  {action.text}
                </span>

              </div>

              <ChevronRight size={16} />

            </button>
          );

        })}

      </div>

    </div>
  );
}