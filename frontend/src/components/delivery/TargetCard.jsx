export default function TargetCard({ task }) {
  const completed = task?.completed_quantity || 0;
  const target = task?.target_quantity || 0;

  const percent =
    target > 0
      ? Math.min((completed / target) * 100, 100)
      : 0;

  return (
    <div className="bg-white rounded-2xl border shadow-sm p-5">

      <h2 className="text-xl font-bold">
        Today's Delivery Target
      </h2>

      <p className="mt-2 text-gray-500">
        {target} Deliveries Assigned
      </p>

      <div className="mt-6 h-3 w-full overflow-hidden rounded-full bg-gray-200">

        <div
          className="h-3 rounded-full bg-blue-600 transition-all duration-500"
          style={{
            width: `${percent}%`,
          }}
        />

      </div>

      <div className="mt-5 flex items-center justify-between">

        <div>
          <p className="text-sm text-gray-500">
            Completed
          </p>

          <p className="text-2xl font-bold text-blue-600">
            {completed}
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm text-gray-500">
            Remaining
          </p>

          <p className="text-2xl font-bold text-red-500">
            {Math.max(target - completed, 0)}
          </p>
        </div>

      </div>

    </div>
  );
}