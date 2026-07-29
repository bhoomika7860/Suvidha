import { Pencil, Trash2 } from "lucide-react";

export default function DrawerActions({
  onEdit,
  onDelete,
}) {
  return (
    <div className="border-t border-[#E5E7EB] bg-white p-6">

      <div className="grid grid-cols-2 gap-4">

        

        <button
          onClick={onDelete}
          className="flex items-center justify-center gap-2 rounded-xl border border-red-300 bg-red-50 px-5 py-3 font-medium text-red-600 hover:bg-red-100"
        >
          <Trash2 size={17} />

          Delete Employee
        </button>

      </div>

    </div>
  );
}