export default function KPICard({
  icon,
  value,
  label,
  iconBg,

  valueColor = "text-gray-900",

  split = false,

  topIcon,
  topValue,
  topLabel,

  bottomIcon,
  bottomValue,
  bottomLabel,
}) {
  if (split) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">

        <div className="flex items-center gap-3">

          <div
            className="w-10 h-10 rounded-full flex items-center justify-center bg-green-50"
          >
            {topIcon}
          </div>

          <div>
            <h2 className="text-2xl font-bold">
              {topValue}
            </h2>

            <p className="text-sm text-gray-500">
              {topLabel}
            </p>
          </div>

        </div>

        <div className="my-4 border-t" />

        <div className="flex items-center gap-3">

          <div
            className="w-10 h-10 rounded-full flex items-center justify-center bg-violet-50"
          >
            {bottomIcon}
          </div>

          <div>
            <h2 className="text-2xl font-bold">
              {bottomValue}
            </h2>

            <p className="text-sm text-gray-500">
              {bottomLabel}
            </p>
          </div>

        </div>

      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">

      <div
        className="w-11 h-11 rounded-full flex items-center justify-center mb-5"
        style={{ backgroundColor: iconBg }}
      >
        {icon}
      </div>

      <h2 className={`text-3xl font-bold tracking-tight leading-none ${valueColor}`}>
        {value}
      </h2>

      <p className="mt-3 text-sm font-medium text-gray-500">
        {label}
      </p>

    </div>
  );
}