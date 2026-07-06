function Badge({ children, className = "" }) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${className}`}>{children}</span>;
}

export default Badge;
