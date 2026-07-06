import { Lock } from "lucide-react";

export default function StatusBadge({ status }) {
  const locked = status === "LOCKED" || status === "Locked";

  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide"
      style={{
        background: locked ? "#FEF2F2" : "#F0FDF4",
        color: locked ? "#DC2626" : "#16A34A",
        border: `1px solid ${locked ? "#FECACA" : "#BBF7D0"}`,
      }}
    >
      {locked ? (
        <Lock size={11} />
      ) : (
        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#16A34A" }} />
      )}
      {locked ? "LOCKED" : "OPEN"}
    </span>
  );
}