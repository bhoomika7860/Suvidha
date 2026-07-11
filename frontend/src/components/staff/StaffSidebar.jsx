import {
  LayoutDashboard,
  ClipboardList,
  Package,
  Wallet,
  LogOut,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/staff-dashboard",
  },
  {
    title: "My Tasks",
    icon: ClipboardList,
    path: "/staff-tasks",
  },
  {
    title: "Purchases",
    icon: Package,
    path: "/staff-purchases",
  },
  {
    title: "Expenses",
    icon: Wallet,
    path: "/staff-expenses",
  },
];

export default function StaffSidebar() {
  return (
    <aside className="w-72 bg-white border-r border-gray-200 flex flex-col">

      <div className="h-24 px-6 border-b flex flex-col justify-center">

        <h1 className="text-3xl font-bold text-blue-600">
          PharmaCore360
        </h1>

        <p className="text-gray-500 mt-2">
          Staff
        </p>

      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.title}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 h-12 rounded-xl transition ${
                  isActive
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <Icon size={20} />
              {item.title}
            </NavLink>
          );
        })}

      </nav>

      <div className="p-4 border-t">

        <button className="w-full flex items-center gap-3 px-4 h-12 rounded-xl text-red-600 hover:bg-red-50 transition">

          <LogOut size={20} />

          Logout

        </button>

      </div>

    </aside>
  );
}