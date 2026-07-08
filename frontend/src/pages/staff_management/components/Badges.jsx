import { ChevronDown } from "lucide-react";

export function RoleBadge({ role }) {
  const styles = {
    owner: "bg-blue-50 text-blue-700 border border-blue-200",
    store_manager: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    staff: "bg-purple-50 text-purple-700 border border-purple-200",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
        styles[role] || styles.staff
      }`}
    >
      {role === "store_manager"
        ? "Manager"
        : role.charAt(0).toUpperCase() + role.slice(1)}
    </span>
  );
}

export function StatusBadge({ active }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
        active
          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
          : "bg-gray-100 text-gray-500 border border-gray-200"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          active ? "bg-emerald-500" : "bg-gray-400"
        }`}
      />
      {active ? "Active" : "Inactive"}
    </span>
  );
}

export function Select({ value, onChange, options }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-white border border-[#E5E7EB] rounded-xl px-3 py-2 pr-8 text-sm"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      <ChevronDown
        size={14}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"
      />
    </div>
  );
}