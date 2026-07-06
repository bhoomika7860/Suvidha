const statusConfig = {
  Locked: {
    color: "text-green-700",
    bg: "bg-green-50 border border-green-200",
    dot: "bg-green-500",
  },
  Pending: {
    color: "text-amber-700",
    bg: "bg-amber-50 border border-amber-200",
    dot: "bg-amber-400",
  },
  "Adjustment Requested": {
    color: "text-red-700",
    bg: "bg-red-50 border border-red-200",
    dot: "bg-red-500",
  },
};

function StatusBadge({ status, className = "" }) {
  const cfg = statusConfig[status] || statusConfig.Pending;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${cfg.color} ${cfg.bg} ${className}`}>
      <span className={`h-1.75 w-1.75 rounded-full ${cfg.dot}`} />
      {status}
    </span>
  );
}

export default StatusBadge;
