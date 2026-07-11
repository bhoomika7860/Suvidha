import {
  FileText,
  Plus,
  Package,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";

const actions = [
  {
    icon: FileText,
    text: "Continue Daily Report",
    primary: true,
  },
  {
    icon: Plus,
    text: "Add Expense",
  },
  {
    icon: Package,
    text: "Add Purchase",
  },
  {
    icon: AlertTriangle,
    text: "Add Bounced Product",
  },
];

export default function QuickActions() {
  return (
    <div className="bg-white border-gray-200-gray-200 rounded-2xl p-5 shadow-sm">

      <h2 className="text-lg font-semibold mb-6">
        Quick Actions
      </h2>

      <div className="space-y-3">

        {actions.map((action) => {

          const Icon = action.icon;

          return (
            <button
              key={action.text}
              className={`w-full flex items-center justify-between rounded-xl px-4 h-12 transition ${
                action.primary
                  ? "bg-blue-600 text-white"
                  : "border hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3">

                <Icon size={18} />

                {action.text}

              </div>

              <ChevronRight size={16} />

            </button>
          );

        })}

      </div>

    </div>
  );
}