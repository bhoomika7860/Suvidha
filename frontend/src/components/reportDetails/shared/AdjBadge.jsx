import { CheckCircle2, Clock, XCircle } from "lucide-react";

const BADGE_MAP = {
  Pending: { background: "#FFFBEB", color: "#D97706", icon: <Clock size={11} /> },
  Approved: { background: "#F0FDF4", color: "#16A34A", icon: <CheckCircle2 size={11} /> },
  Rejected: { background: "#FEF2F2", color: "#DC2626", icon: <XCircle size={11} /> },
};

export default function AdjBadge({ status }) {
  const badge = BADGE_MAP[status] ?? BADGE_MAP.Pending;

  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold"
      style={{ background: badge.background, color: badge.color }}
    >
      {badge.icon}
      {status}
    </span>
  );
}
