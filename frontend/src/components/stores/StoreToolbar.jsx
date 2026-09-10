import { Search } from "lucide-react";

export default function StoreToolbar({
  search,
  setSearch,
  filter,
  setFilter,
}) {
  return (
    <div
      className="
        flex
        w-full
        min-w-0
        max-w-full
        items-center
        gap-2.5
        lg:gap-4
      "
    >

      {/* Search */}

      <div
        className="
          relative
          min-w-0
          flex-1
        "
      >

        <Search
          className="
            pointer-events-none
            absolute
            left-3.5
            top-1/2
            -translate-y-1/2
            text-gray-400
          "
          size={16}
        />

        <input
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Search stores..."
          className="
            box-border
            h-11
            w-full
            min-w-0
            rounded-xl
            border
            border-gray-200
            bg-white
            pl-10
            pr-3
            text-sm
            text-gray-900
            outline-none
            placeholder:text-gray-400
            focus:border-blue-400
            focus:ring-2
            focus:ring-blue-100
            lg:h-11
            lg:pl-11
          "
        />

      </div>


      {/* Filter */}

      <select
        value={filter}
        onChange={(e) =>
          setFilter(e.target.value)
        }
        className="
          box-border
          h-11
          w-[78px]
          shrink-0
          appearance-none
          rounded-xl
          border
          border-gray-200
          bg-white
          px-3
          text-sm
          text-gray-700
          outline-none
          focus:border-blue-400
          focus:ring-2
          focus:ring-blue-100
          lg:w-auto
          lg:px-4
        "
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