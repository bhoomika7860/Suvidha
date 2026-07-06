function Header({ children, className = "" }) {
  return <header className={`border-b border-[#E2E8F0] bg-[#F8FAFC]/95 ${className}`}>{children}</header>;
}

export default Header;
