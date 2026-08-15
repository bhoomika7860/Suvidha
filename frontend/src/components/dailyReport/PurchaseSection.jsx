import { Package } from "lucide-react";
import { useEffect, useState } from "react";

import SectionCard from "./SectionCard";
import dailyReportsService from "../../services/dailyReportsService";

/*
 * Convert a server timestamp into the Indian
 * business date (YYYY-MM-DD).
 *
 * Purchase timestamps coming from the backend
 * are UTC timestamps.
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

  /*
   * The report's business date is the date
   * we need to compare against.
   */
  const reportDate =
    report.report_date ||
    report.date;

  /*
   * ONLY purchases that:
   *
   * 1. Have status "received"
   * 2. Were received on THIS business date
   *
   * Older received purchases are excluded.
   */
  const receivedToday =
    purchases.filter(
      (purchase) => {
        const status =
          String(
            purchase.status || ""
          ).toLowerCase();

        if (
          status !== "received"
        ) {
          return false;
        }

        /*
         * received_date is the authoritative
         * date for this Daily Report.
         */
        const receivedDate =
          getIndiaBusinessDate(
            purchase.received_date
          );

        return (
          receivedDate ===
          reportDate
        );
      }
    );

  /*
   * Calculate ONLY today's received
   * purchase amount.
   */
  const totalReceivedToday =
    receivedToday.reduce(
      (
        sum,
        purchase
      ) =>
        sum +
        Number(
          purchase.purchase_amount ||
            0
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


        {/* TODAY'S RECEIVED PURCHASE AMOUNT */}

        <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">

          <p className="text-sm font-medium text-blue-700">
            Purchases Received Today
          </p>

          <h2 className="mt-2 text-3xl font-bold text-blue-600">

            ₹
            {totalReceivedToday.toLocaleString(
              "en-IN"
            )}

          </h2>

          <p className="mt-2 text-sm text-blue-700/70">

            Only bills received on{" "}
            {reportDate} are included.

          </p>

        </div>

      </div>

    </SectionCard>
  );
}