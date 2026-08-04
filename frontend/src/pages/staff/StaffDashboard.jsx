import HeroCard from "../../components/staff/HeroCard";
import TaskCard from "../../components/staff/TaskCard";
import QuickActions from "../../components/staff/QuickActions";


export default function StaffDashboard() {
  return (
    <div className="space-y-6">

      <HeroCard />

      <div className="grid grid-cols-3 gap-6">

        <div className="col-span-2">
          <TaskCard />
        </div>

        <QuickActions />

      </div>


    </div>
  );
}