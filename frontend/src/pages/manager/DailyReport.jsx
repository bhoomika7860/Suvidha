import {
  useEffect,
  useRef,
  useState,
} from "react";

import dailyReportsService from "../../services/dailyReportsService";

import { useBusinessDate } from "../../contexts/BusinessDateContext";

import SalesSection from "../../components/dailyReport/SalesSection";

export default function DailyReport() {
  const { selectedDate } = useBusinessDate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const salesRef = useRef(null);

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

  async function handleFinalSubmit() {
    if (
      !report ||
      report.is_locked ||
      submitting
    ) {
      return;
    }

    try {
      setSubmitting(true);

      if (salesRef.current?.save) {
        await salesRef.current.save();
      }

      const latestReport =
        await dailyReportsService.getOrCreateReport(
          selectedDate
        );

      setReport(latestReport);

      await dailyReportsService.submitReport(
        latestReport.id
      );

      alert(
        "Daily report submitted successfully."
      );

      await loadReport();

    } catch (err) {
      console.error(
        "Failed to submit daily report:",
        err
      );

      console.error(
        "Submit status:",
        err?.response?.status
      );

      console.error(
        "Submit backend response:",
        err?.response?.data
      );

      const backendDetail =
        err?.response?.data?.detail;

      let errorMessage =
        "Failed to submit daily report.";

      if (
        typeof backendDetail ===
        "string"
      ) {
        errorMessage =
          backendDetail;
      } else if (
        Array.isArray(
          backendDetail
        )
      ) {
        errorMessage =
          backendDetail
            .map((item) =>
              typeof item === "string"
                ? item
                : item?.msg ||
                  JSON.stringify(item)
            )
            .join("\n");
      } else if (
        backendDetail &&
        typeof backendDetail ===
          "object"
      ) {
        errorMessage =
          backendDetail.message ||
          backendDetail.msg ||
          JSON.stringify(
            backendDetail
          );
      } else if (
        typeof err?.response?.data ===
        "string"
      ) {
        errorMessage =
          err.response.data;
      } else if (
        err?.message
      ) {
        errorMessage =
          err.message;
      }

      alert(errorMessage);

    } finally {
      setSubmitting(false);
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

  const isLocked =
    report.is_locked;

  return (
    <div className="mx-auto w-full max-w-[1400px] pb-16">

      {/* =====================================================
          DESKTOP
          KEEP DESKTOP LAYOUT
      ===================================================== */}

      <div className="hidden lg:block">

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
                  {isLocked
                    ? "Locked"
                    : "Draft"}
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

        <main className="rounded-3xl border border-gray-200 bg-white">

          <section className="px-5 py-8 sm:px-8 lg:px-10">

            <div className="mb-7">

              <div className="flex items-center gap-3">

                <span className="text-sm font-semibold tracking-wider text-blue-600">
                  01
                </span>

                <h2 className="text-2xl font-bold text-gray-900">
                  Daily Collections
                </h2>

              </div>

              <p className="mt-1 text-sm text-gray-500">
                Record today's cash and digital collections and
                reconcile them with the system sales.
              </p>

            </div>

            <SalesSection
              ref={salesRef}
              report={report}
              refreshReport={loadReport}
            />

          </section>

        </main>

        <section className="mt-8">

          <div className="flex flex-col gap-5 rounded-3xl border border-gray-200 bg-white px-5 py-6 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">

            <div>

              <h2 className="text-xl font-semibold text-gray-900">
                Ready to submit?
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Once submitted, this daily report will be locked.
              </p>

            </div>

            <button
              type="button"
              onClick={handleFinalSubmit}
              disabled={
                isLocked ||
                submitting
              }
              className={`h-12 min-w-[220px] rounded-xl px-8 text-sm font-semibold text-white transition-colors ${
                isLocked ||
                submitting
                  ? "cursor-not-allowed bg-gray-400"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isLocked
                ? "Report Submitted"
                : submitting
                  ? "Saving & Submitting..."
                  : "Save & Submit Report"}
            </button>

          </div>

        </section>

      </div>


      {/* =====================================================
          MOBILE
      ===================================================== */}

      <div className="lg:hidden min-h-screen bg-gray-50 pb-28">

        {/* HEADER */}

        <header className="border-b border-gray-200 bg-white px-5 pb-5 pt-5">

          <div className="flex items-center justify-between gap-3">

            <div className="min-w-0">

              <h1 className="text-[29px] font-bold tracking-tight text-gray-900">
                Daily Report
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Business Date:{" "}
                <span className="font-medium text-blue-600">
                  {selectedDate}
                </span>
              </p>

            </div>

            <span
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                isLocked
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-amber-200 bg-amber-50 text-amber-700"
              }`}
            >
              {isLocked
                ? "Locked"
                : "Draft"}
            </span>

          </div>

        </header>


        {/* MOBILE CONTENT */}

        <main className="space-y-3.5 px-4 pt-4">

          {/* PROGRESS */}

          <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3.5 shadow-sm">

            <div className="flex items-center gap-4">

              <div className="relative h-[58px] w-[58px] shrink-0">

                <svg
                  className="h-[58px] w-[58px] -rotate-90"
                  viewBox="0 0 64 64"
                >

                  <circle
                    cx="32"
                    cy="32"
                    r="27"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="6"
                    className="text-gray-100"
                  />

                  <circle
                    cx="32"
                    cy="32"
                    r="27"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray="169.6"
                    strokeDashoffset={
                      isLocked
                        ? "0"
                        : "127.2"
                    }
                    className="text-blue-600"
                  />

                </svg>

                <div className="absolute inset-0 flex items-center justify-center">

                  <span className="text-xs font-bold text-gray-900">
                    {isLocked
                      ? "100%"
                      : "25%"}
                  </span>

                </div>

              </div>

              <div className="min-w-0 flex-1">

                <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                  Report Progress
                </p>

                <p className="mt-0.5 text-base font-bold text-gray-900">
                  {isLocked
                    ? "4 of 4 sections completed"
                    : "1 of 4 sections"}
                </p>

                <div className="mt-2 flex gap-1.5">

                  {[1, 2, 3, 4].map(
                    (step) => (
                      <div
                        key={step}
                        className={`h-1.5 flex-1 rounded-full ${
                          isLocked ||
                          step === 1
                            ? "bg-blue-600"
                            : "bg-gray-200"
                        }`}
                      />
                    )
                  )}

                </div>

              </div>

            </div>

          </div>


          {/* MOBILE DAILY REPORT */}

          <SalesSection
            ref={salesRef}
            report={report}
            refreshReport={loadReport}
            mobile
          />


          {/* FINAL SUBMIT */}

          <button
            type="button"
            onClick={handleFinalSubmit}
            disabled={
              isLocked ||
              submitting
            }
            className={`mt-1 flex h-12 w-full items-center justify-center rounded-xl text-sm font-semibold text-white shadow-sm ${
              isLocked ||
              submitting
                ? "cursor-not-allowed bg-gray-400"
                : "bg-blue-600 active:scale-[0.99]"
            }`}
          >
            {isLocked
              ? "Report Submitted"
              : submitting
                ? "Saving & Submitting..."
                : "Save & Submit Report"}
          </button>

        </main>

      </div>

    </div>
  );
}