import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import purchaseService from "../../services/purchaseService";
import dailyReportsService from "../../services/dailyReportsService";

import PurchaseStats from "../../components/purchases/PurchaseStats";
import PurchaseToolbar from "../../components/purchases/PurchaseToolbar";
import PurchaseTable from "../../components/purchases/PurchaseTable";
import ReceiveBillModal from "../../components/purchases/ReceiveBillModal";

export default function Purchases() {
  const [search, setSearch] = useState("");

  const [activeFilter, setActiveFilter] =
    useState("received");

  const [showReceiveModal, setShowReceiveModal] =
    useState(false);

  const [purchases, setPurchases] =
    useState([]);

  const [report, setReport] =
    useState(null);

  const [searchParams] = useSearchParams();

  useEffect(() => {
    initializePage();
  }, []);

  async function initializePage() {
    try {
      /*
       * If we came from a specific Daily Report,
       * use that report.
       *
       * Otherwise use today's report.
       */
      let reportId = searchParams.get("report");

      if (reportId) {
        const selectedReport =
          await dailyReportsService.getReport(
            Number(reportId)
          );

        setReport(selectedReport);

        await loadPurchases(Number(reportId));

        return;
      }

      /*
       * Normal Purchases page:
       * use today's report.
       */
      const todayReport =
        await dailyReportsService.getTodayReport();

      setReport(todayReport);

      await loadPurchases(todayReport.id);

    } catch (err) {
      console.error(err);

      console.log(
        "Status:",
        err.response?.status
      );

      console.log(
        "Backend response:",
        err.response?.data
      );
    }
  }

  async function loadPurchases(reportId) {
    try {
      const purchaseData =
        await dailyReportsService.getPurchases(
          reportId
        );

      setPurchases(purchaseData);

    } catch (err) {
      console.error(err);

      console.log(
        "Status:",
        err.response?.status
      );

      console.log(
        "Backend response:",
        err.response?.data
      );
    }
  }

  async function addPurchase(purchase) {
    try {
      if (!report) {
        console.error(
          "No daily report selected."
        );
        return;
      }

      await purchaseService.createPurchase({
        ...purchase,

        /*
         * IMPORTANT:
         * This is the selected report,
         * not automatically today's report.
         */
        daily_report_id: report.id,
      });

      await loadPurchases(report.id);

      setShowReceiveModal(false);

    } catch (err) {
      console.error(err);

      console.log(
        "Status:",
        err.response?.status
      );

      console.log(
        "Backend response:",
        err.response?.data
      );
    }
  }

  const filteredPurchases =
    purchases.filter((purchase) => {
      const matchesSearch =
        (purchase.supplier_name || "")
          .toLowerCase()
          .includes(search.toLowerCase()) ||

        (purchase.bill_number || "")
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        purchase.status === activeFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });

  return (
    <div>

      <div>
        <h1 className="text-3xl font-bold">
          Purchase Workflow
        </h1>

        <p className="mt-1 text-gray-500">
          Manage supplier purchase bills.
        </p>
      </div>

      <PurchaseStats
        purchases={purchases}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />

      <PurchaseToolbar
        search={search}
        setSearch={setSearch}
        onReceiveBill={() =>
          setShowReceiveModal(true)
        }
      />

      <PurchaseTable
        purchases={filteredPurchases}
        allPurchases={purchases}
        setPurchases={setPurchases}
      />

      {report && (
        <ReceiveBillModal
          isOpen={showReceiveModal}

          onClose={() =>
            setShowReceiveModal(false)
          }

          onSave={addPurchase}

          reportId={report.id}
        />
      )}

    </div>
  );
}