import { useState } from "react";
import {
  X,
 Building2,
  MapPin,
  Hash,
  CheckCircle2,
  User,
  Pencil,
  Trash2,
} from "lucide-react";

import storesService from "../../services/storeService";

export default function StoreDrawer({
  store,
  isOpen,
  onClose,
  refreshStores,
}) {
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    name: store?.name || "",
    code: store?.code || "",
    address: store?.address || "",
    is_active: store?.is_active ?? true,
  });

  if (!isOpen || !store) return null;

  async function saveChanges() {
    try {
      await storesService.updateStore(
        store.id,
        form
      );

      await refreshStores();

onClose();

    } catch (err) {
      console.error(err);
    }
  }

  async function deactivateStore() {
    if (
      !window.confirm(
        "Deactivate this store?"
      )
    )
      return;

    try {
      await storesService.deactivateStore(
        store.id
      );

      await refreshStores();

onClose();

    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/30 z-40"
      />

      <div className="fixed right-0 top-0 h-screen w-[500px] bg-white shadow-2xl z-50 flex flex-col">

        <div className="flex justify-between items-center border-b px-6 py-5">

          <div>

            <h2 className="text-2xl font-bold">
              Store Details
            </h2>

            <p className="text-gray-500 mt-1">
              {store.name}
            </p>

          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <X size={22}/>
          </button>

        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {editing ? (
            <>
              <input
                className="w-full h-11 border rounded-xl px-4"
                value={form.name}
                onChange={(e)=>
                  setForm({
                    ...form,
                    name:e.target.value
                  })
                }
              />

              <input
                className="w-full h-11 border rounded-xl px-4"
                value={form.code}
                onChange={(e)=>
                  setForm({
                    ...form,
                    code:e.target.value
                  })
                }
              />

              <textarea
                rows={4}
                className="w-full border rounded-xl p-3"
                value={form.address}
                onChange={(e)=>
                  setForm({
                    ...form,
                    address:e.target.value
                  })
                }
              />

            </>
          ) : (
            <>
              <InfoRow
                icon={<Building2 size={20}/>}
                title="Store Name"
                value={store.name}
              />

              <InfoRow
                icon={<Hash size={20}/>}
                title="Store Code"
                value={store.code}
              />
                <InfoRow
    icon={<User size={22} />}
    title="Store Manager"
    value={store.manager_name}
/>
              <InfoRow
                icon={<MapPin size={20}/>}
                title="Address"
                value={store.address}
              />

              <InfoRow
                icon={<CheckCircle2 size={20}/>}
                title="Status"
                value={
                  store.is_active
                    ? "Active"
                    : "Inactive"
                }
              />
            </>
          )}

        </div>

        <div className="border-t p-5 space-y-3">

          {editing ? (

            <button
              onClick={saveChanges}
              className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
            >
              Save Changes
            </button>

          ) : (

            <button
              onClick={() =>
                setEditing(true)
              }
              className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex justify-center items-center gap-2"
            >
              <Pencil size={18}/>

              Edit Store

            </button>

          )}

          <button
            onClick={deactivateStore}
            className="w-full h-11 rounded-xl bg-red-600 hover:bg-red-700 text-white flex justify-center items-center gap-2"
          >
            <Trash2 size={18}/>

            Deactivate Store

          </button>

          <button
            onClick={onClose}
            className="w-full h-11 rounded-xl border"
          >
            Close
          </button>

        </div>

      </div>

    </>
  );
}

function InfoRow({
  icon,
  title,
  value,
}) {
  return (
    <div className="flex gap-4">

      <div className="text-blue-600 mt-1">
        {icon}
      </div>

      <div>

        <p className="text-sm text-gray-500">
          {title}
        </p>

        <p className="text-lg font-semibold">
          {value || "-"}
        </p>

      </div>

    </div>
  );
}