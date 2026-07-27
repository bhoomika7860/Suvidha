import { Outlet } from "react-router-dom";

export default function OwnerMobileLayout() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Outlet />
    </div>
  );
}