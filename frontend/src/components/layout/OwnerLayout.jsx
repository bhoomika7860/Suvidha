import { Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import Sidebar from "./Sidebar";
import Header from "./Header";

export default function OwnerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const location = useLocation();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  return (
    <div className="flex h-screen bg-[#F8FAFC]">

      {/* Mobile Overlay */}

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}

      <div
        className={`
          fixed lg:static
          top-0 left-0
          h-full
          z-50
          transform
          transition-transform
          duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Main Content */}

<div className="flex flex-col flex-1 overflow-hidden lg:ml-64">

  <Header
    onMenuClick={() => setSidebarOpen(true)}
  />

  <main className="flex-1 overflow-y-auto p-4 lg:p-6">
    <Outlet />
  </main>

</div>

    </div>
  );
}