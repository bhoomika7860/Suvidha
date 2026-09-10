import {
  ChevronRight,
  Store as StoreIcon,
  User,
} from "lucide-react";

import { useState } from "react";

import StoreDrawer from "./StoreDrawer";

export default function StoreTable({
  stores,
  refreshStores,
}) {
  const [selectedStore, setSelectedStore] =
    useState(null);

  return (
    <>
      {/* =====================================================
          DESKTOP TABLE
      ===================================================== */}

      <div className="hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm lg:block">

        <table className="w-full">

          <thead className="bg-gray-50">

            <tr>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Store Name
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Code
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Store Manager
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {stores.length === 0 ? (

              <tr>

                <td
                  colSpan={4}
                  className="py-10 text-center text-sm text-gray-500"
                >
                  No Stores Found
                </td>

              </tr>

            ) : (

              stores.map((store) => (

                <tr
                  key={store.id}
                  onClick={() =>
                    setSelectedStore(store)
                  }
                  className="
                    cursor-pointer
                    border-t
                    border-gray-100
                    transition-colors
                    hover:bg-gray-50
                  "
                >

                  <td className="px-6 py-5 text-sm font-semibold text-gray-900">
                    {store.name}
                  </td>

                  <td className="px-6 py-5 text-sm text-gray-700">
                    {store.code}
                  </td>

                  <td className="px-6 py-5 text-sm text-gray-700">
                    {store.manager_name || "-"}
                  </td>

                  <td className="px-6 py-5">

                    <span
                      className={`
                        inline-flex
                        rounded-full
                        px-3 py-1
                        text-sm
                        font-medium
                        ${
                          store.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }
                      `}
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


      {/* =====================================================
          MOBILE STORE LIST
      ===================================================== */}

      <div className="w-full min-w-0 lg:hidden">

        <div className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          {/* Section heading */}

          <div className="border-b border-gray-100 px-4 py-3.5">

            <p
              className="
                text-[11px]
                font-semibold
                uppercase
                tracking-[0.08em]
                text-gray-500
              "
            >
              Stores
            </p>

          </div>


          {/* Store rows */}

          {stores.length === 0 ? (

            <div className="px-4 py-10 text-center">

              <p className="text-sm font-medium text-gray-700">
                No Stores Found
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Try changing your search or filter.
              </p>

            </div>

          ) : (

            <div className="w-full">

              {stores.map((store) => (

                <button
                  key={store.id}
                  type="button"
                  onClick={() =>
                    setSelectedStore(store)
                  }
                  className="
                    flex
                    w-full
                    min-w-0
                    items-center
                    gap-3.5
                    border-b
                    border-gray-100
                    px-4
                    py-4
                    text-left
                    transition-colors
                    last:border-b-0
                    active:bg-gray-50
                  "
                >

                  {/* Store icon */}

                  <div
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-blue-50
                      text-blue-600
                    "
                  >
                    <StoreIcon size={19} />
                  </div>


                  {/* Store information */}

                  <div className="min-w-0 flex-1">

                    {/* Store name + status */}

                    <div className="flex min-w-0 items-center justify-between gap-3">

                      <p
                        className="
                          min-w-0
                          truncate
                          text-[15px]
                          font-medium
                          leading-tight
                          text-[#0F172A]
                        "
                      >
                        {store.name}
                      </p>

                      <span
                        className={`
                          shrink-0
                          rounded-full
                          px-2.5
                          py-1
                          text-[10px]
                          font-medium
                          leading-none
                          ${
                            store.is_active
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }
                        `}
                      >
                        {store.is_active
                          ? "Active"
                          : "Inactive"}
                      </span>

                    </div>


                    {/* Store code */}

                    <p
                      className="
                        mt-1
                        text-[11px]
                        font-medium
                        leading-tight
                        text-gray-500
                      "
                    >
                      {store.code}
                    </p>


                    {/* Manager */}

                    <div className="mt-2 flex min-w-0 items-center gap-1.5">

                      <User
                        size={13}
                        strokeWidth={1.7}
                        className="shrink-0 text-gray-400"
                      />

                      <p
                        className="
                          min-w-0
                          truncate
                          text-[12px]
                          font-medium
                          leading-tight
                          text-gray-600
                        "
                      >
                        {store.manager_name ||
                          "No manager assigned"}
                      </p>

                    </div>

                  </div>


                  {/* Arrow */}

                  <ChevronRight
                    size={18}
                    strokeWidth={1.8}
                    className="shrink-0 text-gray-400"
                  />

                </button>

              ))}

            </div>

          )}

        </div>

      </div>


      {/* =====================================================
          STORE DRAWER
      ===================================================== */}

      <StoreDrawer
        store={selectedStore}
        isOpen={selectedStore !== null}
        onClose={() =>
          setSelectedStore(null)
        }
        refreshStores={refreshStores}
      />

    </>
  );
}