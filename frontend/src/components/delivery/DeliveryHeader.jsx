import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DeliveryHeader() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const name =
    user?.full_name ||
    user?.username ||
    "User";

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  }

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

      <button
        onClick={logout}
        className="text-red-600 hover:text-red-700 transition"
      >
        <LogOut size={22} />
      </button>

    </div>
  );
}