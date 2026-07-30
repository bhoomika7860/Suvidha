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
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="grid gap-4 lg:grid-cols-5">

        {/* Search */}

        <div className="relative lg:col-span-2">

          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search supplier..."
            className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 outline-none transition focus:border-blue-500"
          />

        </div>

        {/* Store */}

        <select
  value={store}
  onChange={(e) => setStore(e.target.value)}
  className="rounded-xl border border-slate-200 px-3 py-2.5 outline-none transition focus:border-blue-500"
>
  <option value="all">All Stores</option>

  {stores.map((store) => (
    <option key={store.id} value={store.id}>
      {store.name}
    </option>
  ))}
</select>

        {/* Status */}

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-xl border border-slate-200 px-3 py-2.5 outline-none transition focus:border-blue-500"
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
          className="rounded-xl border border-slate-200 px-3 py-2.5 outline-none transition focus:border-blue-500"
        />

      </div>

    </div>
  );
}