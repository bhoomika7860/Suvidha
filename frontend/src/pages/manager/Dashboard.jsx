import HeroCard from "../../components/manager/hero/HeroCard";
import KPISection from "../../components/manager/KPISection";
import PurchaseSummary from "../../components/manager/PurchaseSummary";
import ExpenseSummary from "../../components/manager/ExpenseSummary";

export default function Dashboard() {
  return (
    <div className="w-full">

      {/* =====================================================
          DESKTOP
      ===================================================== */}

      <div className="hidden lg:block space-y-6">

        <HeroCard />

        <KPISection />

        <div className="grid grid-cols-2 gap-6">

          <PurchaseSummary />

          <ExpenseSummary />

        </div>

      </div>


      {/* =====================================================
          MOBILE
      ===================================================== */}

      <div className="lg:hidden w-full min-h-screen bg-gray-50 pb-24 overflow-x-hidden">

        {/* Header */}

        <div className="w-full bg-white border-b px-5 pt-6 pb-5">

          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard
          </h1>

          <p className="mt-1 text-gray-500">
            Store overview and today's activity.
          </p>

        </div>


        {/* Content */}

        <div className="px-4 pt-5 space-y-4">

          <HeroCard />

          <KPISection />

          <PurchaseSummary />

          <ExpenseSummary />

        </div>

      </div>

    </div>
  );
}