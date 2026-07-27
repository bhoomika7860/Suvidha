import {
  Home,
  FileText,
  BarChart3,
  UserCircle,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const items = [
  {
    label: "Home",
    icon: Home,
    path: "/owner-dashboard",
  },
  {
    label: "Reports",
    icon: FileText,
    path: "/daily-reports",
  },
  {
    label: "Analytics",
    icon: BarChart3,
    path: "/analytics",
  },
  {
    label: "Profile",
    icon: UserCircle,
    path: "/profile",
  },
];

export default function MobileBottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-16 flex justify-around items-center z-40">

      {items.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center text-xs ${
                isActive
                  ? "text-blue-600"
                  : "text-gray-500"
              }`
            }
          >
            <Icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        );
      })}

    </nav>
  );
}