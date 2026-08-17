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

export default function Purchases() {
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
      {/* ========================================================= */}
      {/* DESKTOP */}
      {/* ========================================================= */}

      <div className="hidden lg:block space-y-6">

        <div>

          <h1 className="text-3xl font-bold">
            Purchase Workflow
          </h1>

          <p className="mt-1 text-gray-500">
            Manage supplier purchase bills.
          </p>

          <p className="mt-2 text-sm font-medium text-blue-600">
            Business Date: {selectedDate}
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


      {/* ========================================================= */}
      {/* MOBILE */}
      {/* ========================================================= */}

      <div className="lg:hidden min-h-screen bg-gray-50 pb-24">

        <div className="bg-white px-4 pt-5 pb-5 border-b">

          <h1 className="text-2xl font-bold text-gray-900">
            Purchases
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage supplier purchase bills.
          </p>

          <p className="mt-2 text-xs font-medium text-blue-600">
            Business Date: {selectedDate}
          </p>

        </div>


        <div className="px-4 pt-4">

          <PurchaseStats
            purchases={purchases}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />

        </div>


        <div className="px-4 pt-4">

          <PurchaseToolbar
            search={search}
            setSearch={setSearch}
            onReceiveBill={() =>
              setShowReceiveModal(true)
            }
          />

        </div>


        <div className="px-4 pt-5">

          <PurchaseTable
            purchases={filteredPurchases}
            allPurchases={purchases}
            setPurchases={setPurchases}
          />

        </div>


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