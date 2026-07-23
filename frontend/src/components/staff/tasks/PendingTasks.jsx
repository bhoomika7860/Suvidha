import { useState } from "react";
import TaskDrawer from "./TaskDrawer";

export default function PendingTasks({
  tasks,
  onComplete,
}) {
  const [selectedTask, setSelectedTask] = useState(null);

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

        {/* Header */}

        <div className="px-6 py-5 border-b">
          <h2 className="text-2xl font-bold">
            Pending Tasks
          </h2>
        </div>

        {/* Table */}

        <table className="w-full">

          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-4">
                Task
              </th>

              <th className="text-right px-6 py-4">
                Status
              </th>
            </tr>
          </thead>

          <tbody>

            {tasks.length === 0 ? (

              <tr>
                <td
                  colSpan={2}
                  className="py-12 text-center text-gray-500"
                >
                  No pending tasks.
                </td>
              </tr>

            ) : (

              tasks.map((task) => (

                <tr
                  key={task.id}
                  onClick={() => setSelectedTask(task)}
                  className="border-t cursor-pointer hover:bg-blue-50 transition"
                >

                  <td className="px-6 py-5 font-medium">
                    {task.title}
                  </td>

                  <td className="px-6 py-5 text-right">

                    <span className="inline-flex px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-medium">
                      Pending
                    </span>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

      <TaskDrawer
        task={selectedTask}
        isOpen={selectedTask !== null}
        onClose={() => setSelectedTask(null)}
        onComplete={onComplete}
      />

    </>
  );
}