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
    <header className="bg-white border-b border-[#E5E7EB] px-8 py-5 flex items-center justify-between">

      <div>
        <h1 className="text-2xl font-bold text-[#111827]">
          {storeName}
        </h1>

        <p className="text-sm text-[#6B7280] mt-1">
          Store Manager Dashboard
        </p>
      </div>

      <div className="flex items-center gap-6">

        {/* BUSINESS DATE */}

        <div className="text-right">

          <input
            type="date"
            value={selectedDate}
            onChange={(e) =>
              setSelectedDate(e.target.value)
            }
            className="rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm font-medium text-[#111827] outline-none focus:border-blue-500"
          />

          <p className="text-xs text-[#6B7280] mt-1">
            Business Date: {formattedBusinessDate}
          </p>

          <p className="text-xs text-[#9CA3AF]">
            {currentTime}
          </p>

        </div>

        {/* NOTIFICATIONS */}

        <button
          type="button"
          className="w-10 h-10 rounded-xl border border-[#E5E7EB] flex items-center justify-center hover:bg-gray-50"
        >
          <Bell size={18} />
        </button>

        {/* USER */}

        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-semibold">
            {initials}
          </div>

          <div>
            <p className="text-sm font-semibold text-[#111827]">
              {managerName}
            </p>

            <p className="text-xs text-[#6B7280]">
              Store Manager
            </p>
          </div>

        </div>

      </div>

    </header>
  );
}