import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function Pagination() {
  return (
    <div className="flex items-center justify-between bg-white border border-gray-200 rounded-2xl px-6 py-4">

      <button className="flex items-center gap-2 px-4 h-10 rounded-xl border hover:bg-gray-50 transition">

        <ChevronLeft size={18} />

        Previous

      </button>

      <div className="flex items-center gap-2">

        <button className="w-10 h-10 rounded-xl bg-blue-600 text-white font-medium">
          1
        </button>

        <button className="w-10 h-10 rounded-xl hover:bg-gray-100">
          2
        </button>

        <button className="w-10 h-10 rounded-xl hover:bg-gray-100">
          3
        </button>

        <span className="px-2 text-gray-500">
          ...
        </span>

        <button className="w-10 h-10 rounded-xl hover:bg-gray-100">
          12
        </button>

      </div>

      <button className="flex items-center gap-2 px-4 h-10 rounded-xl border hover:bg-gray-50 transition">

        Next

        <ChevronRight size={18} />

      </button>

    </div>
  );
}