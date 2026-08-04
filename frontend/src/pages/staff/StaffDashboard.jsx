import HeroCard from "../../components/staff/HeroCard";
import TaskCard from "../../components/staff/TaskCard";
import QuickActions from "../../components/staff/QuickActions";

export default function StaffDashboard() {
  return (
    <>
      {/* ================= Desktop ================= */}

      <div className="hidden lg:block space-y-6">

        <HeroCard />

        <div className="grid grid-cols-3 gap-6">

          <div className="col-span-2">
            <TaskCard />
          </div>

          <QuickActions />

        </div>

      </div>

      {/* ================= Mobile ================= */}

      <div className="lg:hidden min-h-screen bg-gray-50">

        <HeroCard />

        <div className="px-4 mt-6">

          <TaskCard />

        </div>

      </div>
    </>
  );
}