import { Outlet } from "react-router-dom";
import Sidebar from "../manager/Sidebar";
import Header from "../manager/Header";


export default function ManagerLayout() {
  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}