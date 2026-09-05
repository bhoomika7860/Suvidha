import {
  LayoutDashboard,
  FileText,
  Target,
  BarChart3,
  Users,
  Building2,
  History,
  Wallet,
  LogOut,
  Truck,
} from "lucide-react";

import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";


const navItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/owner-dashboard",
  },
  {
    label: "Daily Reports",
    icon: FileText,
    path: "/daily-reports",
  },
  {
    label: "Previous Reports",
    icon: History,
    path: "/previous-reports",
  },
  {
    label: "Stores",
    icon: Building2,
    path: "/stores",
  },
  {
    label: "Staff",
    icon: Users,
    path: "/staff-management",
  },
  {
    label: "Tasks",
    icon: Target,
    path: "/tasks",
  },
  {
    label: "Purchases",
    icon: FileText,
    path: "/owner-purchases",
  },
  {
    label: "Suppliers",
    icon: Truck,
    path: "/suppliers",
  },
  {
    label: "Udhaar",
    icon: Wallet,
    path: "/owner/udhaar",
  },
  {
    label: "Analytics",
    icon: BarChart3,
    path: "/analytics",
  },
];


export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();


  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  }


  const token = localStorage.getItem("token");

  const user = token
    ? jwtDecode(token)
    : null;


  const displayName =
    user?.full_name ||
    user?.username ||
    "";


  const initials = displayName
    ? displayName
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
    : "?";


  const roleMap = {
    owner: "Owner",
    store_manager: "Store Manager",
    staff: "Staff",
    delivery: "Delivery Boy",
  };


  return (
    <aside className="flex h-screen w-64 flex-shrink-0 flex-col border-r border-[#E2E8F0] bg-white">

      {/* Logo */}

      <div className="flex items-center gap-3 border-b border-[#E2E8F0] px-6 py-6">

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2563EB] font-bold text-white">
          H
        </div>


        <div>

          <h1 className="text-lg font-bold text-[#0F172A]">
            Suvidha
          </h1>

          <p className="text-[11px] font-semibold uppercase text-[#1E3A8A]">
            Owner Portal
          </p>

        </div>

      </div>


      {/* Navigation */}

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">

        {navItems.map(
          ({
            label,
            icon: Icon,
            path,
          }) => {

            const active =
              location.pathname.startsWith(path);

            return (
              <button
                key={label}
                type="button"
                onClick={() => navigate(path)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[16px] font-medium transition ${
                  active
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >

                <Icon size={20} />

                <span>{label}</span>

              </button>
            );
          }
        )}

      </nav>


      {/* Footer */}

      <div className="border-t border-gray-200 p-4">

        <div className="mb-4 flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
            {initials}
          </div>


          <div className="min-w-0">

            <p className="truncate font-semibold text-gray-900">
              {user?.full_name ||
                user?.username ||
                "User"}
            </p>

            <p className="text-sm text-gray-500">
              {roleMap[user?.role] || ""}
            </p>

          </div>

        </div>


        <button
          type="button"
          onClick={logout}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-red-200 text-red-600 transition hover:bg-red-50"
        >

          <LogOut size={18} />

          Logout

        </button>

      </div>

    </aside>
  );
}