import { Package } from "lucide-react";
import { useEffect, useState } from "react";

import SectionCard from "./SectionCard";
import dailyReportsService from "../../services/dailyReportsService";

/*
 * Convert a server timestamp into the Indian
 * business date (YYYY-MM-DD).
 */
function getIndiaBusinessDate(value) {
  if (!value) {
    return null;
  }

  try {
    return new Intl.DateTimeFormat(
      "en-CA",
      {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }
    ).format(new Date(value));
  } catch (err) {
    console.error(
      "Failed to convert purchase date:",
      err
    );

    return null;
  }
}

export default function PurchaseSection({
  report,
  refreshReport,
}) {
  const [purchases, setPurchases] =
    useState([]);

  useEffect(() => {
    if (!report?.id) {
      setPurchases([]);
      return;
    }

    let cancelled = false;

    async function loadPurchases() {
      try {
        const data =
          await dailyReportsService.getPurchases(
            report.id
          );

        if (cancelled) {
          return;
        }

        setPurchases(
          Array.isArray(data)
            ? data
            : []
        );
      } catch (err) {
        if (!cancelled) {
          console.error(
            "Failed to load purchases:",
            err
          );

          setPurchases([]);
        }
      }
    }

    loadPurchases();

    return () => {
      cancelled = true;
    };
  }, [report?.id]);

  if (!report) {
    return null;
  }

  const reportDate =
    report.report_date ||
    report.date;

  /*
   * Only purchases RECEIVED on the
   * selected business date are included.
   *
   * The current workflow status does not matter.
   *
   * Example:
   *
   * Received: 21 Aug
   * Status: Received
   * -> Included
   *
   * Received: 21 Aug
   * Status: Waiting Entry
   * -> Included
   *
   * Received: 21 Aug
   * Status: Completed
   * -> Included
   *
   * Received: 18 Aug
   * Status: Waiting Entry
   * -> Not included
   *
   * Received: 18 Aug
   * Status: Completed on 21 Aug
   * -> Not included
   */
  const purchasesToday =
    purchases.filter(
      (purchase) => {
        const receivedDate =
          getIndiaBusinessDate(
            purchase.received_date
          );

        return (
          receivedDate === reportDate
        );
      }
    );

  /*
   * Calculate the total purchase amount
   * for the selected business date.
   *
   * Each purchase is included only once.
   */
  const totalPurchaseToday =
    purchasesToday.reduce(
      (
        sum,
        purchase
      ) =>
        sum +
        Number(
          purchase.purchase_amount || 0
        ),
      0
    );

  return (
    <SectionCard title="Purchases">

      <div className="space-y-5">

        {/* HEADER */}

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">

            <Package
              size={18}
              className="text-blue-600"
            />

          </div>

          <div>

            <h3 className="text-base font-semibold text-gray-900">
              Purchases
            </h3>

            <p className="text-sm text-gray-500">
              Purchase bills received today.
            </p>

          </div>

        </div>


        {/* TODAY'S PURCHASE AMOUNT */}

        <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">

          <p className="text-sm font-medium text-blue-700">
            Purchases Today
          </p>

          <h2 className="mt-2 text-3xl font-bold text-blue-600">
            ₹
            {totalPurchaseToday.toLocaleString(
              "en-IN"
            )}
          </h2>

          <p className="mt-2 text-sm text-blue-700/70">
            Includes all bills received on{" "}
            {reportDate}, regardless of their
            current workflow status.
          </p>

        </div>

      </div>

    </SectionCard>
  );
}