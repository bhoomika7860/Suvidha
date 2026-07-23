import { useState } from "react";

import StoreDrawer from "./StoreDrawer";

export default function StoreTable({
  stores,
  refreshStores,
}) {
  const [selectedStore, setSelectedStore] = useState(null);

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-50">

            <tr>

              <th className="text-left px-6 py-4">
                Store Name
              </th>

              <th className="text-left px-6 py-4">
                Code
              </th>

              <th className="text-left px-6 py-4">
                Store Manager
              </th>

              <th className="text-left px-6 py-4">
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {stores.length === 0 ? (

              <tr>

                <td
                  colSpan={4}
                  className="text-center py-10 text-gray-500"
                >
                  No Stores Found
                </td>

              </tr>

            ) : (

              stores.map((store) => (

                <tr
                  key={store.id}
                  onClick={() => setSelectedStore(store)}
                  className="border-t hover:bg-gray-50 cursor-pointer"
                >

                  <td className="px-6 py-5 font-semibold">
                    {store.name}
                  </td>

                  <td className="px-6 py-5">
                    {store.code}
                  </td>

                  <td className="px-6 py-5">
                    {store.manager_name}
                  </td>

                  <td className="px-6 py-5">

                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        store.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {store.is_active
                        ? "Active"
                        : "Inactive"}
                    </span>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

      <StoreDrawer
        store={selectedStore}
        isOpen={selectedStore !== null}
        onClose={() => setSelectedStore(null)}
        refreshStores={refreshStores}
      />

    </>
  );
}