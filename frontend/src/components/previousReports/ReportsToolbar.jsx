import { Search } from "lucide-react";

export default function ReportsToolbar({
  search,
  setSearch,
}) {
  return (
    <div className="bg-white border rounded-2xl p-5 shadow-sm">

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
          className="w-full h-11 border rounded-xl pl-11 pr-4"
        />

      </div>

    </div>
  );
}