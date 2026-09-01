export default function ProgressRing({
  progress = 0,
  size = 64,
}) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;

  const offset =
    circumference -
    (progress / 100) * circumference;

  return (
    <div
      className="relative shrink-0"
      style={{
        width: size,
        height: size,
      }}
    >

      <svg
        width={size}
        height={size}
        className="-rotate-90"
      >

        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="7"
        />

        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#2563EB"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />

      </svg>

      <div className="absolute inset-0 flex items-center justify-center">

        <span className="text-sm font-semibold text-gray-900">
          {progress}%
        </span>

      </div>

    </div>
  );
}