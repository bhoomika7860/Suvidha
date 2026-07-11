import {
  Receipt,
  Wallet,
  ClipboardCheck,
  Database,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const tasks = [
  {
    title: "Receive Purchase Bills",
    count: 3,
    color: "bg-blue-100 text-blue-600",
    icon: Receipt,
  },
  {
    title: "Add Daily Expenses",
    count: 2,
    color: "bg-green-100 text-green-600",
    icon: Wallet,
  },
  {
    title: "Check Purchase Bills",
    count: 4,
    color: "bg-orange-100 text-orange-600",
    icon: ClipboardCheck,
  },
  {
    title: "Enter Bills Into System",
    count: 1,
    color: "bg-violet-100 text-violet-600",
    icon: Database,
  },
];


export default function TaskCard() {
    const navigate = useNavigate();
  return (
    <div
  onClick={() => navigate("/staff-tasks")}
  className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 cursor-pointer hover:shadow-md hover:border-blue-300 transition"
>
    <div
  role="button"
  tabIndex={0}
  onClick={() => navigate("/staff-tasks")}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      navigate("/staff-tasks");
    }
  }}
  className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 cursor-pointer hover:shadow-md hover:border-blue-300 transition"
></div>

      <h2 className="text-2xl font-bold">
        Today's Tasks
      </h2>

      <p className="text-gray-500 mt-1">
        Complete these tasks before leaving today.
      </p>

      <div className="mt-6 space-y-4">

        {tasks.map((task) => {
          const Icon = task.icon;

          return (
            <div
              key={task.title}
              className="flex items-center justify-between border rounded-xl p-4 hover:border-blue-400 cursor-pointer transition"
            >

              <div className="flex items-center gap-4">

                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${task.color}`}>

                  <Icon size={22} />

                </div>

                <div>

                  <h3 className="font-semibold">
                    {task.title}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {task.count} pending
                  </p>

                </div>

              </div>

              <ChevronRight className="text-gray-400" />

            </div>
          );
        })}

      </div>

    </div>
  );
}