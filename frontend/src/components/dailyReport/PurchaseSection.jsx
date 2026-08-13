import { Eye, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import SectionCard from "./SectionCard";
import dailyReportsService from "../../services/dailyReportsService";

export default function PurchaseSection({
  report,
  refreshReport,
}) {
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    if (!report?.id) {
      setPurchases([]);
      return;
    }

    async function loadPurchases() {
      try {
        const data =
          await dailyReportsService.getPurchases(
            report.id
          );

        setPurchases(
          Array.isArray(data)
            ? data
            : []
        );
      } catch (err) {
        console.error(
          "Failed to load purchases:",
          err
        );

        setPurchases([]);
      }
    }

    loadPurchases();
  }, [report?.id]);

  /*
   * IMPORTANT:
   *
   * The Daily Report should only show the
   * monetary value of purchases that are
   * currently in RECEIVED status.
   *
   * Completed purchases are deliberately
   * excluded from this amount.
   */
  const receivedPurchases =
    purchases.filter(
      (purchase) =>
        String(
          purchase.status || ""
        ).toLowerCase() === "received"
    );

  const totalReceived =
    receivedPurchases.reduce(
      (sum, purchase) =>
        sum +
        Number(
          purchase.purchase_amount || 0
        ),
      0
    );

  if (!report) {
    return null;
  }

  return (
    <SectionCard title="Purchases">

      <div className="space-y-5">

        {/* Header */}

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">

              <Package
                size={18}
                className="text-blue-600"
              />

            </div>

            <div>

              <h3 className="font-semibold">
                Purchases
              </h3>

              <p className="text-sm text-gray-500">
                Total value of purchases received for this report.
              </p>

            </div>

          </div>

          <Link
            to={`/manager-purchases?report=${report.id}`}
            className="flex h-10 items-center gap-2 rounded-xl border border-gray-200 px-4 hover:bg-gray-50"
          >
            <Eye size={17} />
            View Purchases
          </Link>

        </div>

        {/* Received Purchase Amount */}

        <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">

          <p className="text-sm font-medium text-blue-700">
            Purchases Received
          </p>

          <h2 className="mt-2 text-3xl font-bold text-blue-600">
            ₹
            {totalReceived.toLocaleString(
              "en-IN"
            )}
          </h2>

          <p className="mt-2 text-sm text-blue-700/70">
            Only purchases with status "Received" are included.
          </p>

        </div>

      </div>

    </SectionCard>
  );
}