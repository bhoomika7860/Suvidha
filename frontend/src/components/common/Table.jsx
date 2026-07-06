function Table({ children, className = "" }) {
  return <div className={`overflow-hidden rounded-xl border border-[#E2E8F0] bg-white ${className}`}>{children}</div>;
}

export default Table;
