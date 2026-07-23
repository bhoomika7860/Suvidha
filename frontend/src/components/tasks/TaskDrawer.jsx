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

  const status =
    task.status === "completed"
      ? "Completed"
      : "Pending";

  const statusColor =
    task.status === "completed"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/30 z-40"
      />

      <div className="fixed right-0 top-0 h-screen w-full sm:w-[470px] bg-white z-50 shadow-2xl flex flex-col">

        {/* Header */}

        <div className="flex items-center justify-between px-6 py-5 border-b">

          <div>
            <h2 className="text-3xl font-bold">
              Task Details
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {task.task}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <X size={22} />
          </button>

        </div>

        {/* Body */}

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">

          <InfoRow
            icon={<User size={20} />}
            title="Assigned To"
            value={task.employee}
          />

          <InfoRow
            icon={<Briefcase size={20} />}
            title="Role"
            value={task.role}
          />

          <InfoRow
            icon={<Building2 size={20} />}
            title="Store"
            value={task.store}
          />

          <InfoRow
            icon={<Activity size={20} />}
            title="Task Type"
            value={task.type || "Normal"}
          />

          <InfoRow
            icon={<Target size={20} />}
            title="Target"
            value={task.target || "-"}
          />

          <InfoRow
            icon={<Calendar size={20} />}
            title="Due Date"
            value={task.due || "-"}
          />

          <div>
            <p className="text-sm text-gray-500 mb-2">
              Status
            </p>

            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}
            >
              {status}
            </span>
          </div>

          {task.photo_url && (
            <div>

              <p className="text-sm text-gray-500 mb-2">
                Uploaded Photo
              </p>

              <img
                src={task.photo_url}
                alt="Task Proof"
                className="w-full rounded-xl border"
              />

            </div>
          )}

          {task.note && (
            <div>

              <p className="text-sm text-gray-500 mb-2">
                Employee Remarks
              </p>

              <div className="border rounded-xl p-3 bg-gray-50 whitespace-pre-wrap">
                {task.note}
              </div>

            </div>
          )}

        </div>

        {/* Footer */}

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

function InfoRow({ icon, title, value }) {
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
          {value || "-"}
        </p>

      </div>

    </div>
  );
}