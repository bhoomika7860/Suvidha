function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-xl border border-[#E2E8F0] bg-white ${className}`}
      style={{ boxShadow: "0 4px 24px rgba(15,23,42,0.06)" }}
    >
      {children}
    </div>
  );
}

export default Card;
