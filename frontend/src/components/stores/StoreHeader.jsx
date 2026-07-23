import { Plus } from "lucide-react";

export default function StoreHeader({
  onAdd,
}) {
  return (
    <div className="flex items-center justify-between">

      <div>

        <h1 className="text-3xl font-bold">
          Stores
        </h1>

        <p className="text-gray-500 mt-1">
          Manage all pharmacy stores.
        </p>

      </div>

      <button
        onClick={onAdd}
        className="flex items-center gap-2 h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
      >
        <Plus size={18} />

        Add Store

      </button>

    </div>
  );
}