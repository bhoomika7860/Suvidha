import { jwtDecode } from "jwt-decode";

export default function OwnerDashboardMobile() {
  const token = localStorage.getItem("token");

  const user = token ? jwtDecode(token) : null;

  const name =
    user?.full_name ||
    user?.username ||
    "Owner";

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">

      {/* Hero Card */}

      <div className="px-4 pt-4">

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">

          <p className="text-xs tracking-[0.25em] font-bold text-blue-700 uppercase">
            PharmaCore360
          </p>

          <h1 className="text-3xl font-bold text-[#0F172A] mt-4 leading-tight">
            Good Afternoon,
            <br />
            {name}
          </h1>

          <p className="mt-3 text-gray-500 leading-relaxed">
            Here's today's operational overview across all stores.
          </p>

          <div className="mt-6 inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-2">

            <div className="w-2 h-2 rounded-full bg-green-500" />

            <span className="text-green-700 font-medium text-sm">
              2 Stores Active
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}