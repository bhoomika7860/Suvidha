import { useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Lock,
} from "lucide-react";

import dailyReportsService from "../../services/dailyReportsService";

export default function ReviewSection({
  report,
  refreshReport,
}) {
  const [expensesCompleted, setExpensesCompleted] =
    useState(false);

  const [purchasesCompleted, setPurchasesCompleted] =
    useState(false);

  useEffect(() => {
    if (!report) return;

    async function loadReview() {
      try {
        const expenses =
          await dailyReportsService.getExpenses(
            report.id
          );

        setExpensesCompleted(
          expenses.length > 0
        );

        const purchases =
          await dailyReportsService.getPurchases(
            report.id
          );

        setPurchasesCompleted(
          purchases.length > 0
        );
      } catch (err) {
        console.error(err);
      }
    }

    loadReview();
  }, [report]);

  if (!report) return null;

  const completed = [];
  const remaining = [];

  function addSection(name, done) {
    if (done) {
      completed.push(name);
    } else {
      remaining.push(name);
    }
  }

  addSection(
    "Sales",
    report.total_bills > 0 ||
      report.cash_sales > 0 ||
      report.upi_sales > 0 ||
      report.card_sales > 0
  );

  addSection(
    "Expenses",
    expensesCompleted
  );

  addSection(
    "Purchases",
    purchasesCompleted
  );

  addSection(
    "Deliveries",
    report.deliveries > 0
  );

  async function submitReport() {
    if (remaining.length > 0) {
      alert(
        "Complete all sections before submitting."
      );
      return;
    }

    try {
      await dailyReportsService.submitReport(
        report.id
      );

      alert(
        "Daily report submitted successfully."
      );

      await refreshReport();

    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-xl font-semibold">
            Review & Submit
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Verify this report before submission.
          </p>

        </div>

        <div className="flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">

          <Lock size={15} />

          Report will lock after submission

        </div>

      </div>

      <div className="mt-6 grid grid-cols-2 gap-5">

        <div className="rounded-2xl border border-green-200 bg-green-50 p-5">

          <div className="mb-4 flex items-center gap-2">

            <CheckCircle2
              size={20}
              className="text-green-600"
            />

            <h3 className="font-semibold text-green-700">
              Completed ({completed.length})
            </h3>

          </div>

          <ul className="space-y-2 text-sm">

            {completed.map((item) => (

              <li key={item}>
                ✓ {item}
              </li>

            ))}

          </ul>

        </div>

        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5">

          <div className="mb-4 flex items-center gap-2">

            <AlertCircle
              size={20}
              className="text-orange-600"
            />

            <h3 className="font-semibold text-orange-700">
              Remaining ({remaining.length})
            </h3>

          </div>

          <ul className="space-y-2 text-sm">

            {remaining.map((item) => (

              <li key={item}>
                • {item}
              </li>

            ))}

          </ul>

        </div>

      </div>

      <div className="mt-8 flex items-center justify-between border-t pt-5">

        <p className="text-sm text-gray-500">

          {remaining.length === 0
            ? "Report is ready for submission."
            : "Complete all pending sections before submitting."}

        </p>

        <div className="flex gap-3">

          <button className="h-11 rounded-xl border border-gray-200 px-6">
            Save Draft
          </button>

          <button
            disabled={
              remaining.length > 0 ||
              report.is_locked
            }
            onClick={submitReport}
            className={`h-11 w-60 rounded-xl font-semibold text-white ${
              remaining.length > 0 ||
              report.is_locked
                ? "cursor-not-allowed bg-gray-400"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {report.is_locked
              ? "Report Submitted"
              : "Submit Daily Report"}
          </button>

        </div>

      </div>

    </div>
  );
}