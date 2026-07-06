const STATUS_STYLES = {
  "Out of Stock": { background: "#FEF2F2", color: "#DC2626" },
  "Supplier Delay": { background: "#FFFBEB", color: "#D97706" },
  Expired: { background: "#FFF7ED", color: "#EA580C" },
};

export default function StatusChip({ status }) {
  const style = STATUS_STYLES[status] ?? { background: "#F1F5F9", color: "#6B7280" };

  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold"
      style={style}
    >
      {status}
    </span>
  );
}
