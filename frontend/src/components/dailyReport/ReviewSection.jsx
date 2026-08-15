import {
  useEffect,
  useState,
} from "react";

import {
  CheckCircle2,
  Circle,
  Lock,
} from "lucide-react";

import dailyReportsService from "../../services/dailyReportsService";

export default function ReviewSection({
  report,
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
    Number(
      report.total_bills || 0
    ) > 0 ||
      Number(
        report.cash_sales || 0
      ) > 0 ||
      Number(
        report.upi_sales || 0
      ) > 0 ||
      Number(
        report.card_sales || 0
      ) > 0 ||
      Number(
        report.udhaar_sales || 0
      ) > 0
  );

  addRequiredSection(
    "Deliveries",
    Number(
      report.deliveries || 0
    ) > 0
  );

  if (expensesCompleted) {
    completed.push(
      "Expenses"
    );
  } else {
    optional.push(
      "Expenses"
    );
  }

  if (purchasesCompleted) {
    completed.push(
      "Purchases"
    );
  } else {
    optional.push(
      "Purchases"
    );
  }

  return (
    <div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <h2 className="text-2xl font-bold text-gray-900">
            Review
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Review the report before the final submission.
          </p>

        </div>

        <div className="flex w-fit items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">

          <Lock size={15} />

          Report will lock after submission

        </div>

      </div>


      <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-3">

        {/* COMPLETED */}

        <div className="rounded-2xl border border-green-200 bg-green-50 p-5">

          <div className="mb-4 flex items-center gap-2">

            <CheckCircle2
              size={20}
              className="text-green-600"
            />

            <h3 className="text-base font-semibold text-green-700">
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
                  <li
                    key={item}
                    className="text-green-700"
                  >
                    ✓ {item}
                  </li>
                )
              )

            )}

          </ul>

        </div>


        {/* REQUIRED */}

        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">

          <div className="mb-4 flex items-center gap-2">

            <Circle
              size={20}
              className="text-gray-500"
            />

            <h3 className="text-base font-semibold text-gray-700">
              Required ({remaining.length})
            </h3>

          </div>

          <ul className="space-y-2 text-sm">

            {remaining.length === 0 ? (

              <li className="text-gray-600">
                All required sections completed.
              </li>

            ) : (

              remaining.map(
                (item) => (
                  <li
                    key={item}
                    className="text-gray-600"
                  >
                    • {item}
                  </li>
                )
              )

            )}

          </ul>

        </div>


        {/* OPTIONAL */}

        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">

          <div className="mb-4 flex items-center gap-2">

            <Circle
              size={20}
              className="text-blue-500"
            />

            <h3 className="text-base font-semibold text-blue-700">
              Optional ({optional.length})
            </h3>

          </div>

          <ul className="space-y-2 text-sm text-blue-700">

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


      <div className="mt-7 rounded-2xl border border-gray-200 bg-white p-5">

        <p className="text-sm text-gray-500">

          {remaining.length === 0
            ? "All required sections are ready. Use the single Save & Submit Report button below to submit the complete report."
            : "Complete all required sections before submitting the report."}

        </p>

      </div>

    </div>
  );
}