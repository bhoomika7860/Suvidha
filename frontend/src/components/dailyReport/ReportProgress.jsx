import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Circle,
} from "lucide-react";
import dailyReportsService from "../../services/dailyReportsService";

export default function ReportProgress({
  report,
}) {
  const [expensesCompleted, setExpensesCompleted] =
    useState(false);

  const [purchasesCompleted, setPurchasesCompleted] =
    useState(false);

  useEffect(() => {
    if (!report) return;

    async function loadProgress() {
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

    loadProgress();
  }, [report]);

  if (!report) return null;

  const salesCompleted =
    report.total_bills > 0 ||
    report.cash_sales > 0 ||
    report.upi_sales > 0 ||
    report.card_sales > 0;

  const deliveriesCompleted =
    report.deliveries > 0;

  const sections = [
    {
      title: "Sales",
      status: salesCompleted,
    },
    {
      title: "Expenses",
      status: expensesCompleted,
    },
    {
      title: "Purchases",
      status: purchasesCompleted,
    },
    {
      title: "Deliveries",
      status: deliveriesCompleted,
    },
  ];

  const completed = sections.filter(
    (s) => s.status
  ).length;

  const percentage =
    (completed / sections.length) * 100;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

      <div className="mb-4 flex items-center justify-between">

        <div>
          <h2 className="text-lg font-semibold">
            Report Progress
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {completed} of {sections.length} sections completed
          </p>
        </div>

        <span
          className={`rounded-full border px-3 py-1 text-xs font-medium ${
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

      <div className="h-2 overflow-hidden rounded-full bg-gray-200">

        <div
          className="h-full rounded-full bg-blue-600 transition-all"
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>

      <div className="mt-5 flex flex-wrap gap-3">

        {sections.map((section) => (

          <div
            key={section.title}
            className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium ${
              section.status
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-gray-200 bg-gray-50 text-gray-500"
            }`}
          >

            {section.status ? (
              <CheckCircle2 size={15} />
            ) : (
              <Circle size={15} />
            )}

            {section.title}

          </div>

        ))}

      </div>

    </div>
  );
}