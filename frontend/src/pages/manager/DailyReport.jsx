import { useEffect, useState } from "react";

import dailyReportsService from "../../services/dailyReportsService";

import { useBusinessDate } from "../../contexts/BusinessDateContext";

import ReportProgress from "../../components/dailyReport/ReportProgress";
import SalesSection from "../../components/dailyReport/SalesSection";
import ExpenseSection from "../../components/dailyReport/ExpenseSection";
import PurchaseSection from "../../components/dailyReport/PurchaseSection";
import DeliverySection from "../../components/dailyReport/DeliverySection";
import ReviewSection from "../../components/dailyReport/ReviewSection";

export default function DailyReport() {
  const { selectedDate } = useBusinessDate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReport();
  }, [selectedDate]);

  async function loadReport() {
    try {
      setLoading(true);
      setReport(null);

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

      console.error(
        "Status:",
        err.response?.status
      );

      console.error(
        "Backend response:",
        err.response?.data
      );

      setReport(null);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="p-10 text-gray-500">
        Loading daily report...
      </div>
    );
  }

  if (!report) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
        Failed to load the daily report.
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}

      <div>
        <div className="flex flex-wrap items-center gap-3">

          <h1 className="text-3xl font-bold text-gray-900">
            Daily Report
          </h1>

          <span
            className={`rounded-full border px-3 py-1 text-sm font-medium ${
              report.is_locked
                ? "border-green-200 bg-green-100 text-green-700"
                : "border-amber-200 bg-amber-100 text-amber-700"
            }`}
          >
            {report.is_locked
              ? "Locked"
              : "Draft"}
          </span>

        </div>

        <p className="mt-1 text-gray-500">
          Complete all sections before submitting
          the report.
        </p>

        <p className="mt-2 text-sm font-medium text-blue-600">
          Business Date: {selectedDate}
        </p>
      </div>

      {/* Progress */}

      <ReportProgress
        report={report}
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