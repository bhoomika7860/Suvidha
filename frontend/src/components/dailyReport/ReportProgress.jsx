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
    if (!report?.id) return;

    async function loadProgress() {
      try {
        const expenses =
          await dailyReportsService.getExpenses(
            report.id
          );

        const purchases =
          await dailyReportsService.getPurchases(
            report.id
          );

        setExpensesCompleted(
          expenses.length > 0
        );

        setPurchasesCompleted(
          purchases.length > 0
        );
      } catch (err) {
        console.error(
          "Failed to load report progress:",
          err
        );
      }
    }

    loadProgress();
  }, [report?.id]);

  if (!report) return null;

  const salesCompleted =
    Number(report.total_bills || 0) > 0 ||
    Number(report.cash_sales || 0) > 0 ||
    Number(report.upi_sales || 0) > 0 ||
    Number(report.card_sales || 0) > 0;

  const deliveriesCompleted =
    Number(report.deliveries || 0) > 0;

  /*
   * Expenses and Purchases are OPTIONAL.
   *
   * They are deliberately not included in the
   * required completion percentage.
   */
  const requiredSections = [
    {
      title: "Sales",
      status: salesCompleted,
    },
    {
      title: "Deliveries",
      status: deliveriesCompleted,
    },
  ];

  const optionalSections = [
    {
      title: "Expenses",
      status: expensesCompleted,
    },
    {
      title: "Purchases",
      status: purchasesCompleted,
    },
  ];

  const completedRequired =
    requiredSections.filter(
      (section) => section.status
    ).length;

  const percentage =
    (completedRequired /
      requiredSections.length) *
    100;

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            Report Progress
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {completedRequired} of{" "}
            {requiredSections.length} required sections completed
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

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-blue-600 transition-all"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>

      {/* Required sections */}

      <div className="mt-5 flex flex-wrap gap-3">
        {requiredSections.map(
          (section) => (
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
          )
        )}

        {/* Optional sections */}

        {optionalSections.map(
          (section) => (
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

              <span className="text-xs font-normal opacity-70">
                Optional
              </span>
            </div>
          )
        )}
      </div>
    </div>
  );
}