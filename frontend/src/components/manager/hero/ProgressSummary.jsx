export default function ProgressSummary({
  completed,
  total,
}) {
  return (
    <div className="text-center">

      <p className="text-xs text-gray-500">
        Progress
      </p>

      <h2 className="text-2xl font-bold text-gray-900">
        {completed}/{total} sections
      </h2>

    </div>
  );
}