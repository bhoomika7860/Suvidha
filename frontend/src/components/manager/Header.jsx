import { Bell } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { useBusinessDate } from "../../contexts/BusinessDateContext";

export default function Header() {
  const token = localStorage.getItem("token");

  const user = token ? jwtDecode(token) : null;

  const {
    selectedDate,
    setSelectedDate,
  } = useBusinessDate();

  const managerName =
    user?.full_name ||
    user?.username ||
    "Manager";

  const storeName =
    user?.store_name ||
    "Store";

  const initials = managerName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  const today = new Date();

  const currentTime = today.toLocaleTimeString(
    "en-IN",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  const businessDate = new Date(
    `${selectedDate}T12:00:00`
  );

  const formattedBusinessDate =
    businessDate.toLocaleDateString(
      "en-IN",
      {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );

  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-8 py-5">

      {/* LEFT */}

      <div>

        <h1 className="text-2xl font-bold text-gray-900">
          {storeName}
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Store Manager Dashboard
        </p>

      </div>


      {/* RIGHT */}

      <div className="flex items-center gap-6">

        {/* BUSINESS DATE */}

        <div className="text-right">

          <input
            type="date"
            value={selectedDate}
            onChange={(e) =>
              setSelectedDate(e.target.value)
            }
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-900 outline-none focus:border-blue-500"
          />

          <p className="mt-1 text-xs text-gray-500">
            Business Date: {formattedBusinessDate}
          </p>

          <p className="text-xs text-gray-400">
            {currentTime}
          </p>

        </div>


        {/* NOTIFICATIONS */}

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50"
        >
          <Bell size={18} />
        </button>


        {/* USER */}

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
            {initials}
          </div>

          <div>

            <p className="text-sm font-semibold text-gray-900">
              {managerName}
            </p>

            <p className="text-xs text-gray-500">
              Store Manager
            </p>

          </div>

        </div>

      </div>

    </header>
  );
}