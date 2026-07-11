import { ChevronRight } from "lucide-react";

export default function TaskCard({ task }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition">

      <div className="flex justify-between items-start">

        <div>

          <h3 className="text-xl font-bold">
            {task.task}
          </h3>

          <p className="text-gray-500 mt-1">
            {task.employee}
          </p>

          <p className="text-sm text-gray-400">
            {task.role} • {task.store}
          </p>

        </div>

        <ChevronRight className="text-gray-400" />

      </div>

      <div className="mt-5">

        <div className="flex justify-between text-sm">

          <span>Progress</span>

          <span>{task.progress}%</span>

        </div>

        <div className="h-3 rounded-full bg-gray-200 mt-2 overflow-hidden">

          <div
            className="bg-blue-600 h-full"
            style={{
              width: `${task.progress}%`,
            }}
          />

        </div>

      </div>

      <div className="mt-5 flex flex-wrap gap-2">

        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm">
          {task.type}
        </span>

        <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm">
          {task.due}
        </span>

        {task.requiresPhoto && (

          <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
            Photo Required
          </span>

        )}

      </div>

    </div>
  );
}