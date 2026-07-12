import ProgressRing from "./ProgressRing";
import ReportInfo from "./ReportInfo";
import ProgressSummary from "./ProgressSummary";
import ContinueButton from "./ContinueButton";

export default function HeroCard({ report, user }) {
  if (!report) return null;

  const completedSections = [
    report.sales_completed,
    report.expenses_completed,
    report.purchases_completed,
    report.deliveries_completed,
    report.bounced_products_completed,
    report.notes_completed,
  ].filter(Boolean).length;

  const totalSections = 6;

  const progress = Math.round(
    (completedSections / totalSections) * 100
  );

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-6 py-4">
      <div className="flex items-center justify-between gap-8">

        <div className="flex-1 pr-6">
          <ReportInfo
            report={report}
            user={user}
          />
        </div>

        <div className="w-60 flex flex-col items-center">

          <ProgressSummary
            completed={completedSections}
            total={totalSections}
          />

          <div className="my-2">
            <ProgressRing progress={progress} />
          </div>

          <ContinueButton />

        </div>
      </div>
    </div>
  );
}