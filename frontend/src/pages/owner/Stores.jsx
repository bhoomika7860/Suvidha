import { useEffect, useState } from "react";

import storesService from "../../services/storeService";

import StoreHeader from "../../components/stores/StoreHeader";
import StoreTable from "../../components/stores/StoreTable";
import AddStoreModal from "../../components/stores/AddStoreModal";

export default function Stores() {
  const [stores, setStores] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadStores();
  }, []);

  async function loadStores() {
    try {
      const data = await storesService.getStores();
      setStores(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function addStore(store) {
    try {
      await storesService.createStore(store);

      await loadStores();

      setShowModal(false);

    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="space-y-6">

      <StoreHeader
        onAdd={() => setShowModal(true)}
      />

      <StoreTable
        stores={stores}
      />

      <AddStoreModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSave={addStore}
      />

    </div>
  );
}