import {
  Receipt,
  Wallet,
  ClipboardCheck,
  Database,
  ChevronRight,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { taskService } from "../../services/taskService";

export default function TaskCard() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    try {
      const data = await taskService.getMyTasks();

      setTasks(
        data.filter((task) => task.status !== "completed")
      );
    } catch (err) {
      console.error(err);
    }
  }

  function getIcon(title) {
    const text = title.toLowerCase();

    if (text.includes("receive"))
      return Receipt;

    if (text.includes("expense"))
      return Wallet;

    if (text.includes("check"))
      return ClipboardCheck;

    if (
      text.includes("system") ||
      text.includes("enter")
    )
      return Database;

    return Receipt;
  }

  function getColor(title) {
    const text = title.toLowerCase();

    if (text.includes("receive"))
      return "bg-blue-100 text-blue-600";

    if (text.includes("expense"))
      return "bg-green-100 text-green-600";

    if (text.includes("check"))
      return "bg-orange-100 text-orange-600";

    if (
      text.includes("system") ||
      text.includes("enter")
    )
      return "bg-violet-100 text-violet-600";

    return "bg-gray-100 text-gray-600";
  }

  return (
    <div
      onClick={() => navigate("/staff-tasks")}
      className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 cursor-pointer hover:shadow-md hover:border-blue-300 transition"
    >
      <h2 className="text-2xl font-bold">
        Today's Tasks
      </h2>

      <p className="text-gray-500 mt-1">
        Complete these tasks before leaving today.
      </p>

      <div className="mt-6 space-y-4">

        {tasks.length === 0 ? (

          <div className="text-center text-gray-500 py-8">
            No pending tasks.
          </div>

        ) : (

          tasks.map((task) => {
            const Icon = getIcon(task.title);

            return (
              <div
                key={task.id}
                className="flex items-center justify-between border rounded-xl p-4 hover:border-blue-400"
              >

                <div className="flex items-center gap-4">

                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${getColor(
                      task.title
                    )}`}
                  >
                    <Icon size={22} />
                  </div>

                  <div>

                    <h3 className="font-semibold">
                      {task.title}
                    </h3>

                    <p className="text-sm text-gray-500">
                      Pending
                    </p>

                  </div>

                </div>

                <ChevronRight className="text-gray-400" />

              </div>
            );
          })

        )}

      </div>

    </div>
  );
}