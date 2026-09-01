import {
  LayoutDashboard,
  ClipboardList,
  History,
  Package,
  Wallet,
  ClipboardCheck,
  LogOut,
  HandCoins,
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
    title: "Previous Reports",
    icon: History,
    path: "/manager-previous-reports",
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
    title: "Udhaar",
    icon: HandCoins,
    path: "/manager/udhaar",
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
    <aside className="flex w-60 flex-col border-r border-gray-200 bg-white">

      {/* LOGO */}

      <div className="border-b border-gray-200 px-5 py-5">

        <h1 className="text-xl font-bold text-blue-600">
          Suvidha
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Store Manager
        </p>

      </div>


      {/* NAVIGATION */}

      <nav className="flex-1 space-y-1 px-3 py-5">

        {menuItems.map((item) => {

          const Icon = item.icon;

          return (
            <NavLink
              key={item.title}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-2.5 text-[15px] transition ${
                  isActive
                    ? "bg-blue-50 font-semibold text-blue-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >

              <Icon size={18} />

              <span>
                {item.title}
              </span>

            </NavLink>
          );

        })}

      </nav>


      {/* LOGOUT */}

      <div className="border-t border-gray-200 p-3">

        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-[15px] text-red-600 transition hover:bg-red-50"
        >

          <LogOut size={18} />

          Logout

        </button>

      </div>

    </aside>
  );
}