import { Search, Plus } from "lucide-react";

export default function PurchaseToolbar({
  search,
  setSearch,
  activeTab,
  setActiveTab,
  onReceiveBill,
  onCreatePO,
}) {
  return (
    <div className="space-y-5">

      {/* Tabs */}

      <div className="flex gap-3">

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

      {/* Toolbar */}

      <div className="flex items-center justify-between">

        <div className="relative">

          <Search
            size={18}
            className="absolute left-3 top-3 text-gray-400"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              activeTab === "orders"
                ? "Search Purchase Orders..."
                : "Search Party or Bill Number..."
            }
            className="w-80 h-11 pl-10 pr-4 rounded-xl border border-gray-200 outline-none focus:border-blue-500"
          />

        </div>

        {activeTab === "orders" ? (

          <button
            onClick={onCreatePO}
            className="h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 transition"
          >
            <Plus size={18} />
            Create Purchase Order
          </button>

        ) : (

          <button
            onClick={onReceiveBill}
            className="h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 transition"
          >
            <Plus size={18} />
            Receive New Bill
          </button>

        )}

      </div>

    </div>
  );
}