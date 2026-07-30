import { useEffect, useState } from "react";
import PurchaseKPIs from "../../components/ownerPurchases/PurchaseKPIs";
import PurchaseFilters from "../../components/ownerPurchases/PurchaseFilters";
import PurchaseTable from "../../components/ownerPurchases/PurchaseTable";
import PurchaseDrawer from "../../components/ownerPurchases/PurchaseDrawer";
import purchaseService from "../../services/purchaseService";
import storeService from "../../services/storeService";


export default function OwnerPurchases() {
const [purchases, setPurchases] = useState([]);
const [loading, setLoading] = useState(true);
const [stores, setStores] = useState([]);

const [search, setSearch] = useState("");
const [store, setStore] = useState("all");
const [status, setStatus] = useState("all");
const [date, setDate] = useState("");

const [drawerOpen, setDrawerOpen] = useState(false);
const [selectedPurchase, setSelectedPurchase] = useState(null);

  useEffect(() => {
    loadPurchases();
  }, [search, store, status, date]);

useEffect(() => {
  loadStores();
}, []);

async function loadStores() {
  try {
    const data = await storeService.getStores();
    setStores(data);
  } catch (err) {
    console.error(err);
  }
}

  async function loadPurchases() {
    try {
      setLoading(true);

      const filters = {};

      if (store !== "all") {
        filters.store_id = store;
      }

      if (status !== "all") {
        filters.status = status;
      }

      if (search.trim()) {
        filters.supplier = search;
      }

      if (date) {
        filters.date = date;
      }

      const data = await purchaseService.getOwnerPurchases(filters);

      setPurchases(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleRowClick(purchase) {
    setSelectedPurchase(purchase);
    setDrawerOpen(true);
  }

  function handleCloseDrawer() {
    setDrawerOpen(false);

    // Clear after close so the same row can be opened again.
    setTimeout(() => {
      setSelectedPurchase(null);
    }, 200);
  }

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold">
            Purchases
          </h1>

          <p className="mt-1 text-slate-500">
            View and manage purchases across all stores.
          </p>

        </div>

        <button className="rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-700">
          Export Purchases
        </button>

      </div>

      <PurchaseKPIs purchases={purchases} />

      <PurchaseFilters
  search={search}
  setSearch={setSearch}
  store={store}
  setStore={setStore}
  status={status}
  setStatus={setStatus}
  date={date}
  setDate={setDate}
  stores={stores}
/>

      <PurchaseTable
        purchases={purchases}
        loading={loading}
        onRowClick={handleRowClick}
      />

      <PurchaseDrawer
        open={drawerOpen}
        purchase={selectedPurchase}
        onClose={handleCloseDrawer}
      />

    </div>
  );
}