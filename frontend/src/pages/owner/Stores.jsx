import { useEffect, useMemo, useState } from "react";

import storesService from "../../services/storeService";

import StoreHeader from "../../components/stores/StoreHeader";
import StoreStats from "../../components/stores/StoreStats";
import StoreToolbar from "../../components/stores/StoreToolbar";
import StoreTable from "../../components/stores/StoreTable";
import AddStoreModal from "../../components/stores/AddStoreModal";

export default function Stores() {
  const [stores, setStores] = useState([]);

  const [showModal, setShowModal] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("all");

  useEffect(() => {
    loadStores();
  }, []);

  async function loadStores() {
    try {
      const data =
        await storesService.getStores();

      setStores(data);

    } catch (err) {
      console.error(err);
    }
  }

  async function addStore(store) {
    try {

      await storesService.createStore(
        store
      );

      await loadStores();

      setShowModal(false);

    } catch (err) {
      console.error(err);
    }
  }

  const filteredStores = useMemo(() => {

    return stores.filter((store) => {

      const matchesSearch =
        store.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||

        store.code
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesFilter =
        filter === "all"
          ? true
          : filter === "active"
          ? store.is_active
          : !store.is_active;

      return (
        matchesSearch &&
        matchesFilter
      );

    });

  }, [
    stores,
    search,
    filter,
  ]);

  return (
    <div className="space-y-6">

      <StoreHeader
        onAdd={() =>
          setShowModal(true)
        }
      />

      <StoreStats
        stores={stores}
      />

      <StoreToolbar
        search={search}
        setSearch={setSearch}
        filter={filter}
        setFilter={setFilter}
      />

      <StoreTable
        stores={filteredStores}
        refreshStores={loadStores}
      />

      <AddStoreModal
        open={showModal}
        onClose={() =>
          setShowModal(false)
        }
        onSave={addStore}
      />

    </div>
  );
}