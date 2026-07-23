import { Search } from "lucide-react";

export default function StoreToolbar({
  search,
  setSearch,
  filter,
  setFilter,
}) {
  return (
    <div className="flex justify-between gap-4">

      <div className="relative flex-1">

        <Search
          className="absolute left-4 top-3 text-gray-400"
          size={18}
        />

        <input
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Search Stores..."
          className="w-full h-11 pl-11 pr-4 border rounded-xl"
        />

      </div>

      <select
        value={filter}
        onChange={(e) =>
          setFilter(e.target.value)
        }
        className="h-11 border rounded-xl px-4"
      >
        <option value="all">
          All
        </option>

        <option value="active">
          Active
        </option>

        <option value="inactive">
          Inactive
        </option>

      </select>

    </div>
  );
}