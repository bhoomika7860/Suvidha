import {
  LayoutDashboard,
  FileText,
  Target,
  BarChart3,
  Users,
  Building2,
  History,
  X,
  LogOut,
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
    label: "Analytics",
    icon: BarChart3,
    path: "/analytics",
  },
];

export default function Sidebar({ open, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  function logout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  const token = localStorage.getItem("token");

const user = token ? jwtDecode(token) : null;

const displayName =
  user?.full_name || user?.username || "";

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
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className="fixed top-0 left-0 z-50 h-screen w-64 flex flex-col bg-white border-r border-[#E2E8F0]">

        {/* Logo */}

        <div className="flex items-center gap-3 px-6 py-6 border-b border-[#E2E8F0]">

          <div className="w-10 h-10 rounded-lg bg-[#2563EB] flex items-center justify-center text-white font-bold">
            H
          </div>

          <div>

            <h1 className="text-lg font-bold text-[#0F172A]">
              PharmaCore360
            </h1>

            <p className="text-[11px] font-semibold uppercase text-[#1E3A8A]">
              Owner Portal
            </p>

          </div>

          <button
            className="ml-auto lg:hidden"
            onClick={onClose}
          >
            <X size={18} />
          </button>

        </div>

        {/* Navigation */}

        <nav className="flex-1 px-3 py-5 space-y-1">

          {navItems.map(({ label, icon: Icon, path }) => {

            const active =
              location.pathname.startsWith(path);

            return (
              <button
                key={label}
                onClick={() => navigate(path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium text-[16px]
                  ${
                    active
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }
                `}
              >

                <Icon size={20} />

                <span>{label}</span>

              </button>
            );

          })}

        </nav>

        {/* Footer */}

       <div className="border-t border-gray-200 p-4">

  <div className="flex items-center gap-3 mb-4">

    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700">
      {initials}
    </div>

    <div>

      <p className="font-semibold">
  {user?.full_name || user?.username || "User"}
</p>

      <p className="text-sm text-gray-500">
        {roleMap[user?.role] || ""}
      </p>

    </div>

  </div>



          <button
            onClick={logout}
            className="w-full h-11 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 flex items-center justify-center gap-2"
          >

            <LogOut size={18} />

            Logout

          </button>

        </div>

      </aside>

    </>
  );
}