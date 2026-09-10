import { useEffect, useState } from "react";
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
    manager_name: store?.manager_name || "",
    is_active:
      store?.is_active ?? true,
  });

  useEffect(() => {
    if (store) {
      setForm({
        name: store.name || "",
        code: store.code || "",
        address: store.address || "",
        manager_name:
          store.manager_name || "",
        is_active:
          store.is_active ?? true,
      });
    }
  }, [store]);

  if (!isOpen || !store) return null;

  async function saveChanges() {
    try {
      await storesService.updateStore(
        store.id,
        form
      );

      await refreshStores();

      setEditing(false);
      onClose();
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteStore() {
    const confirmDelete =
      window.confirm(
        "Delete this store permanently?\n\nThis action cannot be undone."
      );

    if (!confirmDelete) return;

    try {
      await storesService.deleteStore(
        store.id
      );

      await refreshStores();

      onClose();
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.detail ||
          "Unable to delete store."
      );
    }
  }

  return (
    <>
      {/* Backdrop */}

      <div
        onClick={onClose}
        className="
          fixed
          inset-0
          z-40
          bg-black/30
        "
      />


      {/* Drawer */}

      <div
        className="
          fixed
          bottom-0
          left-0
          right-0
          z-50
          flex
          max-h-[92vh]
          w-full
          flex-col
          overflow-hidden
          rounded-t-2xl
          bg-white
          shadow-2xl

          lg:bottom-auto
          lg:left-auto
          lg:top-0
          lg:right-0
          lg:h-screen
          lg:max-h-none
          lg:w-[500px]
          lg:rounded-none
        "
      >

        {/* Header */}

        <div
          className="
            flex
            shrink-0
            items-center
            justify-between
            border-b
            px-5
            py-4
            lg:px-6
            lg:py-5
          "
        >

          <div className="min-w-0">

            <h2
              className="
                truncate
                text-xl
                font-bold
                text-gray-900
                lg:text-3xl
              "
            >
              Store Details
            </h2>

            <p className="mt-1 truncate text-sm text-gray-500">
              {store.name}
            </p>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-gray-100
              text-gray-500
              hover:bg-gray-200
            "
          >
            <X size={19} />
          </button>

        </div>


        {/* Body */}

        <div
          className="
            flex-1
            overflow-y-auto
            p-5
            lg:space-y-6
            lg:p-6
          "
        >

          {editing ? (

            <div className="space-y-4 lg:space-y-6">

              <input
                className="
                  h-11
                  w-full
                  rounded-xl
                  border
                  border-gray-200
                  px-4
                  text-sm
                  outline-none
                  focus:border-blue-400
                  focus:ring-2
                  focus:ring-blue-100
                "
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                placeholder="Store Name"
              />

              <input
                className="
                  h-11
                  w-full
                  rounded-xl
                  border
                  border-gray-200
                  px-4
                  text-sm
                  outline-none
                  focus:border-blue-400
                  focus:ring-2
                  focus:ring-blue-100
                "
                value={form.code}
                onChange={(e) =>
                  setForm({
                    ...form,
                    code: e.target.value,
                  })
                }
                placeholder="Store Code"
              />

              <textarea
                rows={4}
                className="
                  w-full
                  resize-none
                  rounded-xl
                  border
                  border-gray-200
                  p-3
                  text-sm
                  outline-none
                  focus:border-blue-400
                  focus:ring-2
                  focus:ring-blue-100
                "
                value={form.address}
                onChange={(e) =>
                  setForm({
                    ...form,
                    address: e.target.value,
                  })
                }
                placeholder="Address"
              />

              <input
                className="
                  h-11
                  w-full
                  rounded-xl
                  border
                  border-gray-200
                  px-4
                  text-sm
                  outline-none
                  focus:border-blue-400
                  focus:ring-2
                  focus:ring-blue-100
                "
                placeholder="Store Manager"
                value={form.manager_name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    manager_name:
                      e.target.value,
                  })
                }
              />

            </div>

          ) : (

            <div className="space-y-5 lg:space-y-6">

              <InfoRow
                icon={<Building2 size={20} />}
                title="Store Name"
                value={store.name}
              />

              <InfoRow
                icon={<Hash size={20} />}
                title="Store Code"
                value={store.code}
              />

              <InfoRow
                icon={<User size={20} />}
                title="Store Manager"
                value={store.manager_name}
              />

              <InfoRow
                icon={<MapPin size={20} />}
                title="Address"
                value={store.address}
              />

              <InfoRow
                icon={<CheckCircle2 size={20} />}
                title="Status"
                value={
                  store.is_active
                    ? "Active"
                    : "Inactive"
                }
              />

            </div>

          )}

        </div>


        {/* Footer */}

        <div
          className="
            shrink-0
            space-y-2
            border-t
            p-4
            lg:space-y-3
            lg:p-5
          "
        >

          {editing ? (

            <button
              type="button"
              onClick={saveChanges}
              className="
                flex
                h-11
                w-full
                items-center
                justify-center
                rounded-xl
                bg-blue-600
                text-sm
                font-medium
                text-white
                hover:bg-blue-700
              "
            >
              Save Changes
            </button>

          ) : (

            <button
              type="button"
              onClick={() =>
                setEditing(true)
              }
              className="
                flex
                h-11
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-blue-600
                text-sm
                font-medium
                text-white
                hover:bg-blue-700
              "
            >
              <Pencil size={18} />
              Edit Store
            </button>

          )}

          <button
            type="button"
            onClick={deleteStore}
            className="
              flex
              h-11
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-red-600
              text-sm
              font-medium
              text-white
              hover:bg-red-700
            "
          >
            <Trash2 size={18} />
            Delete Store
          </button>

          <button
            type="button"
            onClick={onClose}
            className="
              h-11
              w-full
              rounded-xl
              border
              border-gray-200
              text-sm
              font-medium
              text-gray-700
              hover:bg-gray-50
            "
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
    <div className="flex min-w-0 gap-3 lg:gap-4">

      <div className="mt-1 shrink-0 text-blue-600">
        {icon}
      </div>

      <div className="min-w-0">

        <p className="text-xs text-gray-500 lg:text-sm">
          {title}
        </p>

        <p
          className="
            break-words
            text-base
            font-semibold
            text-gray-900
            lg:text-lg
          "
        >
          {value || "-"}
        </p>

      </div>

    </div>
  );
}