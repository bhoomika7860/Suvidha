import { useEffect, useState } from "react";
import {
  Clock3,
  CheckCircle2,
} from "lucide-react";

import { taskService } from "../../services/taskService";

export default function RecentActivity() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    loadActivities();
  }, []);

  async function loadActivities() {
    try {
      const tasks = await taskService.getMyTasks();

      const completed = tasks
        .filter(task => task.status === "completed")
        .slice(0, 5);

      setActivities(completed);

    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">

      <div className="flex justify-between items-center">

        <h2 className="text-2xl font-bold">
          Recent Activity
        </h2>

        <Clock3 className="text-gray-400" />

      </div>

      <div className="mt-6 space-y-4">

        {activities.length === 0 ? (

          <p className="text-gray-500">
            No recent activity.
          </p>

        ) : (

          activities.map((task) => (

            <div
              key={task.id}
              className="flex items-center gap-3 border-b last:border-none pb-4 last:pb-0"
            >

              <CheckCircle2
                size={18}
                className="text-green-600"
              />

              <span className="text-gray-700">
                {task.title}
              </span>

            </div>

          ))

        )}

      </div>

    </div>
  );
}