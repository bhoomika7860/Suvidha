function StatCard({
  title,
  value,
  color,
}) {
  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">

      <p className="text-sm text-[#6B7280]">
        {title}
      </p>

      <h2
        className="mt-2 text-3xl font-bold"
        style={{ color }}
      >
        {value}
      </h2>

    </div>
  );
}

export default function PerformanceSummary({
  performance,
}) {
  return (
    <div>

      <h3 className="mb-4 text-lg font-semibold text-[#111827]">
        Performance Summary
      </h3>

      <div className="grid grid-cols-2 gap-4">

        <StatCard
          title="Completed Tasks"
          value={performance.completed_tasks}
          color="#16A34A"
        />

        <StatCard
          title="Assigned Tasks"
          value={performance.assigned_tasks}
          color="#2563EB"
        />

        <StatCard
          title="Pending Tasks"
          value={performance.pending_tasks}
          color="#DC2626"
        />

        <StatCard
          title="Completion Rate"
          value={`${performance.completion_rate}%`}
          color="#7C3AED"
        />

      </div>

    </div>
  );
}