import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";

import storesService from "../../services/storeService";

import StoreHeader from "../../components/stores/StoreHeader";
import StoreStats from "../../components/stores/StoreStats";
import StoreToolbar from "../../components/stores/StoreToolbar";
import StoreTable from "../../components/stores/StoreTable";
import AddStoreModal from "../../components/stores/AddStoreModal";

export default function Stores() {
  const [stores, setStores] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadStores();
  }, []);

  async function loadStores() {
    try {
      const data = await storesService.getStores();

      setStores(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      console.error(
        "Failed to load stores:",
        err
      );
    }
  }

  async function addStore(store) {
    try {
      await storesService.createStore(store);

      await loadStores();

      setShowModal(false);
    } catch (err) {
      console.error(
        "Failed to add store:",
        err
      );
    }
  }

  const filteredStores = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return stores.filter((store) => {
      const storeName = String(
        store?.name || ""
      ).toLowerCase();

      const storeCode = String(
        store?.code || ""
      ).toLowerCase();

      const matchesSearch =
        query === "" ||
        storeName.includes(query) ||
        storeCode.includes(query);

      const matchesFilter =
        filter === "all"
          ? true
          : filter === "active"
          ? Boolean(store?.is_active)
          : !Boolean(store?.is_active);

      return (
        matchesSearch &&
        matchesFilter
      );
    });
  }, [stores, search, filter]);

  return (
    <>
      {/* =========================================================
          DESKTOP
      ========================================================= */}

      <div className="hidden lg:block space-y-6">

        {/* Header */}

        <StoreHeader
          onAdd={() =>
            setShowModal(true)
          }
        />


        {/* Stats */}

        <StoreStats
          stores={stores}
        />


        {/* Toolbar */}

        <StoreToolbar
          search={search}
          setSearch={setSearch}
          filter={filter}
          setFilter={setFilter}
        />


        {/* Table */}

        <StoreTable
          stores={filteredStores}
          refreshStores={loadStores}
        />


        {/* Desktop Add Store Modal */}

        <AddStoreModal
          open={showModal}
          onClose={() =>
            setShowModal(false)
          }
          onSave={addStore}
        />

      </div>


      {/* =========================================================
          MOBILE
      ========================================================= */}

      <div className="lg:hidden w-full min-h-screen bg-gray-50 pb-24 overflow-x-hidden">

        {/* =======================================================
            MOBILE HEADER
        ======================================================= */}

        <div className="w-full bg-white border-b px-5 pt-6 pb-5">

          <div className="flex items-start justify-between gap-3">

            <div className="min-w-0 flex-1">

              <h1 className="text-3xl font-bold leading-tight text-gray-900">
                Stores
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Manage all pharmacy stores.
              </p>

            </div>


            <button
              type="button"
              onClick={() =>
                setShowModal(true)
              }
              className="
                flex
                h-11
                shrink-0
                items-center
                gap-2
                rounded-xl
                bg-blue-600
                px-4
                text-sm
                font-medium
                text-white
                transition-colors
                hover:bg-blue-700
              "
            >

              <Plus size={18} />

              <span>
                Add
              </span>

            </button>

          </div>

        </div>


        {/* =======================================================
            MOBILE CONTENT
        ======================================================= */}

        <div className="w-full px-4 pt-5 space-y-4">

          {/* Store Stats */}

          <StoreStats
            stores={stores}
          />


          {/* Search + Filter */}

          <StoreToolbar
            search={search}
            setSearch={setSearch}
            filter={filter}
            setFilter={setFilter}
          />


          {/* Store List */}

          <StoreTable
            stores={filteredStores}
            refreshStores={loadStores}
          />

        </div>


        {/* =======================================================
            MOBILE ADD STORE MODAL
        ======================================================= */}

        <AddStoreModal
          open={showModal}
          onClose={() =>
            setShowModal(false)
          }
          onSave={addStore}
        />

      </div>
    </>
  );
}