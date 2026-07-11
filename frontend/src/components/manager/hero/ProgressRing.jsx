export default function ProgressRing({ progress = 65 }) {

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-24 h-24">

      <svg
        className="absolute inset-0 -rotate-90"
        width="96"
        height="96"
      >
        {/* Background */}
        <circle
          cx="48"
          cy="48"
          r={radius}
          stroke="#E5E7EB"
          strokeWidth="7"
          fill="none"
        />

        {/* Progress */}
        <circle
          cx="48"
          cy="48"
          r={radius}
          stroke="#2563EB"
          strokeWidth="7"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>

      <span className="text-2xl font-semibold text-gray-900">
        {progress}%
      </span>

    </div>
  );
}