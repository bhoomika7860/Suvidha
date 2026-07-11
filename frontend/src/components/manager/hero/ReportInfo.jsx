export default function ReportInfo() {
  return (
    <div>

      <p className="text-gray-500 text-sm">
        Good Afternoon,
      </p>

      <h1 className="text-3xl font-bold text-gray-900 mt-1">
        Rahul Sharma
      </h1>

      <div className="flex items-center gap-3 mt-3">

        <span className="text-gray-600">
          Today's Report Status
        </span>

        <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 border border-amber-300">
          Draft
        </span>

      </div>

      <p className="text-gray-600 mt-3 text-sm">
        Today's report is partially completed.
        You still need to finish:
      </p>

      <div className="flex flex-wrap gap-x-6 gap-y-1 mt-3">

        <span className="text-green-600 text-[13px]">
          ✓ Sales
        </span>

        <span className="text-green-600 text-[13px]">
          ✓ Expenses
        </span>

        <span className="text-green-600 text-[13px]">
          ✓ Purchases
        </span>

        <span className="text-red-500 text-[13px]">
          ✕ Bounced Products
        </span>

        <span className="text-red-500 text-[13px]">
          ✕ Notes
        </span>

      </div>

    </div>
  );
}