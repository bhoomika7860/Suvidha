import {
  useEffect,
  useState,
} from "react";

import {
  AlertCircle,
  CheckCircle2,
  Circle,
  Lock,
} from "lucide-react";

import dailyReportsService from "../../services/dailyReportsService";

export default function ReviewSection({
  report,
  refreshReport,
}) {
  const [
    expensesCompleted,
    setExpensesCompleted,
  ] = useState(false);

  const [
    purchasesCompleted,
    setPurchasesCompleted,
  ] = useState(false);

  useEffect(() => {
    if (!report?.id) {
      return;
    }

    async function loadReview() {
      try {
        const [
          expenses,
          purchases,
        ] = await Promise.all([
          dailyReportsService.getExpenses(
            report.id
          ),

          dailyReportsService.getPurchases(
            report.id
          ),
        ]);

        setExpensesCompleted(
          Array.isArray(expenses) &&
            expenses.length > 0
        );

        setPurchasesCompleted(
          Array.isArray(purchases) &&
            purchases.length > 0
        );

      } catch (err) {
        console.error(
          "Failed to load review:",
          err
        );
      }
    }

    loadReview();
  }, [report?.id]);

  if (!report) {
    return null;
  }

  const completed = [];
  const remaining = [];
  const optional = [];

  function addRequiredSection(
    name,
    done
  ) {
    if (done) {
      completed.push(name);
    } else {
      remaining.push(name);
    }
  }

  addRequiredSection(
    "Sales",
    Number(report.total_bills || 0) > 0 ||
      Number(report.cash_sales || 0) > 0 ||
      Number(report.upi_sales || 0) > 0 ||
      Number(report.card_sales || 0) > 0 ||
      Number(report.udhaar_sales || 0) > 0
  );

  addRequiredSection(
    "Deliveries",
    Number(report.deliveries || 0) > 0
  );

  if (expensesCompleted) {
    completed.push("Expenses");
  } else {
    optional.push("Expenses");
  }

  if (purchasesCompleted) {
    completed.push("Purchases");
  } else {
    optional.push("Purchases");
  }

  async function submitReport() {
    if (report.is_locked) {
      return;
    }

    if (remaining.length > 0) {
      alert(
        "Complete all required sections before submitting."
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
      console.error(
        "Failed to submit report:",
        err
      );

      alert(
        err.response?.data?.detail ||
          "Failed to submit daily report."
      );
    }
  }

  return (
    <div>

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

      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">

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

            {completed.length === 0 ? (

              <li className="text-green-700/70">
                No sections completed yet.
              </li>

            ) : (

              completed.map(
                (item) => (
                  <li key={item}>
                    ✓ {item}
                  </li>
                )
              )

            )}

          </ul>

        </div>

        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5">

          <div className="mb-4 flex items-center gap-2">

            <AlertCircle
              size={20}
              className="text-orange-600"
            />

            <h3 className="font-semibold text-orange-700">
              Required ({remaining.length})
            </h3>

          </div>

          <ul className="space-y-2 text-sm">

            {remaining.length === 0 ? (

              <li className="text-orange-700/70">
                All required sections completed.
              </li>

            ) : (

              remaining.map(
                (item) => (
                  <li key={item}>
                    • {item}
                  </li>
                )
              )

            )}

          </ul>

        </div>

        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">

          <div className="mb-4 flex items-center gap-2">

            <Circle
              size={20}
              className="text-gray-500"
            />

            <h3 className="font-semibold text-gray-700">
              Optional ({optional.length})
            </h3>

          </div>

          <ul className="space-y-2 text-sm text-gray-600">

            {optional.length === 0 ? (

              <li>
                All optional sections have entries.
              </li>

            ) : (

              optional.map(
                (item) => (
                  <li key={item}>
                    • {item} — optional
                  </li>
                )
              )

            )}

          </ul>

        </div>

      </div>

      <div className="mt-8 flex items-center justify-between border-t pt-5">

        <p className="text-sm text-gray-500">

          {remaining.length === 0
            ? "Report is ready for submission."
            : "Complete all required sections before submitting."}

        </p>

        <div className="flex gap-3">

          <button
            type="button"
            disabled
            className="h-11 cursor-not-allowed rounded-xl border border-gray-200 px-6 text-gray-400"
          >
            Save Draft
          </button>

          <button
            type="button"
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