import {
  X,
  User,
  Building2,
  Briefcase,
  Calendar,
  Target,
  Camera,
  Activity,
} from "lucide-react";

export default function TaskDrawer({
  task,
  isOpen,
  onClose,
}) {
  if (!isOpen || !task) return null;

  console.log(task);

  const taskType =
    task.type ||
    task.task_type ||
    "";

  const displayTaskType =
    taskType
      ? taskType.charAt(0).toUpperCase() +
        taskType.slice(1)
      : "-";

  const role =
    task.role === "store_manager"
      ? "Store Manager"
      : task.role === "delivery"
      ? "Delivery Boy"
      : task.role || "Staff";

  const target =
    task.target ??
    task.target_quantity ??
    0;

  const completed =
    task.completed ??
    task.completed_quantity ??
    0;

  const progress =
    task.progress ??
    task.completion_percentage ??
    0;

  const requiresPhoto =
    task.requiresPhoto ??
    task.requires_photo ??
    false;

  const photo =
    task.photo ??
    task.photo_url ??
    null;

  const note =
    task.note || "";

  const due =
    task.due ??
    task.due_date ??
    "-";

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/30 z-40"
      />

      <div className="fixed right-0 top-0 h-screen w-full sm:w-[470px] bg-white z-50 shadow-2xl flex flex-col">

        <div className="flex items-center justify-between px-6 py-5 border-b">

          <div>
            <h2 className="text-3xl font-bold">
              Task Details
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {task.task || task.task_title}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <X size={22} />
          </button>

        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">

          <InfoRow
            icon={<User size={20} />}
            title="Assigned To"
            value={
              task.employee ||
              task.employee_name ||
              "-"
            }
          />

          <InfoRow
            icon={<Briefcase size={20} />}
            title="Role"
            value={role}
          />

          <InfoRow
            icon={<Building2 size={20} />}
            title="Store"
            value={
              task.store ||
              task.store_name ||
              "-"
            }
          />

          <InfoRow
            icon={<Activity size={20} />}
            title="Task Type"
            value={displayTaskType}
          />

          <InfoRow
            icon={<Target size={20} />}
            title="Assigned Target"
            value={
              taskType === "sales"
                ? `₹${target}`
                : target
            }
          />

          <InfoRow
            icon={<Target size={20} />}
            title="Completed"
            value={
              taskType === "sales"
                ? `₹${completed}`
                : completed
            }
          />

          <div>

            <p className="text-sm text-gray-500 mb-2">
              Completion
            </p>

            <div className="w-full h-3 rounded-full bg-gray-200 overflow-hidden">

              <div
                className={`h-full ${
                  progress >= 100
                    ? "bg-green-500"
                    : "bg-blue-500"
                }`}
                style={{
                  width: `${progress}%`,
                }}
              />

            </div>

            <p className="mt-2 font-semibold">
              {progress}%
            </p>

          </div>

          <InfoRow
            icon={<Camera size={20} />}
            title="Photo Required"
            value={
              requiresPhoto
                ? "Yes"
                : "No"
            }
          />

          {requiresPhoto && (

            <div>

              <p className="text-sm text-gray-500 mb-3">
                Photo Proof
              </p>

              {photo ? (

                <img
                  src={photo}
                  alt="Task Proof"
                  className="rounded-xl border w-full max-h-72 object-cover"
                />

              ) : (

                <div className="border rounded-xl p-5 bg-gray-50 text-gray-500">
                  No photo uploaded.
                </div>

              )}

            </div>

          )}

          <div>

            <p className="text-sm text-gray-500 mb-2">
              Remarks
            </p>

            <div className="border rounded-xl p-4 bg-gray-50 min-h-[90px]">
              {note || "No remarks added."}
            </div>

          </div>

          <InfoRow
            icon={<Calendar size={20} />}
            title="Due Date"
            value={due}
          />

          <div>

            <p className="text-sm text-gray-500 mb-2">
              Status
            </p>

            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                task.status === "completed"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {task.status === "completed"
                ? "Completed"
                : "Pending"}
            </span>

          </div>

        </div>

        <div className="border-t p-5">

          <button
            onClick={onClose}
            className="w-full h-11 rounded-xl border hover:bg-gray-50"
          >
            Close
          </button>

        </div>

      </div>
    </>
  );
}

function InfoRow({
  icon,
  title,
  value,
}) {
  return (
    <div className="flex gap-4">

      <div className="text-blue-600 mt-1">
        {icon}
      </div>

      <div>

        <p className="text-sm text-gray-500">
          {title}
        </p>

        <p className="text-lg font-semibold break-words">
          {value ?? "-"}
        </p>

      </div>

    </div>
  );
}