    import { LogOut } from "lucide-react";

export default function DeliveryHeader() {
  return (

    <div className="bg-white border-b px-5 py-4 flex justify-between items-center sticky top-0">

      <div>

        <h1 className="text-2xl font-bold">

          Delivery

        </h1>

        <p className="text-gray-500 text-sm">

          Good Morning Rahul

        </p>

      </div>

      <button className="text-red-600">

        <LogOut size={22} />

      </button>

    </div>

  );
}