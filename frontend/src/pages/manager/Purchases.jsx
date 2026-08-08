import { useEffect, useState } from "react";

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

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      /*
       * We still need today's report because a newly
       * received purchase must be attached to today's
       * daily report.
       */
      const currentReport =
        await dailyReportsService.getTodayReport();

      setReport(currentReport);

      /*
       * IMPORTANT:
       *
       * Do NOT use getTodayPurchases() here.
       *
       * That endpoint only returns purchases created today.
       *
       * We want the complete purchase workflow for
       * this store, including purchases from previous days.
       */
      const purchaseData =
        await purchaseService.getStorePurchases(
          currentReport.store_id
        );

      setPurchases(purchaseData);

    } catch (err) {
      console.error("Failed to load purchases:", err);
    }
  }

  async function addPurchase(purchase) {
    try {
      await purchaseService.createPurchase({
        ...purchase,

        /*
         * New purchases still belong to today's
         * daily report.
         */
        daily_report_id: report.id,
      });

      /*
       * Reload the complete store purchase list
       * after receiving a new bill.
       */
      await loadData();

      setShowReceiveModal(false);

    } catch (err) {
      console.error("Failed to create purchase:", err);
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
    <div className="space-y-6">

      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold">
          Purchase Workflow
        </h1>

        <p className="mt-1 text-gray-500">
          Manage supplier purchase bills.
        </p>
      </div>


      {/* Statistics */}

      <PurchaseStats
        purchases={purchases}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />


      {/* Toolbar */}

      <PurchaseToolbar
        search={search}
        setSearch={setSearch}
        onReceiveBill={() =>
          setShowReceiveModal(true)
        }
      />


      {/* Purchase Table */}

      <PurchaseTable
        purchases={filteredPurchases}
        allPurchases={purchases}
        setPurchases={setPurchases}
      />


      {/* Receive New Bill */}

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