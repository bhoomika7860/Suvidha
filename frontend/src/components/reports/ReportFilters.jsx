import { Search, ChevronDown, Calendar } from "lucide-react";

export default function ReportFilters({
  searchQuery,
  setSearchQuery,
  storeFilter,
  setStoreFilter,
  statusFilter,
  setStatusFilter,
  reports,
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 px-4 py-3 mb-5 flex items-center gap-3 flex-wrap">
      
      {/* Search */}
      <div className="relative flex-1 min-w-[180px] max-w-xs">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search store or report..."
          className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 placeholder:text-gray-400"
        />
      </div>

      {/* Store Filter */}
      <div className="relative">
        <select
          value={storeFilter}
          onChange={(e) => setStoreFilter(e.target.value)}
          className="appearance-none pl-3 pr-8 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 text-gray-700 cursor-pointer"
        >
          <option>All Stores</option>
          {reports.map((r) => (
            <option key={r.store}>{r.store}</option>
          ))}
        </select>

        <ChevronDown
          size={13}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
      </div>

      {/* Status Filter */}
      <div className="relative">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="appearance-none pl-3 pr-8 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 text-gray-700 cursor-pointer"
        >
          <option>All Status</option>
          <option>Locked</option>
          <option>Pending</option>
          <option>Adjustment Requested</option>
        </select>

        <ChevronDown
          size={13}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
      </div>

      
    </div>
  );
}