import {
  Clock3,
  CheckCircle2,
} from "lucide-react";

const activities = [
  "Purchase bill from Sun Pharma received.",
  "Electricity expense added.",
  "Tea & Snacks expense added.",
  "Purchase bill checked successfully.",
];

export default function RecentActivity() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">

      <div className="flex justify-between items-center">

        <h2 className="text-2xl font-bold">
          Recent Activity
        </h2>

        <Clock3 className="text-gray-400" />

      </div>

      <div className="mt-6 space-y-4">

        {activities.map((activity, index) => (

          <div
            key={index}
            className="flex items-center gap-3 border-b last:border-none pb-4 last:pb-0"
          >

            <CheckCircle2
              size={18}
              className="text-green-600"
            />

            <span className="text-gray-700">
              {activity}
            </span>

          </div>

        ))}

      </div>

    </div>
  );
}