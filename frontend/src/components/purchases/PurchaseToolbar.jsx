import { Search, Plus } from "lucide-react";

export default function PurchaseToolbar({
  search,
  setSearch,
  onReceiveBill,
}) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

      <div className="relative">

        <Search
          size={18}
          className="absolute left-3 top-3 text-gray-400"
        />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Bills..."
          className="
            w-full
            lg:w-80
            h-11
            pl-10
            pr-4
            rounded-xl
            border
            border-gray-200
            outline-none
            focus:border-blue-500
          "
        />

      </div>

      <button
        onClick={onReceiveBill}
        className="
          h-11
          px-5
          rounded-xl
          bg-blue-600
          hover:bg-blue-700
          text-white
          flex
          items-center
          justify-center
          gap-2
        "
      >
        <Plus size={18} />
        Receive New Bill
      </button>

    </div>
  );
}