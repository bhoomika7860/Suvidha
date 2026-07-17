import { Search, Plus } from "lucide-react";

export default function PurchaseToolbar({
  search,
  setSearch,
  activeTab,
  setActiveTab,
  onReceiveBill,
  onCreatePO,
  isStaff,
}) {
  return (
    <div className="flex gap-3">

  {!isStaff && (

    <button
      onClick={() => setActiveTab("orders")}
      className={`px-5 h-11 rounded-xl font-medium transition ${
        activeTab === "orders"
          ? "bg-blue-600 text-white"
          : "border border-gray-200 hover:bg-gray-50"
      }`}
    >
      Purchase Orders
    </button>

  )}

  <button
    onClick={() => setActiveTab("received")}
    className={`px-5 h-11 rounded-xl font-medium transition ${
      activeTab === "received"
        ? "bg-blue-600 text-white"
        : "border border-gray-200 hover:bg-gray-50"
    }`}
  >
    Received Bills
  </button>

</div>
  );
}