import ReportProgress from "../../components/dailyReport/ReportProgress";
import SalesSection from "../../components/dailyReport/SalesSection";
import ExpenseSection from "../../components/dailyReport/ExpenseSection";
import PurchaseSection from "../../components/dailyReport/PurchaseSection";
import DeliverySection from "../../components/dailyReport/DeliverySection";

import ReviewSection from "../../components/dailyReport/ReviewSection";

export default function DailyReport() {
  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between">

        <div>
          <div className="flex items-center gap-3">

            <h1 className="text-3xl font-bold text-gray-900">
              Today's Daily Report
            </h1>

            <span className="px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-700 border border-amber-200">
              Draft
            </span>

          </div>

          <p className="text-gray-500 mt-1">
            Complete all sections before submitting today's report.
          </p>

        </div>

      </div>

      <ReportProgress />

      <SalesSection />

      <ExpenseSection />

      <PurchaseSection />

      <DeliverySection />

      

      

      <ReviewSection />

    </div>
  );
}