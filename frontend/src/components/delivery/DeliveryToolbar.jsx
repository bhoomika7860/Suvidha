import { Plus } from "lucide-react";

export default function DeliveryToolbar({
  onAdd,
}) {

  return (

    <button
      onClick={onAdd}
      className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium flex justify-center items-center gap-2"
    >

      <Plus size={20} />

      Add Delivery

    </button>

  );

}