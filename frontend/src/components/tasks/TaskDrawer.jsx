import {
  X,
  User,
  Building2,
  Briefcase,
  Calendar,
  Target,
  Camera,
  CheckCircle2,
} from "lucide-react";

export default function TaskDrawer({
  task,
  isOpen,
  onClose,
}) {
  if (!isOpen || !task) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/30 z-40"
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-screen w-full sm:w-[470px] bg-white z-50 shadow-2xl flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b">

          <h2 className="text-3xl font-bold">
            Task Details
          </h2>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <X size={22} />
          </button>

        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-7">

          <InfoRow
            icon={<Target size={22} />}
            title="Task"
            value={task.task}
          />

          <InfoRow
            icon={<User size={22} />}
            title="Assigned To"
            value={task.employee}
          />

          <InfoRow
            icon={<Briefcase size={22} />}
            title="Role"
            value={task.role}
          />

          <InfoRow
            icon={<Building2 size={22} />}
            title="Store"
            value={task.store}
          />

          <InfoRow
            icon={<Calendar size={22} />}
            title="Due"
            value={task.due}
          />

          <InfoRow
            icon={<Target size={22} />}
            title="Progress"
            value={`${task.progress}%`}
          />

          <InfoRow
            icon={<Camera size={22} />}
            title="Photo Required"
            value={task.requiresPhoto ? "Yes" : "No"}
          />

          <InfoRow
            icon={<CheckCircle2 size={22} />}
            title="Status"
            value={
              task.progress === 100
                ? "Completed"
                : task.progress === 0
                ? "Pending"
                : "In Progress"
            }
          />

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

      <div className="text-gray-500 mt-1">
        {icon}
      </div>

      <div>

        <p className="text-sm text-gray-500">
          {title}
        </p>

        <p className="text-lg font-semibold">
          {value}
        </p>

      </div>

    </div>
  );
}