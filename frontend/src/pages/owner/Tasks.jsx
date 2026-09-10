import { useEffect, useState } from "react";
import {
  Plus,
  ClipboardList,
  User,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
} from "lucide-react";

import { taskService } from "../../services/taskService";

import TasksHeader from "../../components/tasks/TasksHeader";
import TasksToolbar from "../../components/tasks/TasksToolbar";
import AssignTaskModal from "../../components/tasks/AssignTaskModal";
import TaskTable from "../../components/tasks/TaskTable";

export default function Tasks() {
  const [showModal, setShowModal] = useState(false);
  const [tasks, setTasks] = useState([]);

  async function loadTasks() {
    try {
      const data = await taskService.getTasks();

      console.log("Backend Tasks:", data);

      const formattedTasks = data.map((task) => ({
        id: task.id,

        task: task.title,

        employee: task.employee,

        role: task.role,

        store: task.store,

        type: task.type,

        target: task.target_quantity,

        completed: task.completed_quantity,

        progress: Math.round(
          task.completion_percentage ?? 0
        ),

        requiresPhoto: task.requiresPhoto,

        photo: task.photo_url,

        note: task.note,

        due: task.due_date,

        status: task.status,
      }));

      console.log(
        "Formatted Tasks:",
        formattedTasks
      );

      setTasks(formattedTasks);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function addTask(task) {
    try {
      await taskService.createTask({
        store_id: Number(task.store),

        assigned_to: Number(task.employee),

        task_title: task.task,

        task_type: task.type,

        role:
          task.role === "Store Manager"
            ? "store_manager"
            : task.role === "Delivery Boy"
            ? "delivery"
            : "staff",

        target_quantity: Number(
          task.target || 0
        ),

        requires_photo: task.requiresPhoto,
      });

      await loadTasks();

      setShowModal(false);
    } catch (err) {
      console.error(err);

      console.log(
        err.response?.data
      );

      alert(
        JSON.stringify(
          err.response?.data,
          null,
          2
        )
      );
    }
  }

  function getStatusClasses(status) {
    const normalized =
      String(status || "")
        .toLowerCase();

    if (
      normalized.includes("completed") ||
      normalized.includes("complete")
    ) {
      return "bg-green-50 text-green-600";
    }

    if (
      normalized.includes("progress") ||
      normalized.includes("assigned")
    ) {
      return "bg-blue-50 text-blue-600";
    }

    if (
      normalized.includes("pending") ||
      normalized.includes("waiting")
    ) {
      return "bg-amber-50 text-amber-600";
    }

    return "bg-slate-100 text-slate-600";
  }

  function formatDueDate(value) {
    if (!value) {
      return "No due date";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  }

  return (
    <>
      {/* =========================================================
          DESKTOP
      ========================================================= */}

      <div className="hidden lg:block space-y-6">
        <TasksHeader />

        <TasksToolbar
          onAssign={() =>
            setShowModal(true)
          }
        />

        <TaskTable
          tasks={tasks}
        />

        <AssignTaskModal
          open={showModal}
          onClose={() =>
            setShowModal(false)
          }
          onSave={addTask}
        />
      </div>


      {/* =========================================================
          MOBILE
      ========================================================= */}

      <div className="lg:hidden min-h-screen w-full min-w-0 overflow-x-hidden bg-gray-50 pb-24">

        {/* Header */}

        <div className="w-full border-b bg-white px-5 pt-6 pb-5">
          <div className="flex items-start justify-between gap-3">

            <div className="min-w-0">
              <h1 className="text-3xl font-bold text-gray-900">
                Tasks
              </h1>

              <p className="mt-1 text-gray-500">
                Manage and assign tasks across your stores.
              </p>
            </div>

            

          </div>
        </div>


        {/* Content */}

        <div className="px-4 pt-4">

          {/* Assign Task button */}

          <button
            type="button"
            onClick={() =>
              setShowModal(true)
            }
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <Plus size={16} />
            Assign Task
          </button>


          {/* Task list */}

          <div className="mt-4 space-y-3">

            {tasks.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white px-5 py-10 text-center shadow-sm">

                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <ClipboardList size={20} />
                </div>

                <p className="mt-3 text-sm font-semibold text-slate-900">
                  No tasks found
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Assigned tasks will appear here.
                </p>

              </div>
            ) : (
              tasks.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >

                  {/* Top row */}

                  <div className="flex items-start gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <ClipboardList size={18} />
                    </div>

                    <div className="min-w-0 flex-1">

                      <div className="flex items-start justify-between gap-2">

                        <h2 className="min-w-0 text-sm font-bold leading-5 text-slate-900">
                          {item.task || "Untitled task"}
                        </h2>

                        <span
                          className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize ${getStatusClasses(
                            item.status
                          )}`}
                        >
                          {item.status || "Pending"}
                        </span>

                      </div>

                      <p className="mt-1 text-xs text-slate-500">
                        {item.type || "Task"}
                      </p>

                    </div>

                  </div>


                  {/* Details */}

                  <div className="mt-4 grid grid-cols-2 gap-2">

                    <div className="rounded-xl bg-slate-50 px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <User
                          size={14}
                          className="shrink-0 text-slate-400"
                        />

                        <span className="truncate text-[11px] text-slate-500">
                          Employee
                        </span>
                      </div>

                      <p className="mt-1 truncate text-xs font-semibold text-slate-900">
                        {item.employee || "Unassigned"}
                      </p>
                    </div>


                    <div className="rounded-xl bg-slate-50 px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <Building2
                          size={14}
                          className="shrink-0 text-slate-400"
                        />

                        <span className="truncate text-[11px] text-slate-500">
                          Store
                        </span>
                      </div>

                      <p className="mt-1 truncate text-xs font-semibold text-slate-900">
                        {item.store || "—"}
                      </p>
                    </div>

                  </div>


                  {/* Progress */}

                  <div className="mt-3 rounded-xl border border-slate-200 px-3 py-2.5">

                    <div className="flex items-center justify-between gap-3">

                      <span className="text-xs font-medium text-slate-500">
                        Progress
                      </span>

                      <span className="text-xs font-bold text-slate-900">
                        {item.progress || 0}%
                      </span>

                    </div>

                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">

                      <div
                        className="h-full rounded-full bg-blue-600 transition-all"
                        style={{
                          width: `${Math.min(
                            Math.max(
                              Number(
                                item.progress || 0
                              ),
                              0
                            ),
                            100
                          )}%`,
                        }}
                      />

                    </div>

                    {item.target ? (
                      <p className="mt-1.5 text-[10px] text-slate-400">
                        {item.completed || 0} of{" "}
                        {item.target} completed
                      </p>
                    ) : null}

                  </div>


                  {/* Footer */}

                  <div className="mt-3 flex items-center justify-between gap-3 border-t border-slate-100 pt-3">

                    <div className="flex min-w-0 items-center gap-1.5">
                      <CalendarDays
                        size={14}
                        className="shrink-0 text-slate-400"
                      />

                      <span className="truncate text-[11px] text-slate-500">
                        {formatDueDate(
                          item.due
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">

                      {item.status ===
                      "completed" ? (
                        <CheckCircle2
                          size={14}
                          className="text-green-500"
                        />
                      ) : (
                        <Clock3
                          size={14}
                        />
                      )}

                      <span className="capitalize">
                        {item.role ||
                          "Staff"}
                      </span>

                    </div>

                  </div>

                </article>
              ))
            )}

          </div>

        </div>


        {/* Mobile Assign Task Modal */}

        <AssignTaskModal
          open={showModal}
          onClose={() =>
            setShowModal(false)
          }
          onSave={addTask}
        />

      </div>
    </>
  );
}
