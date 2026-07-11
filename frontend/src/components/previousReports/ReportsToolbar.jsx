import { Search, CalendarDays } from "lucide-react";

export default function ReportsToolbar() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">

      <div className="grid grid-cols-4 gap-4">

        {/* Search */}

        <div className="col-span-2 relative">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search by date..."
            className="w-full h-11 rounded-xl border border-gray-200 pl-11 pr-4 outline-none focus:border-blue-500"
          />

        </div>

        {/* Date Filter */}

        <div className="relative">

          <CalendarDays
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <select className="w-full h-11 rounded-xl border border-gray-200 pl-11 pr-4 outline-none focus:border-blue-500 appearance-none bg-white">

            <option>Today</option>

            <option>This Week</option>

            <option>This Month</option>

            <option>Custom Range</option>

          </select>

        </div>

        {/* Status */}

        <select className="w-full h-11 rounded-xl border border-gray-200 px-4 outline-none focus:border-blue-500 bg-white">

          <option>All Reports</option>

          <option>Submitted</option>

          <option>Locked</option>

        </select>

      </div>

    </div>
  );
}