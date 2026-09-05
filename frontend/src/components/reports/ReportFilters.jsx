import { Search, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import storeService from "../../services/storeService";

export default function ReportFilters({
  searchQuery,
  setSearchQuery,
  storeFilter,
  setStoreFilter,
  statusFilter,
  setStatusFilter,
}) {
  const [stores, setStores] = useState([]);

  useEffect(() => {
    loadStores();
  }, []);

  async function loadStores() {
    try {
      const data = await storeService.getStores();
      setStores(data);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="mb-5 rounded-2xl border border-gray-200 bg-white px-4 py-3">
      
      {/* Mobile layout */}
      <div className="space-y-3 sm:hidden">

        {/* Search */}

        <div className="relative w-full">
          <Search
            size={14}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(e.target.value)
            }
            placeholder="Search store or report..."
            className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
          />
        </div>


        {/* Filters — SAME ROW */}

        <div className="grid grid-cols-2 gap-3">

          {/* Store Filter */}

          <div className="relative min-w-0">

            <select
              value={storeFilter}
              onChange={(e) =>
                setStoreFilter(e.target.value)
              }
              className="h-10 w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 px-3 pr-8 text-sm text-gray-700 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
            >
              <option value="All Stores">
                All Stores
              </option>

              {stores.map((store) => (
                <option
                  key={store.id}
                  value={store.id}
                >
                  {store.name}
                </option>
              ))}
            </select>

            <ChevronDown
              size={13}
              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400"
            />

          </div>


          {/* Status Filter */}

          <div className="relative min-w-0">

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="h-10 w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 px-3 pr-8 text-sm text-gray-700 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
            >
              <option value="All Status">
                All Status
              </option>

              <option value="Locked">
                Locked
              </option>

              <option value="Pending">
                Pending
              </option>

              <option value="Adjustment Requested">
                Adjustment Requested
              </option>
            </select>

            <ChevronDown
              size={13}
              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400"
            />

          </div>

        </div>

      </div>


      {/* Desktop layout — unchanged */}

      <div className="hidden items-center gap-3 sm:flex">

        {/* Search */}

        <div className="relative min-w-[180px] max-w-xs flex-1">

          <Search
            size={14}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(e.target.value)
            }
            placeholder="Search store or report..."
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
          />

        </div>


        {/* Store Filter */}

        <div className="relative shrink-0">

          <select
            value={storeFilter}
            onChange={(e) =>
              setStoreFilter(e.target.value)
            }
            className="appearance-none rounded-lg border border-gray-200 bg-gray-50 py-2 pl-3 pr-8 text-sm text-gray-700 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
          >
            <option value="All Stores">
              All Stores
            </option>

            {stores.map((store) => (
              <option
                key={store.id}
                value={store.id}
              >
                {store.name}
              </option>
            ))}
          </select>

          <ChevronDown
            size={13}
            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400"
          />

        </div>


        {/* Status Filter */}

        <div className="relative shrink-0">

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="appearance-none rounded-lg border border-gray-200 bg-gray-50 py-2 pl-3 pr-8 text-sm text-gray-700 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
          >
            <option value="All Status">
              All Status
            </option>

            <option value="Locked">
              Locked
            </option>

            <option value="Pending">
              Pending
            </option>

            <option value="Adjustment Requested">
              Adjustment Requested
            </option>
          </select>

          <ChevronDown
            size={13}
            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400"
          />

        </div>

      </div>

    </div>
  );
}