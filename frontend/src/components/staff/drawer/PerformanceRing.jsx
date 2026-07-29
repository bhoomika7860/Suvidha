export default function PerformanceRing({
  score = 0,
}) {
  const radius = 65;
  const stroke = 10;

  const normalized =
    radius * 2 * Math.PI;

  const offset =
    normalized -
    (score / 100) * normalized;

  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6">

      <h3 className="mb-6 text-lg font-semibold text-[#111827]">
        Overall Performance Score
      </h3>

      <div className="flex justify-center">

        <div className="relative h-44 w-44">

          <svg
            className="-rotate-90"
            width="176"
            height="176"
          >
            <circle
              cx="88"
              cy="88"
              r={radius}
              fill="none"
              stroke="#E5E7EB"
              strokeWidth={stroke}
            />

            <circle
              cx="88"
              cy="88"
              r={radius}
              fill="none"
              stroke="#2563EB"
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={normalized}
              strokeDashoffset={offset}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">

            <span className="text-4xl font-bold text-[#111827]">
              {score}%
            </span>

            <span className="mt-2 text-sm text-[#6B7280]">
              Performance Score
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}