import { useEffect, useState } from "react";
import dailyReportsService from "../../services/dailyReportsService";
import { CalendarDays } from "lucide-react";

import ReportProgress from "../../components/dailyReport/ReportProgress";
import SalesSection from "../../components/dailyReport/SalesSection";
import ExpenseSection from "../../components/dailyReport/ExpenseSection";
import PurchaseSection from "../../components/dailyReport/PurchaseSection";
import DeliverySection from "../../components/dailyReport/DeliverySection";
import ReviewSection from "../../components/dailyReport/ReviewSection";

export default function DailyReport() {

  const [selectedDate, setSelectedDate] = useState(
  new Date().toISOString().split("T")[0]
);

const [report, setReport] = useState(null);

useEffect(() => {
  loadReport();
}, [selectedDate]);

async function loadReport() {
  try {
    const data =
      await dailyReportsService.getOrCreateReport(
        selectedDate
      );

    setReport(data);
  } catch (err) {
    console.error(err);
  }
}

if (!report) {
  return (
    <div className="p-10 text-center">
      Loading...
    </div>
  );
}
  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between">

  <div>

    <div className="flex items-center gap-3">

      <h1 className="text-3xl font-bold text-gray-900">
        Daily Report
      </h1>

      <span className="px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-700 border border-amber-200">
        Draft
      </span>

    </div>

    <p className="text-gray-500 mt-1">
      Complete all sections before submitting the report.
    </p>

  </div>

  <div className="flex items-center gap-3">

    <CalendarDays
      size={20}
      className="text-gray-500"
    />

    <input
      type="date"
      value={selectedDate}
      onChange={(e) =>
        setSelectedDate(e.target.value)
      }
      className="rounded-xl border border-gray-300 px-4 py-2"
    />

  </div>

</div>

      <ReportProgress
  report={report}
  refreshReport={loadReport}
/>

      <SalesSection
  report={report}
  refreshReport={loadReport}
/>

      <ExpenseSection
  report={report}
  refreshReport={loadReport}
/>

      <PurchaseSection
  report={report}
/>

      <DeliverySection
  report={report}
  refreshReport={loadReport}
/>

      <ReviewSection
  report={report}
  refreshReport={loadReport}
/>

    </div>
  );
}