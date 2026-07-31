import { Menu, Bell } from "lucide-react";
import { jwtDecode } from "jwt-decode";

export default function MobileHeader({ onMenuClick }) {
  const token = localStorage.getItem("token");

  const user = token ? jwtDecode(token) : null;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4">

      <div className="flex items-center gap-3">

        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <Menu size={22} />
        </button>

        <div>
          <h1 className="font-bold text-lg text-[#2563EB]">
            Suvidha
          </h1>

          <p className="text-xs text-gray-500">
            Owner Portal
          </p>
        </div>

      </div>

      <button className="relative p-2 rounded-lg hover:bg-gray-100">
        <Bell size={20} />
      </button>

    </header>
  );
}