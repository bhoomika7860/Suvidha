import ProgressRing from "./ProgressRing";
import ReportInfo from "./ReportInfo";
import ProgressSummary from "./ProgressSummary";
import ContinueButton from "./ContinueButton";

export default function HeroCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-6 py-4">

      <div className="flex items-center justify-between gap-8">

        {/* Left Side */}
        <div className="flex-1 pr-6">
          <ReportInfo />
        </div>

        {/* Right Side */}
        <div className="w-60 flex flex-col items-center">

          <ProgressSummary />

          <div className="my-2">
            <ProgressRing progress={65} />
          </div>

          <ContinueButton />

        </div>

      </div>

    </div>
  );
}