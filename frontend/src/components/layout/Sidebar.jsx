import {
  LayoutDashboard,
  FileText,
  Package,
  Target,
  SlidersHorizontal,
  BarChart3,
  ClipboardList,
  Settings,
  Users,
  X,
  LogOut
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const navItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/owner-dashboard",
  },
  {
    label: "Daily Reports",
    icon: FileText,
    path: "/daily-reports",
  },
  {
    label: "Staff",
    icon: Users,
    path: "/staff-management",
  },
  {
    label: "Tasks",
    icon: Target,
    path: "/tasks",
  },
  {
    label: "Analytics",
    icon: BarChart3,
    path: "/analytics",
  },
];

export default function Sidebar({ open, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className="fixed top-0 left-0 z-50 h-screen w-64 flex flex-col bg-white border-r border-[#E2E8F0]">
        {/* Brand */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-[#E2E8F0]">
          <div className="w-10 h-10 rounded-lg bg-[#2563EB] flex items-center justify-center text-white font-bold">
            H
          </div>

          <div>
            <h1 className="text-lg font-bold text-[#0F172A]">
              PharmaCore360
            </h1>
            <p className="text-[11px] font-semibold uppercase text-[#1E3A8A]">
              Owner Portal
            </p>
          </div>

          <button
            className="ml-auto lg:hidden"
            onClick={onClose}
          >
            <X size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-5 px-3 space-y-1">
          {navItems.map(({ label, icon: Icon, path }) => {
            const active = location.pathname.startsWith(path);

            return (
              <button
                key={label}
                onClick={() => navigate(path)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-[17px] font-medium ${
                  active
                    ? "bg-[#DBEAFE] text-[#1E3A8A]"
                    : "text-[#475569] hover:bg-[#F8FAFC]"
                }`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>

        {/* User */}
        <div className="px-3 pb-4 pt-4 border-t border-[#E2E8F0]">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#F8FAFC]">
            <div className="w-9 h-9 rounded-full bg-[#DBEAFE] flex items-center justify-center">
              <span className="text-xs font-bold text-[#1E3A8A]">RA</span>
            </div>

            <div>
              <p className="text-sm font-semibold text-[#0F172A]">
                Rajesh Agarwal
              </p>
              <p className="text-[11px] text-[#64748B]">Owner</p>
            </div>

            <LogOut size={16} className="ml-auto text-[#64748B]" />
          </div>
        </div>
      </aside>
    </>
  );
}