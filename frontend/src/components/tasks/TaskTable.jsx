import { useState } from "react";
import TaskDrawer from "./TaskDrawer";

export default function TaskTable({ tasks }) {

  const [selectedTask, setSelectedTask] = useState(null);

  return (

    <>
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-50">

            <tr>

              <th className="text-left px-5 py-4">Task</th>

              <th className="text-left px-5 py-4">Assigned To</th>

              <th className="text-left px-5 py-4">Store</th>

              <th className="text-left px-5 py-4">Progress</th>

              <th className="text-left px-5 py-4">Due</th>

              <th className="text-left px-5 py-4">Status</th>

            </tr>

          </thead>

          <tbody>

            {tasks.map(task => (

              <tr
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className="border-t hover:bg-gray-50 cursor-pointer"
              >

                <td className="px-5 py-4 font-semibold">
                  {task.task}
                </td>

                <td className="px-5 py-4">
                  {task.employee}
                </td>

                <td className="px-5 py-4">
                  {task.store}
                </td>

                <td className="px-5 py-4">
                  {task.progress}%
                </td>

                <td className="px-5 py-4">
                  {task.due}
                </td>

                <td className="px-5 py-4">

                  <span
                    className={`px-3 py-1 rounded-full text-sm
                    ${
                      task.progress === 100
                        ? "bg-green-100 text-green-700"
                        : task.progress === 0
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >

                    {task.progress === 100
                      ? "Completed"
                      : task.progress === 0
                      ? "Pending"
                      : "In Progress"}

                  </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      <TaskDrawer
        task={selectedTask}
        isOpen={selectedTask !== null}
        onClose={() => setSelectedTask(null)}
      />

    </>

  );

}