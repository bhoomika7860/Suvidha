import {
  ShoppingCart,
  BadgeDollarSign,
  Truck,
  Wallet,
  Package,
  CreditCard,
} from "lucide-react";

import KPICard from "./KPICard";

export default function KPISection() {
  return (
    <div className="grid grid-cols-6 gap-4">
      <KPICard
        icon={<ShoppingCart size={20} className="text-blue-600" />}
        value="₹54,100"
        label="Today's Sales"
        iconBg="#EEF4FF"
      />

      <KPICard
        icon={<BadgeDollarSign size={20} className="text-green-600" />}
        value="87"
        label="Today's Bills"
        iconBg="#ECFDF3"
      />

      <KPICard
        icon={<Truck size={20} className="text-violet-600" />}
        value="12"
        label="Today's Deliveries"
        iconBg="#F5F3FF"
      />

      <KPICard
        icon={<Wallet size={20} className="text-orange-500" />}
        value="₹2,200"
        label="Today's Expenses"
        iconBg="#FFF7ED"
      />

      <KPICard
        icon={<Package size={20} className="text-orange-600" />}
        value="₹22,500"
        label="Today's Purchases"
        iconBg="#FFF7ED"
      />

      <KPICard
        icon={<CreditCard size={20} className="text-red-600" />}
        value="₹4,200"
        label="Today's Udhaar"
        iconBg="#FEF2F2"
      />
    </div>
  );
}