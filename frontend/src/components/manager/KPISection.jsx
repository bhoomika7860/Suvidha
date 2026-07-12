import { useEffect, useState } from "react";
import {
  ShoppingCart,
  BadgeDollarSign,
  Truck,
  Wallet,
  Package,
  CreditCard,
} from "lucide-react";

import KPICard from "./KPICard";
import analyticsService from "../../services/analyticsService";

export default function KPISection() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await analyticsService.getDashboardSummary();
        setSummary(data);
      } catch (err) {
        console.error(err);
      }
    }

    loadData();
  }, []);

  if (!summary) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-6 gap-4">

      <KPICard
        icon={<ShoppingCart size={20} className="text-blue-600" />}
        value={`₹${summary.total_sales.toLocaleString()}`}
        label="Today's Sales"
        iconBg="#EEF4FF"
      />

      <KPICard
        icon={<BadgeDollarSign size={20} className="text-green-600" />}
        value={summary.total_bills}
        label="Today's Bills"
        iconBg="#ECFDF3"
      />

      <KPICard
        icon={<Truck size={20} className="text-violet-600" />}
        value={summary.total_deliveries ?? 0}
        label="Today's Deliveries"
        iconBg="#F5F3FF"
      />

      <KPICard
        icon={<Wallet size={20} className="text-orange-500" />}
        value={`₹${summary.total_expenses.toLocaleString()}`}
        label="Today's Expenses"
        iconBg="#FFF7ED"
      />

      <KPICard
        icon={<Package size={20} className="text-orange-600" />}
        value={`₹${summary.total_purchases.toLocaleString()}`}
        label="Today's Purchases"
        iconBg="#FFF7ED"
      />

      <KPICard
        icon={<CreditCard size={20} className="text-red-600" />}
        value={`₹${summary.total_udhaar.toLocaleString()}`}
        label="Today's Udhaar"
        iconBg="#FEF2F2"
      />

    </div>
  );
}