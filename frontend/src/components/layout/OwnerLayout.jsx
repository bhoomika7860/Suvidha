import { useEffect, useState } from "react";
import {
  Outlet,
  NavLink,
  useLocation,
} from "react-router-dom";

import {
  Home,
  FileText,
  Building2,
  BarChart3,
  MoreHorizontal,
  History,
  Users,
  Target,
  ShoppingCart,
  Truck,
  Wallet,
  X,
} from "lucide-react";

import Sidebar from "./Sidebar";
import Header from "./Header";


// ─────────────────────────────────────────────────────────────
// MOBILE PRIMARY NAVIGATION
// ─────────────────────────────────────────────────────────────

const mobileNavItems = [
  {
    label: "Home",
    path: "/owner-dashboard",
    icon: Home,
  },
  {
    label: "Reports",
    path: "/daily-reports",
    icon: FileText,
  },
  {
    label: "Stores",
    path: "/stores",
    icon: Building2,
  },
  {
    label: "Analytics",
    path: "/analytics",
    icon: BarChart3,
  },
];


// ─────────────────────────────────────────────────────────────
// MOBILE MORE MENU
// ─────────────────────────────────────────────────────────────

const moreItems = [
  {
    label: "Previous Reports",
    path: "/previous-reports",
    icon: History,
  },
  {
    label: "Staff",
    path: "/staff-management",
    icon: Users,
  },
  {
    label: "Tasks",
    path: "/tasks",
    icon: Target,
  },
  {
    label: "Purchases",
    path: "/owner-purchases",
    icon: ShoppingCart,
  },
  {
    label: "Suppliers",
    path: "/suppliers",
    icon: Truck,
  },
  {
    label: "Udhaar",
    path: "/owner/udhaar",
    icon: Wallet,
  },
];


// ─────────────────────────────────────────────────────────────
// OWNER LAYOUT
// ─────────────────────────────────────────────────────────────

export default function OwnerLayout() {
  const [showMore, setShowMore] =
    useState(false);

  const location =
    useLocation();


  useEffect(() => {
    setShowMore(false);
  }, [location]);


  return (
    <div className="min-h-screen bg-[#F8FAFC]">


      {/* ═══════════════════════════════════════════════════════
          DESKTOP
      ═══════════════════════════════════════════════════════ */}

      <div className="hidden h-screen lg:flex">

        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">

          <Header />

          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>

        </div>

      </div>


      {/* ═══════════════════════════════════════════════════════
          MOBILE
      ═══════════════════════════════════════════════════════ */}

      <div className="min-h-screen lg:hidden">

        <main className="pb-20">
          <Outlet />
        </main>


        {/* More Sheet */}

        {showMore && (
          <>

            {/* Backdrop */}

            <button
              type="button"
              aria-label="Close menu"
              onClick={() =>
                setShowMore(false)
              }
              className="fixed inset-0 z-40 bg-black/30"
            />


            {/* Bottom Sheet */}

            <div className="fixed bottom-16 left-0 right-0 z-50 rounded-t-2xl border-t border-gray-200 bg-white px-4 pb-4 pt-3 shadow-2xl">

              <div className="mb-3 flex items-center justify-between">

                <p className="text-sm font-semibold text-gray-900">
                  More
                </p>


                <button
                  type="button"
                  onClick={() =>
                    setShowMore(false)
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500"
                >
                  <X size={17} />
                </button>

              </div>


              <div className="space-y-1">

                {moreItems.map(
                  (item) => {

                    const Icon =
                      item.icon;

                    return (
                      <NavLink
                        key={
                          item.path
                        }
                        to={
                          item.path
                        }
                        onClick={() =>
                          setShowMore(
                            false
                          )
                        }
                        className={({
                          isActive,
                        }) =>
                          `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                            isActive
                              ? "bg-blue-50 text-blue-600"
                              : "text-gray-600 hover:bg-gray-50"
                          }`
                        }
                      >

                        <Icon
                          size={19}
                        />

                        <span>
                          {
                            item.label
                          }
                        </span>

                      </NavLink>
                    );
                  }
                )}

              </div>

            </div>

          </>
        )}


        {/* Mobile Bottom Navigation */}

        <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 border-t border-gray-200 bg-white shadow-lg">

          <div className="grid h-full grid-cols-5">

            {mobileNavItems.map(
              (item) => {

                const Icon =
                  item.icon;

                return (
                  <NavLink
                    key={
                      item.path
                    }
                    to={
                      item.path
                    }
                    className={({
                      isActive,
                    }) =>
                      `flex flex-col items-center justify-center transition ${
                        isActive
                          ? "text-blue-600"
                          : "text-gray-500"
                      }`
                    }
                  >

                    <Icon
                      size={20}
                    />

                    <span className="mt-1 text-[11px] font-medium">
                      {
                        item.label
                      }
                    </span>

                  </NavLink>
                );
              }
            )}


            {/* More */}

            <button
              type="button"
              onClick={() =>
                setShowMore(
                  (previous) =>
                    !previous
                )
              }
              className={`flex flex-col items-center justify-center transition ${
                showMore
                  ? "text-blue-600"
                  : "text-gray-500"
              }`}
            >

              <MoreHorizontal
                size={20}
              />

              <span className="mt-1 text-[11px] font-medium">
                More
              </span>

            </button>

          </div>

        </nav>

      </div>

    </div>
  );
}