import { useEffect } from "react";
import purchaseService from "../../services/purchaseService";
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

const [purchaseOrders, setPurchaseOrders] = useState([]);

const [purchases, setPurchases] = useState([]);

useEffect(() => {
  loadData();
}, []);

async function loadData() {
  try {
    const [purchaseData, orderData] = await Promise.all([
      purchaseService.getPurchases(),
      purchaseService.getPurchaseOrders(),
    ]);

    setPurchases(purchaseData);
    setPurchaseOrders(orderData);
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