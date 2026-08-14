import { useEffect, useState } from "react";

import dailyReportsService from "../../services/dailyReportsService";

import { useBusinessDate } from "../../contexts/BusinessDateContext";

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
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-sm text-gray-500">
          Loading daily report...
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
        Failed to load the daily report.
      </div>
    );
  }

  const isLocked = report.is_locked;

  return (
    <div className="mx-auto w-full max-w-[1400px] pb-16">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="mb-8">

        <div className="flex flex-wrap items-start justify-between gap-4">

          <div>

            <div className="flex flex-wrap items-center gap-3">

              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Daily Report
              </h1>

              <span
                className={`rounded-full border px-3 py-1 text-sm font-medium ${
                  isLocked
                    ? "border-green-200 bg-green-50 text-green-700"
                    : "border-amber-200 bg-amber-50 text-amber-700"
                }`}
              >
                {isLocked ? "Locked" : "Draft"}
              </span>

            </div>

            <p className="mt-2 text-gray-500">
              Record the complete operational summary for this
              business date.
            </p>

            <p className="mt-2 text-sm font-medium text-blue-600">
              Business Date: {selectedDate}
            </p>

          </div>

        </div>

      </header>


      {/* =====================================================
          REPORT SUMMARY
      ====================================================== */}

      <div className="mb-10 grid grid-cols-2 gap-3 md:grid-cols-4">

        <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4">
          <p className="text-sm text-gray-500">
            Sales
          </p>

          <p className="mt-1 text-xl font-semibold text-gray-900">
            ₹{Number(report.cash_sales || 0).toLocaleString("en-IN")}
          </p>
        </div>


        <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4">
          <p className="text-sm text-gray-500">
            Deliveries
          </p>

          <p className="mt-1 text-xl font-semibold text-gray-900">
            {Number(report.deliveries || 0)}
          </p>
        </div>


        <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4">
          <p className="text-sm text-gray-500">
            Expenses
          </p>

          <p className="mt-1 text-xl font-semibold text-gray-900">
            ₹{Number(report.total_expenses || 0).toLocaleString("en-IN")}
          </p>
        </div>


        <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4">
          <p className="text-sm text-gray-500">
            Purchases Received
          </p>

          <p className="mt-1 text-xl font-semibold text-gray-900">
            ₹
            {Number(
              report.total_purchases || 0
            ).toLocaleString("en-IN")}
          </p>
        </div>

      </div>


      {/* =====================================================
          CONTINUOUS REPORT
      ====================================================== */}

      <main className="rounded-3xl border border-gray-200 bg-white">

        {/* ===================================================
            SALES
        ==================================================== */}

        <section className="border-b border-gray-200 px-5 py-8 sm:px-8 lg:px-10">

          <div className="mb-7">

            <div className="flex items-center gap-3">

              <span className="text-sm font-semibold tracking-wider text-blue-600">
                01
              </span>

              <h2 className="text-2xl font-bold text-gray-900">
                Sales
              </h2>

            </div>

            <p className="mt-1 text-sm text-gray-500">
              Record today's sales and payment collections.
            </p>

          </div>

          <SalesSection
            report={report}
            refreshReport={loadReport}
            embedded
            disabled={isLocked}
          />

        </section>


        {/* ===================================================
            DELIVERIES
        ==================================================== */}

        <section className="border-b border-gray-200 px-5 py-8 sm:px-8 lg:px-10">

          <div className="mb-7">

            <div className="flex items-center gap-3">

              <span className="text-sm font-semibold tracking-wider text-violet-600">
                02
              </span>

              <h2 className="text-2xl font-bold text-gray-900">
                Deliveries
              </h2>

            </div>

            <p className="mt-1 text-sm text-gray-500">
              Record the total deliveries completed for this
              business date.
            </p>

          </div>

          <DeliverySection
            report={report}
            refreshReport={loadReport}
            embedded
            disabled={isLocked}
          />

        </section>


        {/* ===================================================
            EXPENSES
        ==================================================== */}

        <section className="border-b border-gray-200 px-5 py-8 sm:px-8 lg:px-10">

          <div className="mb-7">

            <div className="flex items-center gap-3">

              <span className="text-sm font-semibold tracking-wider text-orange-600">
                03
              </span>

              <h2 className="text-2xl font-bold text-gray-900">
                Expenses
              </h2>

            </div>

            <p className="mt-1 text-sm text-gray-500">
              Expenses recorded specifically for this business
              date.
            </p>

          </div>

          <ExpenseSection
            report={report}
            refreshReport={loadReport}
            embedded
            disabled={isLocked}
          />

        </section>


        {/* ===================================================
            PURCHASES
        ==================================================== */}

        <section className="px-5 py-8 sm:px-8 lg:px-10">

          <div className="mb-7">

            <div className="flex items-center gap-3">

              <span className="text-sm font-semibold tracking-wider text-blue-600">
                04
              </span>

              <h2 className="text-2xl font-bold text-gray-900">
                Purchases
              </h2>

            </div>

            <p className="mt-1 text-sm text-gray-500">
              Purchases received for this business date.
            </p>

          </div>

          <PurchaseSection
            report={report}
            refreshReport={loadReport}
            embedded
            disabled={isLocked}
          />

        </section>

      </main>


      {/* =====================================================
          REVIEW & SUBMIT
      ====================================================== */}

      <section className="mt-8">

        <ReviewSection
          report={report}
          refreshReport={loadReport}
          embedded
          disabled={isLocked}
        />

      </section>

    </div>
  );
}