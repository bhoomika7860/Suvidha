import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Circle,
  Clock3,
} from "lucide-react";
import api from "../../api/api";
import dailyReportsService from "../../services/dailyReportsService";

export default function ReportProgress() {
  const [report, setReport] = useState(null);

const [expensesCompleted, setExpensesCompleted] =
  useState(false);

const [purchasesCompleted, setPurchasesCompleted] =
  useState(false);


useEffect(() => {
  async function load() {
    try {
      const data =
        await dailyReportsService.getTodayReport();

      setReport(data);

      const expenses =
        await dailyReportsService.getExpenses(
          data.id
        );

      setExpensesCompleted(
        expenses.length > 0
      );

      const purchases =
        await dailyReportsService.getPurchases(
          data.id
        );

      setPurchasesCompleted(
        purchases.length > 0
      );

     

     
    } catch (err) {
      console.error(err);
    }
  }

  load();
}, []);

  if (!report) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        Loading...
      </div>
    );
  }

  console.log("TOTAL EXPENSES =", report.total_expenses);
console.log(report);

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
      status: salesCompleted
        ? "done"
        : "todo",
    },
    {
      title: "Expenses",
      status: expensesCompleted
        ? "done"
        : "todo",
    },
    {
      title: "Purchases",
      status: purchasesCompleted
        ? "done"
        : "todo",
    },
    {
      title: "Deliveries",
      status: deliveriesCompleted
        ? "done"
        : "todo",
    },
    
  ];

  const completed = sections.filter(
    (section) => section.status === "done"
  ).length;

  const percentage =
    (completed / sections.length) * 100;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

      <div className="mb-4 flex items-center justify-between">

        <div>

          <h2 className="text-lg font-semibold text-gray-900">
            Report Progress
          </h2>

          <p className="mt-0.5 text-sm text-gray-500">
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

      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">

        <div
          className="h-full rounded-full bg-blue-600 transition-all"
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>

      <div className="mt-5 flex flex-wrap gap-3">

        {sections.map((section) => {

          const isDone =
            section.status === "done";

          const isPending =
            section.status === "pending";

          return (
            <div
              key={section.title}
              className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium ${
                isDone
                  ? "border-green-200 bg-green-50 text-green-700"
                  : isPending
                  ? "border-orange-200 bg-orange-50 text-orange-700"
                  : "border-gray-200 bg-gray-50 text-gray-500"
              }`}
            >

              {isDone ? (
                <CheckCircle2 size={15} />
              ) : isPending ? (
                <Clock3 size={15} />
              ) : (
                <Circle size={15} />
              )}

              {section.title}

            </div>
          );
        })}

      </div>

    </div>
  );
}