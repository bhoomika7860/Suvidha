export default function PriorityChip({ priority }) {
  const isHigh = priority === "High";

  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold"
      style={
        isHigh
          ? { background: "transparent", color: "#DC2626", border: "1px solid #DC2626" }
          : { background: "#F1F5F9", color: "#6B7280" }
      }
    >
      {priority}
    </span>
  );
}
