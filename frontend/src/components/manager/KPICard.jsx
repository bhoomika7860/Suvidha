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
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">

        {/* TOP */}

        <div className="flex items-center gap-3">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-50 sm:h-10 sm:w-10">
            {topIcon}
          </div>

          <div className="min-w-0">

            <h2 className="text-xl font-bold sm:text-2xl">
              {topValue}
            </h2>

            <p className="text-xs text-gray-500 sm:text-sm">
              {topLabel}
            </p>

          </div>

        </div>


        <div className="my-3 border-t sm:my-4" />


        {/* BOTTOM */}

        <div className="flex items-center gap-3">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-50 sm:h-10 sm:w-10">
            {bottomIcon}
          </div>

          <div className="min-w-0">

            <h2 className="text-xl font-bold sm:text-2xl">
              {bottomValue}
            </h2>

            <p className="text-xs text-gray-500 sm:text-sm">
              {bottomLabel}
            </p>

          </div>

        </div>

      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">

      <div
        className="mb-4 flex h-9 w-9 items-center justify-center rounded-full sm:mb-5 sm:h-11 sm:w-11"
        style={{
          backgroundColor: iconBg,
        }}
      >
        {icon}
      </div>

      <h2
        className={`text-2xl font-bold leading-none tracking-tight sm:text-3xl ${valueColor}`}
      >
        {value}
      </h2>

      <p className="mt-2 text-xs font-medium text-gray-500 sm:mt-3 sm:text-sm">
        {label}
      </p>

    </div>
  );
}