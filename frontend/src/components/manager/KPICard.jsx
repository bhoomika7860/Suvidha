export default function KPICard({
  icon,
  value,
  label,
  iconBg,
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">

      {/* Icon */}
      <div
        className="w-11 h-11 rounded-full flex items-center justify-center mb-5"
        style={{ backgroundColor: iconBg }}
      >
        {icon}
      </div>

      {/* Value */}
      <h2 className="text-3xl font-bold tracking-tight text-gray-900 leading-none">
        {value}
      </h2>

      {/* Label */}
      <p className="mt-3 text-sm font-medium text-gray-500">
        {label}
      </p>

    </div>
  );
}