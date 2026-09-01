import { useEffect, useState } from "react";

import ProgressRing from "./ProgressRing";
import analyticsService from "../../../services/analyticsService";

export default function HeroCard() {
  const [report, setReport] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data =
          await analyticsService.getManagerHero();

        setReport(data.report);
        setUser(data.user);
      } catch (err) {
        console.error(err);
      }
    }

    loadData();
  }, []);

  if (!report || !user) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        Loading...
      </div>
    );
  }

  const completedSections = [
    report.sales_completed,
    report.expenses_completed,
    report.purchases_completed,
    report.deliveries_completed,
  ].filter(Boolean).length;

  const totalSections = 4;

  const progress = Math.round(
    (completedSections / totalSections) * 100
  );

  const managerName =
    user.full_name ||
    user.username ||
    "Manager";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">

      <div className="flex items-center justify-between gap-4">

        {/* LEFT SIDE */}

        <div className="min-w-0">

          <p className="text-sm text-slate-500">
            Good Afternoon,
          </p>

          <h1 className="mt-1 truncate text-2xl font-bold text-gray-900 sm:text-3xl">
            {managerName}
          </h1>

        </div>


        {/* RIGHT SIDE */}

        <div className="flex shrink-0 items-center gap-3 sm:gap-5">

          <div className="text-right">

            <p className="text-xs text-gray-500 sm:text-sm">
              Progress
            </p>

            <p className="text-base font-bold text-gray-900 sm:text-lg">
              {completedSections}/{totalSections} sections
            </p>

          </div>

          <ProgressRing
            progress={progress}
            size={64}
          />

        </div>

      </div>

    </div>
  );
}