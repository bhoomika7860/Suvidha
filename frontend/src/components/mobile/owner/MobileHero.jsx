import { jwtDecode } from "jwt-decode";

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function MobileHero({ totalStores }) {
  const token = localStorage.getItem("token");
  const user = token ? jwtDecode(token) : null;

  const name =
    user?.full_name ||
    user?.username ||
    "Owner";

  const store =
    user?.store_name ||
    "All Stores";

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-5">

      <div className="flex justify-between items-start">

        <div>

          <p className="text-[13px] text-gray-500 font-medium">
            {getGreeting()} 👋
          </p>

          <h1 className="text-[30px] font-bold text-slate-900 leading-tight mt-1">
            {name}
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            {store}
          </p>

        </div>

        <div className="bg-green-50 border border-green-200 rounded-full px-4 py-2">

          <span className="text-green-700 text-sm font-semibold">
            {totalStores} Stores
          </span>

        </div>

      </div>

    </div>
  );
}