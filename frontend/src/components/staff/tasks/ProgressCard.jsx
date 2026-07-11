export default function ProgressCard({
  completed,
  total,
}) {

  const percent =
    total === 0
      ? 0
      : Math.round((completed / total) * 100);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">

      <div className="flex justify-between items-center">

        <div>

          <h2 className="text-2xl font-bold">
            Today's Progress
          </h2>

          <p className="text-gray-500 mt-1">
            {completed} of {total} tasks completed
          </p>

        </div>

        <h2 className="text-4xl font-bold text-blue-600">

          {percent}%

        </h2>

      </div>

      <div className="mt-6 h-3 rounded-full bg-gray-200">

        <div
          className="h-3 rounded-full bg-blue-600 transition-all duration-500"
          style={{
            width: `${percent}%`,
          }}
        />

      </div>

    </div>
  );
}