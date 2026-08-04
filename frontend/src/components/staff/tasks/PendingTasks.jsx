import { useState } from "react";
import {
  ChevronRight,
  Receipt,
  Wallet,
  Package,
  Truck,
} from "lucide-react";

import TaskDrawer from "./TaskDrawer";
import MobileTaskDrawer from "./MobileTaskDrawer";

export default function PendingTasks({
  tasks,
  onComplete,
}) {
  const [selectedTask, setSelectedTask] =
    useState(null);

  function getIcon(task) {
    const type =
      task.task_type || task.type;

    if (type === "sales")
      return Wallet;

    if (type === "delivery")
      return Truck;

    if (
      task.title
        ?.toLowerCase()
        .includes("expense")
    )
      return Receipt;

    return Package;
  }

  function getSubtitle(task) {
    const type =
      task.task_type || task.type;

    if (type === "sales")
      return `Target: ₹${task.assigned_target ?? task.target_quantity}`;

    if (type === "delivery")
      return `Target: ${task.assigned_target ?? task.target_quantity} Deliveries`;

    return "Normal Task";
  }

  return (
    <>
      {/* ================= Desktop ================= */}

      <div className="hidden lg:block bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

        <div className="px-6 py-5 border-b">
          <h2 className="text-2xl font-bold">
            Pending Tasks
          </h2>
        </div>

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
                  onClick={() =>
                    setSelectedTask(task)
                  }
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

      {/* ================= Mobile ================= */}

      <div className="lg:hidden">

        {tasks.length === 0 ? (

          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm py-16 px-6 text-center">

            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">

              <Receipt
                size={28}
                className="text-green-600"
              />

            </div>

            <h3 className="mt-5 text-lg font-semibold">
              You're all caught up
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              No pending tasks today.
            </p>

          </div>

        ) : (

          <div className="space-y-4">

            {tasks.map((task) => {

              const Icon = getIcon(task);

              return (

                <button
                  key={task.id}
                  onClick={() =>
                    setSelectedTask(task)
                  }
                  className="w-full bg-white rounded-3xl border border-gray-200 shadow-sm p-5 flex items-center justify-between active:scale-[0.98] transition"
                >

                  <div className="flex gap-4">

                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">

                      <Icon
                        size={22}
                        className="text-blue-600"
                      />

                    </div>

                    <div className="text-left">

                      <h3 className="font-semibold text-[16px] leading-tight">
                        {task.title}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        {getSubtitle(task)}
                      </p>

                      <span className="inline-flex mt-3 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium">
                        Pending
                      </span>

                    </div>

                  </div>

                  <ChevronRight
                    size={20}
                    className="text-gray-400 shrink-0"
                  />

                </button>

              );

            })}

          </div>

        )}

      </div>

      {/* ================= Desktop Drawer ================= */}

      <div className="hidden lg:block">

        <TaskDrawer
          task={selectedTask}
          isOpen={selectedTask !== null}
          onClose={() =>
            setSelectedTask(null)
          }
          onComplete={onComplete}
        />

      </div>

      {/* ================= Mobile Drawer ================= */}

      <div className="lg:hidden">

        <MobileTaskDrawer
          task={selectedTask}
          isOpen={selectedTask !== null}
          onClose={() =>
            setSelectedTask(null)
          }
          onComplete={onComplete}
        />

      </div>

    </>
  );
}