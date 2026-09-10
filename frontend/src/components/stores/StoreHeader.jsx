import { Plus } from "lucide-react";

export default function StoreHeader({
  onAdd,
}) {
  return (
    <div
      className="
        flex
        w-full
        min-w-0
        items-start
        justify-between
        gap-3
        border-b
        border-gray-200
        pb-5
        lg:border-b-0
        lg:pb-0
      "
    >

      <div className="min-w-0 flex-1">

        <h1
          className="
            truncate
            text-[27px]
            font-bold
            leading-tight
            tracking-tight
            text-[#0F172A]
            lg:text-3xl
          "
        >
          Stores
        </h1>

        <p
          className="
            mt-1
            truncate
            text-[14px]
            leading-relaxed
            text-gray-500
            lg:text-base
          "
        >
          Manage all pharmacy stores.
        </p>

      </div>


      <button
        type="button"
        onClick={onAdd}
        className="
          flex
          h-11
          shrink-0
          items-center
          justify-center
          gap-2
          rounded-xl
          bg-blue-600
          px-4
          text-sm
          font-medium
          text-white
          transition-colors
          hover:bg-blue-700
          lg:px-4
        "
      >

        <Plus size={18} />

        <span className="hidden sm:inline">
          Add Store
        </span>

        <span className="sm:hidden">
          Add
        </span>

      </button>

    </div>
  );
}