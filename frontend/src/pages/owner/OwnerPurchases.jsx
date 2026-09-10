import { useEffect, useState } from "react";
import {
  Download,
  Filter,
  X,
} from "lucide-react";
import PurchaseKPIs from "../../components/ownerPurchases/PurchaseKPIs";
import PurchaseFilters from "../../components/ownerPurchases/PurchaseFilters";
import PurchaseTable from "../../components/ownerPurchases/PurchaseTable";
import PurchaseDrawer from "../../components/ownerPurchases/PurchaseDrawer";
import Pagination from "../../components/common/Pagination";
import * as XLSX from "xlsx";
import purchaseService from "../../services/purchaseService";
import storeService from "../../services/storeService";

export default function OwnerPurchases() {
  const [purchases, setPurchases] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stores, setStores] = useState([]);

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState("");
  const [store, setStore] = useState("all");
  const [status, setStatus] = useState("all");
  const [date, setDate] = useState("");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    loadStores();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, store, status, date]);

  useEffect(() => {
    loadPurchases();
  }, [search, store, status, date, page]);

  async function loadStores() {
    try {
      const data = await storeService.getStores();
      setStores(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load stores:", err);
      setStores([]);
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
        filters.supplier = search.trim();
      }

      if (date) {
        filters.date = date;
      }

      const data = await purchaseService.getOwnerPurchases(
        filters,
        page
      );

      setPurchases(
        Array.isArray(data?.items) ? data.items : []
      );
      setTotal(Number(data?.total || 0));
      setSummary(data?.summary || null);
    } catch (err) {
      console.error("Failed to load purchases:", err);
      setPurchases([]);
      setTotal(0);
      setSummary(null);
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

    setTimeout(() => {
      setSelectedPurchase(null);
    }, 200);
  }

  function exportPurchases() {
    const rows = purchases.map((purchase) => ({
      Store: purchase.store_name,
      Supplier: purchase.supplier_name,
      "Bill Number": purchase.bill_number,
      Product: purchase.product_name,
      Quantity: purchase.quantity,
      Amount: purchase.purchase_amount,
      Status: purchase.status,
      Date: purchase.purchase_date,
      "Received By":
        purchase.received_by_name || purchase.received_by,
      "Checked By":
        purchase.checked_by_name || purchase.checked_by,
      "Entered By":
        purchase.entered_by_name || purchase.entered_by,
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Purchases"
    );

    const today = new Date()
      .toISOString()
      .split("T")[0];

    XLSX.writeFile(
      workbook,
      `Purchases_${today}.xlsx`
    );
  }

  const activeFilterCount = [
    store !== "all",
    status !== "all",
    Boolean(date),
  ].filter(Boolean).length;

  return (
    <div className="w-full">
      {/* =====================================================
          DESKTOP
          ===================================================== */}
      <div className="hidden space-y-6 lg:block">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Purchases
            </h1>

            <p className="mt-1 text-slate-500">
              View and manage purchases across all stores.
            </p>
          </div>

          <button
            type="button"
            onClick={exportPurchases}
            className="rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-700"
          >
            Export Purchases
          </button>
        </div>

        <PurchaseKPIs summary={summary} />

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

        <Pagination
          page={page}
          total={total}
          pageSize={10}
          onPageChange={setPage}
        />
      </div>

      {/* =====================================================
          MOBILE
          ===================================================== */}
      <div className="min-h-screen w-full overflow-x-hidden bg-gray-50 pb-24 lg:hidden">
        {/* Canonical Purchases mobile header */}
        <div className="w-full border-b bg-white px-5 pt-6 pb-5">
          <h1 className="text-3xl font-bold text-gray-900">
            Purchases
          </h1>

          <p className="mt-1 text-gray-500">
            View and manage purchases across all stores.
          </p>
        </div>

        <div className="space-y-4 px-4 pt-5">
          <button
            type="button"
            onClick={exportPurchases}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition active:scale-[0.99]"
          >
            <Download size={16} />
            Export Purchases
          </button>

          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="flex h-11 w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 shadow-sm"
          >
            <span className="flex items-center gap-2">
              <Filter size={16} />
              Filters
            </span>

            {activeFilterCount > 0 && (
              <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-blue-600 px-1.5 text-xs font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* The actual reusable PurchaseTable component.
              There is intentionally NO separate mobile purchase markup here. */}
          <PurchaseTable
            purchases={purchases}
            loading={loading}
            onRowClick={handleRowClick}
          />

          <Pagination
            page={page}
            total={total}
            pageSize={10}
            onPageChange={setPage}
          />
        </div>

        {/* Mobile filters */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-[70] flex items-end bg-black/40">
            <div className="max-h-[88vh] w-full overflow-y-auto rounded-t-[24px] bg-white shadow-2xl">
              <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-5 py-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Filters
                  </h2>

                  <p className="mt-0.5 text-xs text-gray-500">
                    Narrow down the purchase records.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600"
                  aria-label="Close filters"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-5">
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

                <div className="mt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setStore("all");
                      setStatus("all");
                      setDate("");
                    }}
                    className="h-11 flex-1 rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700"
                  >
                    Clear
                  </button>

                  <button
                    type="button"
                    onClick={() => setMobileFiltersOpen(false)}
                    className="h-11 flex-1 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <PurchaseDrawer
        open={drawerOpen}
        purchase={selectedPurchase}
        onClose={handleCloseDrawer}
      />
    </div>
  );
}
