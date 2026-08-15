import { Package } from "lucide-react";
import { useEffect, useState } from "react";

import SectionCard from "./SectionCard";
import dailyReportsService from "../../services/dailyReportsService";

export default function PurchaseSection({
  report,
}) {
  const [purchases, setPurchases] =
    useState([]);

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
   * Only RECEIVED purchases belonging to
   * this report are included.
   *
   * No purchase history is displayed.
   * No supplier information is displayed.
   * No bill information is displayed.
   * No purchase table is displayed.
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

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100">

            <Package
              size={19}
              className="text-blue-600"
            />

          </div>

          <div>

            <h3 className="text-base font-semibold text-gray-900">
              Purchases Received Today
            </h3>

            <p className="text-sm text-gray-500">
              Only purchases received for this business date are included.
            </p>

          </div>

        </div>


        <div className="max-w-[560px] rounded-2xl border border-blue-200 bg-blue-50 p-6">

          <p className="text-sm font-medium text-blue-700">
            Purchase Received Today
          </p>

          <h2 className="mt-2 text-3xl font-bold text-blue-600">
            ₹
            {totalReceived.toLocaleString(
              "en-IN"
            )}
          </h2>

        </div>

      </div>

    </SectionCard>
  );
}