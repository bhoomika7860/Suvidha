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

  const [searchParams] =
    useSearchParams();

  const reportIdFromUrl =
    searchParams.get("report");

  useEffect(() => {
    loadData();
  }, [reportIdFromUrl]);

  async function loadData() {
    try {
      let currentReport;

      if (reportIdFromUrl) {
        currentReport =
          await dailyReportsService.getReport(
            Number(reportIdFromUrl)
          );
      } else {
        currentReport =
          await dailyReportsService.getTodayReport();
      }

      setReport(currentReport);

      const purchaseData =
        await dailyReportsService.getPurchases(
          currentReport.id
        );

      setPurchases(purchaseData);

    } catch (err) {
      console.error(
        "Failed to load purchases:",
        err
      );
    }
  }

  async function addPurchase(purchase) {
    if (!report?.id) {
      console.error(
        "Cannot create purchase without report ID."
      );
      return;
    }

    try {
      await purchaseService.createPurchase({
        ...purchase,
        daily_report_id: report.id,
      });

      await loadData();

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