import {
  LayoutDashboard,
  ClipboardList,
  Package,
  Wallet,
  ClipboardCheck,
  LogOut,
} from "lucide-react";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/manager-dashboard",
  },
  {
    title: "Daily Report",
    icon: ClipboardList,
    path: "/daily-report",
  },
  {
    title: "Purchases",
    icon: Package,
    path: "/manager-purchases",
  },
  {
    title: "Expenses",
    icon: Wallet,
    path: "/manager-expenses",
  },
  {
  label: "Udhaar",
  path: "/manager/udhaar",
  icon: Wallet,
  },
  {
    title: "Tasks",
    icon: ClipboardCheck,
    path: "/manager-tasks",
  },
];

export default function Sidebar() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  }

  return (
    <aside className="w-60 bg-white border-r border-gray-200 flex flex-col">

      {/* Logo */}

      <div className="px-5 py-5 border-b border-gray-200">

        <h1 className="text-xl font-bold text-blue-600">
          PharmaCore360
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Store Manager
        </p>

      </div>

      {/* Navigation */}

      <nav className="flex-1 px-3 py-5 space-y-1">

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.title}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-[15px] transition ${
                  isActive
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <Icon size={18} />

              <span>{item.title}</span>

            </NavLink>
          );
        })}

      </nav>

      {/* Logout */}

      <div className="border-t border-gray-200 p-3">

        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-[15px] text-red-600 hover:bg-red-50 transition"
        >
          <LogOut size={18} />

          Logout

        </button>

      </div>

    </aside>
  );
}