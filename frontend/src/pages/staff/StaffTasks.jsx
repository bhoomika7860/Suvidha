import { useEffect, useState } from "react";
import { taskService } from "../../services/taskService";

import ProgressCard from "../../components/staff/tasks/ProgressCard";
import PendingTasks from "../../components/staff/tasks/PendingTasks";
import CompletedTasks from "../../components/staff/tasks/CompletedTasks";

export default function StaffTasks() {
  const [pendingTasks, setPendingTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    try {
      const tasks = await taskService.getMyTasks();

      setPendingTasks(
        tasks.filter((t) => t.status !== "completed")
      );

      setCompletedTasks(
        tasks.filter((t) => t.status === "completed")
      );
    } catch (err) {
      console.error(err);
    }
  }

  async function completeTask(task) {
    try {
      await taskService.completeTask(task.id, task);
      await loadTasks();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      {/* ================= Desktop ================= */}

      <div className="hidden lg:block space-y-6">

        <div>
          <h1 className="text-3xl font-bold">
            My Tasks
          </h1>

          <p className="text-gray-500 mt-1">
            Complete today's assigned work.
          </p>
        </div>

        <ProgressCard
          completed={completedTasks.length}
          total={
            pendingTasks.length +
            completedTasks.length
          }
        />

        <PendingTasks
          tasks={pendingTasks}
          onComplete={completeTask}
        />

        <CompletedTasks
          tasks={completedTasks}
        />

      </div>

      {/* ================= Mobile ================= */}

      <div className="lg:hidden min-h-screen bg-gray-50 pb-24">

        {/* Header */}

        <div className="bg-white px-5 pt-6 pb-5 border-b">

          <h1 className="text-3xl font-bold">
            My Tasks
          </h1>

          <p className="text-gray-500 mt-2">
            Complete today's assigned work.
          </p>

        </div>

        {/* Content */}

        <div className="px-4 py-5 space-y-5">

          <ProgressCard
            completed={completedTasks.length}
            total={
              pendingTasks.length +
              completedTasks.length
            }
          />

          <PendingTasks
            tasks={pendingTasks}
            onComplete={completeTask}
          />

          <CompletedTasks
            tasks={completedTasks}
          />

        </div>

      </div>
    </>
  );
}