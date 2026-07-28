import {
  IndianRupee,
  ShoppingCart,
  Receipt,
  Wallet,
} from "lucide-react";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

import dashboardService from "../../services/dashboardService";

import MobileHero from "../../components/mobile/owner/MobileHero";
import MobileKPICard from "../../components/mobile/owner/MobileKPICard";

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function OwnerDashboardMobile() {
  const token = localStorage.getItem("token");

  const user = token ? jwtDecode(token) : null;

  const name =
    user?.full_name ||
    user?.username ||
    "Owner";

  const [loading, setLoading] = useState(true);

  const [summary, setSummary] = useState({
    total_sales: 0,
    total_purchases: 0,
    total_bills: 0,
    total_expenses: 0,
  });

  const [totalStores, setTotalStores] =
    useState(0);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const data =
          await dashboardService.getDashboardData();

        setSummary(data.summary);

        setTotalStores(data.totalStores);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading Dashboard...
      </div>
    );
  }

  const kpiCards = [
  {
    title: "Sales",
    value: `₹${Number(summary.total_sales || 0).toLocaleString("en-IN")}`,
    icon: IndianRupee,
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
  {
    title: "Purchases",
    value: `₹${Number(summary.total_purchases || 0).toLocaleString("en-IN")}`,
    icon: ShoppingCart,
    color: "text-orange-600",
    bg: "bg-orange-100",
  },
  {
    title: "Bills",
    value: Number(summary.total_bills || 0),
    icon: Receipt,
    color: "text-purple-600",
    bg: "bg-purple-100",
  },
  {
    title: "Expenses",
    value: `₹${Number(summary.total_expenses || 0).toLocaleString("en-IN")}`,
    icon: Wallet,
    color: "text-green-600",
    bg: "bg-green-100",
  },
];

  return (
  <div className="min-h-screen bg-[#F8FAFC]">

    <div className="p-4 space-y-4">

        <MobileHero
            totalStores={totalStores}
        />

        <div className="grid grid-cols-2 gap-4">

            {kpiCards.map((card)=>(
                <MobileKPICard
                    key={card.title}
                    {...card}
                />
            ))}

        </div>

    </div>

</div>
);
}