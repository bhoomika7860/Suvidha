import { Search } from "lucide-react";

export default function ReportsToolbar({
  search,
  setSearch,
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

      <div className="relative">

        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Search by date..."
          className="w-full h-12 border border-gray-300 rounded-xl pl-11 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

      </div>

    </div>
  );
}