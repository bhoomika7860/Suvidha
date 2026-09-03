import { useEffect, useState } from "react";

import {
  ShoppingCart,
  BadgeDollarSign,
  Truck,
  Wallet,
  Package,
  Scale,
} from "lucide-react";

import KPICard from "./KPICard";
import analyticsService from "../../services/analyticsService";

export default function KPISection() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data =
          await analyticsService.getDashboardSummary();

        setSummary(data);
      } catch (err) {
        console.error(err);
      }
    }

    loadData();
  }, []);

  if (!summary) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        Loading...
      </div>
    );
  }

  return (
    <>
      {/* =====================================================
          DESKTOP
          DO NOT CHANGE — EXISTING DESKTOP KPI LAYOUT
      ===================================================== */}

      <div className="hidden lg:grid grid-cols-5 gap-4">

        {/* SALES */}

        <KPICard
          icon={
            <ShoppingCart
              size={20}
              className="text-blue-600"
            />
          }
          value={`₹${summary.total_sales.toLocaleString("en-IN")}`}
          label="Today's Sales"
          iconBg="#EEF4FF"
        />


        {/* SALES DIFFERENCE */}

        <KPICard
          icon={
            <Scale
              size={20}
              className={
                summary.sales_difference === 0
                  ? "text-green-600"
                  : "text-red-600"
              }
            />
          }
          value={`₹${summary.sales_difference.toLocaleString("en-IN")}`}
          label="Sales Difference"
          iconBg={
            summary.sales_difference === 0
              ? "#ECFDF3"
              : "#FEF2F2"
          }
          valueColor={
            summary.sales_difference === 0
              ? "text-green-600"
              : "text-red-600"
          }
        />


        {/* BILLS + DELIVERIES */}

        <KPICard
          split
          topIcon={
            <BadgeDollarSign
              size={18}
              className="text-green-600"
            />
          }
          topValue={summary.total_bills}
          topLabel="Today's Bills"
          bottomIcon={
            <Truck
              size={18}
              className="text-violet-600"
            />
          }
          bottomValue={
            summary.total_deliveries ?? 0
          }
          bottomLabel="Today's Deliveries"
        />


        {/* EXPENSES */}

        <KPICard
          icon={
            <Wallet
              size={20}
              className="text-orange-500"
            />
          }
          value={`₹${summary.total_expenses.toLocaleString("en-IN")}`}
          label="Today's Expenses"
          iconBg="#FFF7ED"
        />


        {/* PURCHASES */}

        <KPICard
          icon={
            <Package
              size={20}
              className="text-orange-600"
            />
          }
          value={`₹${summary.total_purchases.toLocaleString("en-IN")}`}
          label="Today's Purchases"
          iconBg="#FFF7ED"
        />

      </div>


      {/* =====================================================
          MOBILE
          ONLY 4 KPIs
      ===================================================== */}

      <div className="lg:hidden grid grid-cols-2 gap-3">

        {/* TODAY'S SALES */}

        <KPICard
          icon={
            <ShoppingCart
              size={20}
              className="text-blue-600"
            />
          }
          value={`₹${summary.total_sales.toLocaleString("en-IN")}`}
          label="Today's Sales"
          iconBg="#EEF4FF"
        />


        {/* SALES DIFFERENCE */}

        <KPICard
          icon={
            <Scale
              size={20}
              className={
                summary.sales_difference === 0
                  ? "text-green-600"
                  : "text-red-600"
              }
            />
          }
          value={`₹${summary.sales_difference.toLocaleString("en-IN")}`}
          label="Sales Difference"
          iconBg={
            summary.sales_difference === 0
              ? "#ECFDF3"
              : "#FEF2F2"
          }
          valueColor={
            summary.sales_difference === 0
              ? "text-green-600"
              : "text-red-600"
          }
        />


        {/* TODAY'S BILLS */}

        <KPICard
          icon={
            <BadgeDollarSign
              size={20}
              className="text-green-600"
            />
          }
          value={summary.total_bills}
          label="Today's Bills"
          iconBg="#ECFDF3"
        />


        {/* TODAY'S DELIVERIES */}

        <KPICard
          icon={
            <Truck
              size={20}
              className="text-violet-600"
            />
          }
          value={summary.total_deliveries ?? 0}
          label="Today's Deliveries"
          iconBg="#F5F3FF"
        />

      </div>
    </>
  );
}