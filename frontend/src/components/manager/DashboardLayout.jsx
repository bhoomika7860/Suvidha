import { Outlet, NavLink } from "react-router-dom";
import {
  House,
  ClipboardList,
  Package,
  Wallet,
  HandCoins,
} from "lucide-react";

import Sidebar from "./Sidebar";

import Header from "./Header";

const mobileNavItems = [
  {
    label: "Home",
    path: "/manager-dashboard",
    icon: House,
  },
  {
    label: "Report",
    path: "/daily-report",
    icon: ClipboardList,
  },
  {
    label: "Purchases",
    path: "/manager-purchases",
    icon: Package,
  },
  {
    label: "Expenses",
    path: "/manager-expenses",
    icon: Wallet,
  },
  {
    label: "Udhaar",
    path: "/manager/udhaar",
    icon: HandCoins,
  },
];

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* ================= DESKTOP ================= */}

      <div className="hidden lg:flex h-screen">

        <Sidebar />

        <div className="flex flex-1 flex-col overflow-hidden">

          <Header />

          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>

        </div>

      </div>


      {/* ================= MOBILE ================= */}

      <div className="lg:hidden min-h-screen bg-gray-50">

        <main className="pb-20 overflow-x-hidden">
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