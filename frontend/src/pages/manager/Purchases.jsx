import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import purchaseService from "../../services/purchaseService";
import dailyReportsService from "../../services/dailyReportsService";

import { useBusinessDate } from "../../contexts/BusinessDateContext";

import PurchaseStats from "../../components/purchases/PurchaseStats";
import PurchaseToolbar from "../../components/purchases/PurchaseToolbar";
import PurchaseTable from "../../components/purchases/PurchaseTable";
import ReceiveBillModal from "../../components/purchases/ReceiveBillModal";

import ReceiveBillSheet from "../../components/staff/purchases/ReceiveBillSheet";

export default function Purchases({
  isStaff = false,
}) {
  const { selectedDate } = useBusinessDate();

  const [searchParams] = useSearchParams();

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
    initializePage();
  }, [selectedDate, searchParams]);

  async function initializePage() {
    try {
      setReport(null);
      setPurchases([]);

      const reportParam =
        searchParams.get("report");

      let selectedReport;

      if (reportParam) {
        selectedReport =
          await dailyReportsService.getReport(
            Number(reportParam)
          );
      } else {
        selectedReport =
          await dailyReportsService.getOrCreateReport(
            selectedDate
          );
      }

      setReport(selectedReport);

      await loadPurchases(
        selectedReport.id
      );

    } catch (err) {
      console.error(
        "Failed to initialize purchases:",
        err
      );

      console.error(
        "Status:",
        err.response?.status
      );

      console.error(
        "Backend response:",
        err.response?.data
      );

      setReport(null);
      setPurchases([]);
    }
  }

  async function loadPurchases(reportId) {
    if (!reportId) {
      return;
    }

    try {
      const purchaseData =
        await dailyReportsService.getPurchases(
          Number(reportId)
        );

      setPurchases(
        Array.isArray(purchaseData)
          ? purchaseData
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

  async function addPurchase(purchase) {
    if (!report) {
      console.error(
        "No daily report selected."
      );

      return;
    }

    try {
      await purchaseService.createPurchase({
        ...purchase,
        daily_report_id: report.id,
      });

      await loadPurchases(
        report.id
      );

      setShowReceiveModal(false);

    } catch (err) {
      console.error(
        "Failed to add purchase:",
        err
      );

      alert(
        err.response?.data?.detail ||
          "Failed to add purchase."
      );
    }
  }

  const filteredPurchases =
    purchases.filter(
      (purchase) => {

        const searchValue =
          search.toLowerCase();

        const matchesSearch =
          (
            purchase.supplier_name ||
            ""
          )
            .toLowerCase()
            .includes(searchValue) ||

          (
            purchase.bill_number ||
            ""
          )
            .toLowerCase()
            .includes(searchValue) ||

          (
            purchase.product_name ||
            ""
          )
            .toLowerCase()
            .includes(searchValue);

        const matchesStatus =
          activeFilter === "all"
            ? true
            : purchase.status ===
              activeFilter;

        return (
          matchesSearch &&
          matchesStatus
        );
      }
    );

  return (
    <>
      {/* =========================================================
          DESKTOP
      ========================================================= */}

      <div className="hidden lg:block space-y-6">

        {/* Header */}

        <div>

          <h1 className="text-3xl font-bold">
            Purchase Workflow
          </h1>

          <p className="mt-1 text-gray-500">
            Manage supplier purchase bills.
          </p>

          {!isStaff && (
            <p className="mt-2 text-sm font-medium text-blue-600">
              Business Date: {selectedDate}
            </p>
          )}

        </div>


        {/* Stats */}

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


        {/* Table */}

        <PurchaseTable
          purchases={filteredPurchases}
          allPurchases={purchases}
          setPurchases={setPurchases}
        />


        {/* Desktop Receive Modal */}

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


      {/* =========================================================
          MOBILE
      ========================================================= */}

      <div className="lg:hidden w-full min-h-screen bg-gray-50 pb-24 overflow-x-hidden">

        {/* Header */}

        <div className="w-full bg-white border-b px-5 pt-6 pb-5">

          <h1 className="text-3xl font-bold text-gray-900">
            Purchases
          </h1>

          <p className="mt-1 text-gray-500">
            Manage supplier purchase bills.
          </p>

        </div>


        {/* Content */}

        <div className="px-4 pt-5 space-y-4">

          {/* Purchase Stats */}

          <PurchaseStats
            purchases={purchases}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />


          {/* Search + Receive */}

          <PurchaseToolbar
            search={search}
            setSearch={setSearch}
            onReceiveBill={() =>
              setShowReceiveModal(true)
            }
          />


          {/* Purchase List */}

          <PurchaseTable
            purchases={filteredPurchases}
            allPurchases={purchases}
            setPurchases={setPurchases}
          />

        </div>


        {/* Mobile Receive Sheet */}

        {report && (
          <ReceiveBillSheet
            isOpen={showReceiveModal}
            onClose={() =>
              setShowReceiveModal(false)
            }
            onSave={addPurchase}
          />
        )}

      </div>
    </>
  );
}