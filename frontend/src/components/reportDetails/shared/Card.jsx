export default function Card({ children, className = "", style = {} }) {
  return (
    <div
      className={`rounded-2xl ${className}`}
      style={{
        background: "#FFFFFF",
        border: "1px solid #E5E7EB",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}