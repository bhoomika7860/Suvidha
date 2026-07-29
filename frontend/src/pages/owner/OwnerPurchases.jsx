import { useEffect, useState } from "react";
import PurchaseKPIs from "../../components/ownerPurchases/PurchaseKPIs";
import PurchaseFilters from "../../components/ownerPurchases/PurchaseFilters";
import PurchaseTable from "../../components/ownerPurchases/PurchaseTable";
import purchaseService from "../../services/purchaseService";

export default function OwnerPurchases() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [store, setStore] = useState("all");
  const [status, setStatus] = useState("all");
  const [date, setDate] = useState("");

  useEffect(() => {
    loadPurchases();
  }, []);

  async function loadPurchases() {
    try {
      setLoading(true);

      const data = await purchaseService.getPurchases();

      setPurchases(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold">
            Purchases
          </h1>

          <p className="mt-1 text-slate-500">
            View every purchase across all stores.
          </p>
        </div>

        <button className="rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700">
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
      />

      <PurchaseTable
        purchases={purchases}
        loading={loading}
        search={search}
        store={store}
        status={status}
        date={date}
      />

    </div>
  );
}