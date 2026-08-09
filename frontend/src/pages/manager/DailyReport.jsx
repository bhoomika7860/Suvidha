import { useEffect, useState } from "react";
import dailyReportsService from "../../services/dailyReportsService";
import { CalendarDays } from "lucide-react";

import ReportProgress from "../../components/dailyReport/ReportProgress";
import SalesSection from "../../components/dailyReport/SalesSection";
import ExpenseSection from "../../components/dailyReport/ExpenseSection";
import PurchaseSection from "../../components/dailyReport/PurchaseSection";
import DeliverySection from "../../components/dailyReport/DeliverySection";
import ReviewSection from "../../components/dailyReport/ReviewSection";

function getInitialDate() {
  const savedDate =
    localStorage.getItem("pharmacore360_selected_report_date");

  if (savedDate) {
    return savedDate;
  }

  return new Date().toISOString().split("T")[0];
}

export default function DailyReport() {
  const [selectedDate, setSelectedDate] =
    useState(getInitialDate);

  const [report, setReport] =
    useState(null);

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
      console.error(
        "Failed to load daily report:",
        err
      );
    }
  }

  function handleDateChange(e) {
    const date = e.target.value;

    setSelectedDate(date);

    localStorage.setItem(
      "pharmacore360_selected_report_date",
      date
    );
  }

  if (!report) {
    return (
      <div className="p-10">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex items-start justify-between">

        <div>

          <div className="flex items-center gap-3">

            <h1 className="text-3xl font-bold text-gray-900">
              Daily Report
            </h1>

            <span className="rounded-full border border-amber-200 bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700">
              {report.is_locked
                ? "Locked"
                : "Draft"}
            </span>

          </div>

          <p className="mt-1 text-gray-500">
            Complete all sections before submitting
            the report.
          </p>

        </div>

        {/* Date */}

        <div className="flex items-center gap-2">

          <CalendarDays
            size={20}
            className="text-gray-500"
          />

          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="rounded-xl border border-gray-300 px-4 py-2"
          />

        </div>

      </div>

      {/* Report Progress */}

      <ReportProgress
        report={report}
        refreshReport={loadReport}
      />

      {/* Sales */}

      <SalesSection
        report={report}
        refreshReport={loadReport}
      />

      {/* Expenses */}

      <ExpenseSection
        report={report}
        refreshReport={loadReport}
      />

      {/* Purchases */}

      <PurchaseSection
        report={report}
        refreshReport={loadReport}
      />

      {/* Deliveries */}

      <DeliverySection
        report={report}
        refreshReport={loadReport}
      />

      {/* Review */}

      <ReviewSection
        report={report}
        refreshReport={loadReport}
      />

    </div>
  );
}