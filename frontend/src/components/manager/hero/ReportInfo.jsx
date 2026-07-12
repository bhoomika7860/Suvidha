export default function ReportInfo({ report, user }) {

  const pending = [];

  if (!report.sales_completed) pending.push("Sales");
  if (!report.expenses_completed) pending.push("Expenses");
  if (!report.purchases_completed) pending.push("Purchases");
  if (!report.deliveries_completed) pending.push("Deliveries");
  if (!report.bounced_products_completed) pending.push("Bounced Products");
  if (!report.notes_completed) pending.push("Notes");

  return (
    <div>

      <p className="text-gray-500 text-sm">
        Good Afternoon,
      </p>

      <h1 className="text-3xl font-bold text-gray-900 mt-1">
        {user.full_name}
      </h1>

      <div className="flex items-center gap-3 mt-3">

        <span className="text-gray-600">
          Today's Report Status
        </span>

        <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 border border-amber-300">
          {report.status}
        </span>

      </div>

      <p className="text-gray-600 mt-3 text-sm">
        Today's report is partially completed.
      </p>

      <div className="flex flex-wrap gap-x-6 gap-y-1 mt-3">

        {pending.length === 0 ? (
          <span className="text-green-600 text-sm">
            ✓ All sections completed
          </span>
        ) : (
          pending.map(item => (
            <span
              key={item}
              className="text-red-500 text-[13px]"
            >
              ✕ {item}
            </span>
          ))
        )}

      </div>

    </div>
  );
}