import {
  Receipt,
  Wallet,
  Database,
  ChevronRight,
  Circle,
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
      setTasks(data);
    } catch (err) {
      console.error(err);
    }
  }

  const pendingTasks = tasks.filter(
    (task) => task.status !== "completed"
  );

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  );

  const totalTasks = tasks.length;

  const progress =
    totalTasks === 0
      ? 0
      : Math.round(
          (completedTasks.length / totalTasks) * 100
        );

  function getIcon(title) {
    const text = title.toLowerCase();

    if (text.includes("receive"))
      return Receipt;

    if (text.includes("expense"))
      return Wallet;

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

    if (
      text.includes("system") ||
      text.includes("enter")
    )
      return "bg-violet-100 text-violet-600";

    return "bg-gray-100 text-gray-600";
  }

  return (
    <>
      {/* ================= Desktop ================= */}

      <div
        onClick={() => navigate("/staff-tasks")}
        className="hidden lg:block bg-white border border-gray-200 rounded-2xl shadow-sm p-6 cursor-pointer hover:shadow-md hover:border-blue-300 transition"
      >
        <h2 className="text-2xl font-bold">
          Today's Tasks
        </h2>

        <p className="text-gray-500 mt-1">
          Complete these tasks before leaving today.
        </p>

        <div className="mt-6 space-y-4">

          {pendingTasks.length === 0 ? (

            <div className="text-center text-gray-500 py-8">
              No pending tasks.
            </div>

          ) : (

            pendingTasks.map((task) => {
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

      {/* ================= Mobile ================= */}

      <div className="lg:hidden bg-white rounded-2xl border border-gray-200 shadow-sm min-h-[440px] overflow-hidden">

        {/* Progress */}

        <div className="p-5 border-b border-gray-100">

          <h2 className="text-lg font-semibold">
            Today's Progress
          </h2>

          <div className="mt-5 h-3 bg-gray-200 rounded-full overflow-hidden">

            <div
              className="h-full rounded-full bg-blue-600 transition-all"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

          <p className="mt-3 text-sm text-gray-500">
            {completedTasks.length} of {totalTasks} tasks completed
          </p>

        </div>

        {/* Tasks */}

        <div className="p-5">

          <h2 className="text-lg font-semibold mb-5">
            Today's Tasks
          </h2>

          {pendingTasks.length === 0 ? (

            <div className="flex flex-col items-center justify-center h-60 text-center">

              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">

                <ChevronRight
                  size={28}
                  className="rotate-90 text-green-600"
                />

              </div>

              <h3 className="mt-5 text-lg font-semibold">
                You're all caught up!
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                No pending tasks for today.
              </p>

            </div>

          ) : (

            <div className="space-y-4">

              {pendingTasks.map((task) => {
                const Icon = getIcon(task.title);

                return (

                  <button
                    key={task.id}
                    onClick={() =>
                      navigate("/staff-tasks")
                    }
                    className="w-full flex items-center justify-between rounded-xl border border-gray-200 p-4 hover:border-blue-300 transition"
                  >

                    <div className="flex items-center gap-4">

                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${getColor(
                          task.title
                        )}`}
                      >
                        <Icon size={18} />
                      </div>

                      <div className="text-left">

                        <p className="font-medium">
                          {task.title}
                        </p>

                        <p className="text-xs text-gray-500">
                          Pending
                        </p>

                      </div>

                    </div>

                    <ChevronRight
                      size={18}
                      className="text-gray-400"
                    />

                  </button>

                );
              })}

            </div>

          )}

        </div>

      </div>
    </>
  );
}