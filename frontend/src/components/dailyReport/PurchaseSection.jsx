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
   * A purchase belongs to today's
   * purchase amount when ANY ONE of
   * these workflow events happened
   * on the selected business date:
   *
   * 1. Received today
   * 2. Sent for system entry today
   * 3. Completed today
   *
   * The purchase is included only once,
   * even if multiple events happened today.
   */
  const purchasesToday =
    purchases.filter(
      (purchase) => {
        const receivedDate =
          getIndiaBusinessDate(
            purchase.received_date
          );

        const sentForEntryDate =
          getIndiaBusinessDate(
            purchase.sent_for_entry_at
          );

        const completedDate =
          getIndiaBusinessDate(
            purchase.completed_at
          );

        return (
          receivedDate === reportDate ||
          sentForEntryDate === reportDate ||
          completedDate === reportDate
        );
      }
    );

  /*
   * Calculate the total purchase amount
   * for the selected business date.
   *
   * Each purchase appears only once in
   * purchasesToday, so its amount cannot
   * be counted multiple times.
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
              Purchase bills processed today.
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
            Includes bills received, sent for
            entry, or completed on{" "}
            {reportDate}.
          </p>

        </div>

      </div>

    </SectionCard>
  );
}