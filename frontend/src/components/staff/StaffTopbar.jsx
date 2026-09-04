import { Bell, CalendarDays } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { useBusinessDate } from "../../contexts/BusinessDateContext";

export default function StaffTopbar() {
  const token = localStorage.getItem("token");

  const user = token ? jwtDecode(token) : null;

  const {
    selectedDate,
    setSelectedDate,
  } = useBusinessDate();

  const staffName =
    user?.full_name ||
    user?.username ||
    "Staff";

  const storeName =
    user?.store_name ||
    "Store";

  const initials = staffName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const today = new Date();

  const currentDate =
    today.toLocaleDateString(
      "en-IN",
      {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );

  const currentTime =
    today.toLocaleTimeString(
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
    <>
      {/* =====================================================
          DESKTOP
      ===================================================== */}

      <header className="hidden lg:flex items-center justify-between border-b border-[#E5E7EB] bg-white px-8 py-5">

        <div>
          <h1 className="text-2xl font-bold text-[#111827]">
            {storeName}
          </h1>

          <p className="mt-1 text-sm text-[#6B7280]">
            Staff Portal
          </p>
        </div>

        <div className="flex items-center gap-6">

          <div className="text-right">

            <p className="text-sm font-medium text-[#111827]">
              {currentDate}
            </p>

            <p className="text-sm text-[#6B7280]">
              {currentTime}
            </p>

          </div>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E5E7EB] hover:bg-gray-50"
          >
            <Bell size={18} />
          </button>

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
              {initials}
            </div>

            <div>

              <p className="text-sm font-semibold">
                {staffName}
              </p>

              <p className="text-xs text-gray-500">
                Staff
              </p>

            </div>

          </div>

        </div>

      </header>


      {/* =====================================================
          MOBILE
      ===================================================== */}

      <header className="border-b border-gray-200 bg-white lg:hidden">

        {/* Store / Staff */}

        <div className="flex items-center justify-between px-5 py-4">

          <div className="min-w-0">

            <h1 className="truncate text-2xl font-bold text-[#111827]">
              {storeName}
            </h1>

            <p className="mt-1 text-sm text-[#6B7280]">
              Staff Portal
            </p>

          </div>

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
            {initials}
          </div>

        </div>


        {/* BUSINESS DATE */}

        <div className="border-t border-gray-100 px-5 py-3">

          <div className="flex items-center justify-between gap-3">

            <div className="flex min-w-0 items-center gap-2">

              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50">

                <CalendarDays
                  size={17}
                  className="text-blue-600"
                />

              </div>

              <div className="min-w-0">

                <p className="text-[11px] font-medium text-gray-500">
                  Business Date
                </p>

                <p className="truncate text-sm font-semibold text-gray-900">
                  {formattedBusinessDate}
                </p>

              </div>

            </div>


            <input
              type="date"
              value={selectedDate}
              onChange={(e) =>
                setSelectedDate(
                  e.target.value
                )
              }
              className="h-9 shrink-0 rounded-lg border border-gray-200 bg-white px-2 text-xs font-medium text-gray-900 outline-none focus:border-blue-500"
            />

          </div>

        </div>

      </header>
    </>
  );
}