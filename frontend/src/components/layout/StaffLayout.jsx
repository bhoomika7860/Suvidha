import { Outlet, NavLink } from "react-router-dom";
import {
  House,
  ClipboardList,
  Package,
  Wallet,
  HandCoins,
} from "lucide-react";

import StaffSidebar from "../staff/StaffSidebar";
import StaffTopbar from "../staff/StaffTopbar";

const mobileNavItems = [
  {
    label: "Home",
    path: "/staff-dashboard",
    icon: House,
  },
  {
    label: "Tasks",
    path: "/staff-tasks",
    icon: ClipboardList,
  },
  {
    label: "Purchases",
    path: "/staff-purchases",
    icon: Package,
  },
  {
    label: "Expenses",
    path: "/staff-expenses",
    icon: Wallet,
  },
  {
    label: "Udhaar",
    path: "/staff/udhaar",
    icon: HandCoins,
  },
];

export default function StaffLayout() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* ================= Desktop ================= */}

      <div className="hidden lg:flex h-screen">

        <StaffSidebar />

        <div className="flex-1 flex flex-col overflow-hidden">

          <StaffTopbar />

          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>

        </div>

      </div>

      {/* ================= Mobile ================= */}

      <div className="lg:hidden min-h-screen">

        <main className="pb-20">
          <Outlet />
        </main>

        <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 border-t border-gray-200 bg-white shadow-lg">

          <div className="grid h-full grid-cols-5">

            {mobileNavItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex flex-col items-center justify-center transition ${
                      isActive
                        ? "text-blue-600"
                        : "text-gray-500"
                    }`
                  }
                >
                  <Icon size={20} />

                  <span className="mt-1 text-[11px] font-medium">
                    {item.label}
                  </span>
                </NavLink>
              );
            })}

          </div>

        </nav>

      </div>

    </div>
  );
}