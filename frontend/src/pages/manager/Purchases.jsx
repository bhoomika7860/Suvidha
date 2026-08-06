import { useEffect, useState } from "react";

import purchaseService from "../../services/purchaseService";

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

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
  try {
    const purchaseData =
      await purchaseService.getTodayPurchases();

    setPurchases(purchaseData);
  } catch (err) {
    console.error(err);
  }
}

  async function addPurchase(purchase) {
    try {
      await purchaseService.createPurchase(purchase);

      await loadData();

      setShowReceiveModal(false);

    } catch (err) {
      console.error(err);
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

      <div>
        <h1 className="text-3xl font-bold">
          Purchase Workflow
        </h1>

        <p className="text-gray-500 mt-1">
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
  onReceiveBill={() => setShowReceiveModal(true)}
/>

      <>
  <PurchaseTable
    purchases={filteredPurchases}
    allPurchases={purchases}
    setPurchases={setPurchases}
  />

  <ReceiveBillModal
  isOpen={showReceiveModal}
  onClose={() => setShowReceiveModal(false)}
  onSave={addPurchase}
  reportId={report.id}
/>
</>

    </div>
  );
}