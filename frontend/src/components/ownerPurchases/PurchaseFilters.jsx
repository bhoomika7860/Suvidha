import { Search } from "lucide-react";

export default function PurchaseFilters({
  search,
  setSearch,
  store,
  setStore,
  status,
  setStatus,
  date,
  setDate,
  stores,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="grid gap-3 sm:gap-4 lg:grid-cols-5">
        {/* Search */}
        <div className="relative lg:col-span-2">
          <Search
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search supplier..."
            className="h-11 w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
          />
        </div>

        {/* Store */}
        <select
          value={store}
          onChange={(e) => setStore(e.target.value)}
          className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
        >
          <option value="all">All Stores</option>

          {stores.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name || item.store_name}
            </option>
          ))}
        </select>

        {/* Status */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
        >
          <option value="all">All Status</option>
          <option value="received">Received</option>
          <option value="checking">Waiting Check</option>
          <option value="entered">Waiting Entry</option>
          <option value="completed">Completed</option>
        </select>

        {/* Date */}
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
        />
      </div>
    </div>
  );
}
