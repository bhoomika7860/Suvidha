import { Search, Plus } from "lucide-react";

export default function ExpenseToolbar({
  search,
  setSearch,
  onAddExpense,
}) {
  return (
    <div className="flex items-center justify-between">

      <div className="relative">

        <Search
          size={18}
          className="absolute left-3 top-3 text-gray-400"
        />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search expense type or employee..."
          className="w-80 h-11 pl-10 pr-4 rounded-xl border border-gray-200 outline-none focus:border-blue-500"
        />

      </div>

      <button
        onClick={onAddExpense}
        className="h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 transition"
      >
        <Plus size={18} />
        Add Expense
      </button>

    </div>
  );
}