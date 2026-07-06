import { useState } from "react";

export default function IconAction({ icon, label, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      title={label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150"
      style={{
        background: hovered ? "#F1F5F9" : "transparent",
        border: `1px solid ${hovered ? "#E5E7EB" : "transparent"}`,
        color: hovered ? "#111827" : "#6B7280",
      }}
    >
      {icon}
    </button>
  );
}