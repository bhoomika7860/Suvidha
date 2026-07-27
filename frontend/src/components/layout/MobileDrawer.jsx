import {
  Building2,
  Users,
  ClipboardCheck,
  Clock3,
  LogOut,
  X,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function MobileDrawer({
  open,
  onClose,
}) {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  }

  const items = [
    {
      label: "Stores",
      path: "/stores",
      icon: Building2,
    },
    {
      label: "Staff",
      path: "/staff-management",
      icon: Users,
    },
    {
      label: "Tasks",
      path: "/tasks",
      icon: ClipboardCheck,
    },
    {
      label: "Previous Reports",
      path: "/previous-reports",
      icon: Clock3,
    },
  ];

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white z-50 transition-transform duration-300 ${
          open
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-5 border-b">

          <h2 className="font-bold text-xl">
            Menu
          </h2>

          <button onClick={onClose}>
            <X />
          </button>

        </div>

        <div className="p-4 space-y-2">

          {items.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                onClick={() => {
                  navigate(item.path);
                  onClose();
                }}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-gray-100"
              >
                <Icon size={20} />
                {item.label}
              </button>
            );
          })}

        </div>

        <div className="absolute bottom-6 left-4 right-4">

          <button
            onClick={logout}
            className="w-full py-3 rounded-xl border border-red-200 text-red-600"
          >
            Logout
          </button>

        </div>

      </aside>
    </>
  );
}