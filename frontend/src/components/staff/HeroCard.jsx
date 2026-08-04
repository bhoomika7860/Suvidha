import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { LogOut } from "lucide-react";

export default function HeroCard() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const user = token ? jwtDecode(token) : null;

  const staffName =
    user?.full_name ||
    user?.username ||
    "Staff";

  const storeName =
    user?.store_name ||
    "Store";

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  }

  return (
    <>
      {/* ================= Desktop ================= */}

      <div className="hidden lg:block bg-white border border-gray-200 rounded-2xl shadow-sm p-8">

        <p className="text-sm font-semibold tracking-widest text-blue-600 uppercase">
          Staff Dashboard
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          Good Evening, {user?.full_name || "Staff"} 👋
        </h1>

        <p className="mt-3 text-lg text-gray-500">
          Here's everything assigned to you today.
        </p>

      </div>

      {/* ================= Mobile ================= */}

      <div className="lg:hidden bg-white border-b border-gray-200 px-5 py-6">

        <div className="flex items-start justify-between">

          <div>

            <h1 className="text-3xl font-bold leading-tight">
              Hi, {staffName} 
            </h1>

            <p className="mt-2 text-sm font-medium text-gray-500">
              {storeName}
            </p>

            <p className="mt-4 text-sm text-gray-500">
              Here's everything assigned to you today.
            </p>

          </div>

          <button
            onClick={logout}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-200 hover:bg-red-50 transition"
          >
            <LogOut
              size={18}
              className="text-red-600"
            />
          </button>

        </div>

      </div>
    </>
  );
}