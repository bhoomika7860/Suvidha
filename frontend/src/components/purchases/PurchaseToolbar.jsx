import { Search, Plus } from "lucide-react";

export default function PurchaseToolbar({
  search,
  setSearch,
  onReceiveBill,
}) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">

      <div className="relative w-full lg:w-80">

        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Search Bills..."
          className="
            w-full
            h-11
            pl-10
            pr-4
            rounded-xl
            border
            border-gray-200
            bg-white
            outline-none
            focus:border-blue-500
          "
        />

      </div>


      <button
        onClick={onReceiveBill}
        className="
          w-full
          lg:w-auto
          h-11
          shrink-0
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

        <span>
          Receive New Bill
        </span>

      </button>

    </div>
  );
}