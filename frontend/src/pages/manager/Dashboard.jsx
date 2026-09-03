import { useNavigate } from "react-router-dom";

import HeroCard from "../../components/manager/hero/HeroCard";
import KPISection from "../../components/manager/KPISection";
import ProgressChecklist from "../../components/manager/ProgressChecklist";
import SalesSummary from "../../components/manager/SalesSummary";
import QuickActions from "../../components/manager/QuickActions";
import PurchaseSummary from "../../components/manager/PurchaseSummary";
import ExpenseSummary from "../../components/manager/ExpenseSummary";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="w-full">

      {/* =====================================================
          DESKTOP
      ===================================================== */}

      <div className="hidden lg:block space-y-6">

        <HeroCard />

        <KPISection />

        <div className="grid grid-cols-3 gap-6">

          <ProgressChecklist />

          <SalesSummary />

          <QuickActions />

        </div>

        <div className="grid grid-cols-3 gap-6">

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


        {/* Mobile Content */}

        <div className="px-4 pt-5 space-y-4">

          <HeroCard />

          <KPISection />


          {/* Today's Tasks */}

          <button
            type="button"
            onClick={() => navigate("/manager-tasks")}
            className="flex w-full items-center justify-between rounded-2xl border border-gray-200 bg-white px-5 py-5 text-left shadow-sm transition active:scale-[0.99]"
          >

            <div>

              <p className="text-base font-bold text-gray-900">
                Today's Tasks
              </p>

              <p className="mt-1 text-sm font-medium text-gray-500">
                View and manage your tasks
              </p>

            </div>

            <span className="ml-4 text-2xl font-medium text-gray-400">
              →
            </span>

          </button>


          <PurchaseSummary />

          <ExpenseSummary />

        </div>

      </div>

    </div>
  );
}