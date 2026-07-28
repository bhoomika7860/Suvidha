export default function MobileKPICard({
  title,
  value,
  icon: Icon,
  iconBg,
  iconColor,
}) {
  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-4">

      <div className="flex justify-between items-start">

        <div>

          <p className="text-[17px] font-bold text-slate-900">
            {title}
          </p>

          <h2 className="mt-4 text-[34px] font-extrabold text-slate-900 leading-none">
            {value}
          </h2>

        </div>

        <div
          className={`w-12 h-12 rounded-2xl ${iconBg} flex items-center justify-center`}
        >
          <Icon
            size={22}
            className={iconColor}
          />
        </div>

      </div>

    </div>
  );
}