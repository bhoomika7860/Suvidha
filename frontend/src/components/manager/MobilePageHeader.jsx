import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MobilePageHeader({
  title,
  subtitle,
}) {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  }

  return (
    <div className="border-b border-gray-200 bg-white px-5 py-5">
      <div className="flex items-start justify-between gap-4">

        <div className="min-w-0">
          <h1 className="text-3xl font-bold leading-tight text-gray-900">
            {title}
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            {subtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={logout}
          aria-label="Logout"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-200 bg-white text-red-500 transition active:bg-red-50"
        >
          <LogOut size={19} />
        </button>

      </div>
    </div>
  );
}