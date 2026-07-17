import { LogOut } from "lucide-react";

export default function DeliveryHeader() {
  const user = JSON.parse(localStorage.getItem("user"));

  const name =
    user?.full_name ||
    user?.username ||
    "User";

  return (
    <div className="bg-white border-b px-5 py-4 flex justify-between items-center sticky top-0">

      <div>
        <h1 className="text-2xl font-bold">
          Delivery
        </h1>

        <p className="text-gray-500 text-sm">
          Good Morning {name}
        </p>
      </div>

      <button className="text-red-600">
        <LogOut size={22} />
      </button>

    </div>
  );
}