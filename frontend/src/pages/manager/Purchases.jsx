import { useState } from "react";

import PurchaseStats from "../../components/purchases/PurchaseStats";
import PurchaseToolbar from "../../components/purchases/PurchaseToolbar";
import PurchaseTable from "../../components/purchases/PurchaseTable";
import ReceiveBillModal from "../../components/purchases/ReceiveBillModal";


import PurchaseOrders from "../../components/purchases/orders/PurchaseOrders";

export default function Purchases() {

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("received");

  const [showReceiveModal, setShowReceiveModal] = useState(false);
const [activeTab, setActiveTab] = useState("orders");

const [showOrderModal, setShowOrderModal] = useState(false);

const [purchaseOrders, setPurchaseOrders] = useState([
  {
    id: 1,
    party: "Sun Pharma",
    items: 8,
    expectedAmount: 12450,
    expectedDate: "Today",
    status: "Pending",
  },
  {
    id: 2,
    party: "Cipla",
    items: 15,
    expectedAmount: 28300,
    expectedDate: "Tomorrow",
    status: "Completed",
  },
]);
  const [purchases, setPurchases] = useState([
    {
      id: 1,
      party: "Sun Pharma",
      billNo: "SP1023",
      amount: 8500,
      receivedBy: "Rahul",
      checkedBy: "-",
      enteredBy: "-",
      status: "received",
    },
    {
      id: 2,
      party: "Cipla",
      billNo: "CP871",
      amount: 6700,
      receivedBy: "Amit",
      checkedBy: "Rahul",
      enteredBy: "-",
      status: "waiting-check",
    },
  ]);

  function addPurchase(purchase) {

    setPurchases((prev) => [
      {
        id: Date.now(),
        ...purchase,
      },
      ...prev,
    ]);

    setShowReceiveModal(false);

  }

 const filteredPurchases = purchases.filter((purchase) => {

  const matchesSearch =
    purchase.party.toLowerCase().includes(search.toLowerCase()) ||

    purchase.billNo.toLowerCase().includes(search.toLowerCase());

  const matchesStatus =
    purchase.status === activeFilter;

  return matchesSearch && matchesStatus;

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
  purchaseOrders={purchaseOrders}
  activeFilter={activeFilter}
  setActiveFilter={setActiveFilter}
  activeTab={activeTab}
/>
      <PurchaseToolbar
  search={search}
  setSearch={setSearch}
  activeTab={activeTab}
  setActiveTab={setActiveTab}
  onReceiveBill={() => setShowReceiveModal(true)}
  onCreatePO={() => setShowOrderModal(true)}
/>

      
{activeTab === "orders" ? (

  <PurchaseOrders
    purchaseOrders={purchaseOrders}
    setPurchaseOrders={setPurchaseOrders}
    showModal={showOrderModal}
    setShowModal={setShowOrderModal}
  />

) : (

  <PurchaseTable
    purchases={filteredPurchases}
    allPurchases={purchases}
    setPurchases={setPurchases}
  />

)}

      <ReceiveBillModal
        isOpen={showReceiveModal}
        onClose={() => setShowReceiveModal(false)}
        onSave={addPurchase}
      />

    </div>

  );

}