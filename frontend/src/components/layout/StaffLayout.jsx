import { Outlet } from "react-router-dom";

import StaffSidebar from "../staff/StaffSidebar";
import StaffTopbar from "../staff/StaffTopbar";

export default function StaffLayout() {
  return (
    <div className="flex h-screen bg-gray-50">

      <StaffSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">

        <StaffTopbar />

        <main className="flex-1 overflow-y-auto p-6">

          <Outlet />

        </main>

      </div>

    </div>
  );
}