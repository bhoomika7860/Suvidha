import { Bell } from "lucide-react";

export default function Header() {
  // Temporary data (will come from backend later)
  const managerName = "Rahul Sharma";
  const storeName = "Sector 7 Pharmacy";

  const today = new Date();

  const currentDate = today.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const currentTime = today.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <header className="bg-white border-b border-[#E5E7EB] px-8 py-5 flex items-center justify-between">

      {/* Left Section */}
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">
          {storeName}
        </h1>

        <p className="text-sm text-[#6B7280] mt-1">
          Store Manager Dashboard
        </p>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">

        {/* Date & Time */}
        <div className="text-right">
          <p className="text-sm font-medium text-[#111827]">
            {currentDate}
          </p>

          <p className="text-sm text-[#6B7280]">
            {currentTime}
          </p>
        </div>

        {/* Notification */}
        <button className="w-10 h-10 rounded-xl border border-[#E5E7EB] flex items-center justify-center hover:bg-gray-50 transition-colors">
          <Bell size={18} />
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-semibold">
            {managerName
              .split(" ")
              .map((n) => n[0])
              .join("")}
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