import { useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Lock,
} from "lucide-react";
import dailyReportsService from "../../services/dailyReportsService";

export default function ReviewSection() {
  const [report, setReport] = useState(null);

  useEffect(() => {
    async function load() {
      const data =
        await dailyReportsService.getTodayReport();

      setReport(data);
    }

    load();
  }, []);

  if (!report) return null;

  const completed = [];
  const remaining = [];

  function addSection(name, done) {
    if (done) completed.push(name);
    else remaining.push(name);
  }

  addSection(
    "Sales",
    report.cash_sales +
      report.upi_sales +
      report.card_sales +
      report.udhaar_sales >
      0
  );

  addSection(
    "Expenses",
    report.total_expenses > 0
  );

  addSection(
    "Purchases",
    report.total_purchases > 0
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

      const updated =
        await dailyReportsService.getTodayReport();

      setReport(updated);

    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-xl font-semibold">
            Review & Submit
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Verify today's report before final submission.
          </p>

        </div>

        <div className="flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-4 py-2 text-sm font-medium">

          <Lock size={15} />

          Report will lock after submission

        </div>

      </div>

      <div className="grid grid-cols-2 gap-5 mt-6">

        <div className="rounded-2xl border border-green-200 bg-green-50 p-5">

          <div className="flex items-center gap-2 mb-4">

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

          <div className="flex items-center gap-2 mb-4">

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
            : "Complete all pending sections to enable report submission."}

        </p>

        <div className="flex gap-3">

          <button
            className="h-11 px-6 rounded-xl border border-gray-200"
          >
            Save Draft
          </button>

          <button
            disabled={
              remaining.length > 0 ||
              report.is_locked
            }
            onClick={submitReport}
            className={`w-60 h-11 rounded-xl font-semibold text-white ${
              remaining.length > 0 ||
              report.is_locked
                ? "bg-gray-400 cursor-not-allowed"
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