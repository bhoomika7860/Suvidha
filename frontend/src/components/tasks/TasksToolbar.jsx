import { Plus } from "lucide-react";

export default function TasksToolbar({
  onAssign,
}) {

  return (

    <div className="flex flex-col sm:flex-row gap-4 justify-between">

      <input
        placeholder="Search tasks..."
        className="w-full sm:w-72 h-11 border rounded-xl px-4"
      />

      <button
        onClick={onAssign}
        className="h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
      >

        <Plus size={18} />

        Assign Task

      </button>

    </div>

  );

}