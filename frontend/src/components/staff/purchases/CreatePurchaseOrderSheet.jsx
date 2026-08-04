import { X } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const SUPPLIERS = [
  // ← Copy your entire supplier array here exactly
];

export default function CreatePurchaseOrderSheet({
  open,
  onClose,
  onSave,
}) {
  const [order, setOrder] = useState({
    party: "",
    expectedAmount: "",
    expectedDate: "",
  });

  const [showSuggestions, setShowSuggestions] =
    useState(false);

  const [highlightedIndex, setHighlightedIndex] =
    useState(-1);

  const sheetRef = useRef(null);

  const suggestionRefs = useRef([]);

  const filteredSuppliers = SUPPLIERS.filter(
    (supplier) =>
      supplier
        .toLowerCase()
        .includes(order.party.toLowerCase())
  ).slice(0, 8);

  useEffect(() => {
    function outside(e) {
      if (
        sheetRef.current &&
        !sheetRef.current.contains(e.target)
      ) {
        onClose();
      }
    }

    if (open) {
      document.addEventListener(
        "mousedown",
        outside
      );
    }

    return () =>
      document.removeEventListener(
        "mousedown",
        outside
      );
  }, [open]);

  function selectSupplier(supplier) {
    setOrder((prev) => ({
      ...prev,
      party: supplier,
    }));

    setShowSuggestions(false);
    setHighlightedIndex(-1);
  }

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-end">

        <div
          ref={sheetRef}
          className="bg-white w-full h-[96vh] rounded-t-3xl flex flex-col animate-slide-up"
        >

          {/* Handle */}

          <div className="flex justify-center py-3">

            <div className="w-14 h-1.5 rounded-full bg-gray-300" />

          </div>

          {/* Header */}

          <div className="px-6 pb-5 border-b flex justify-between">

            <div>

              <h1 className="text-3xl font-bold">
                Purchase Order
              </h1>

              <p className="text-gray-500 mt-2">
                Create a new purchase order
              </p>

            </div>

            <button
              onClick={onClose}
              className="w-11 h-11 rounded-full hover:bg-gray-100 flex items-center justify-center"
            >
              <X />
            </button>

          </div>

          {/* Body */}

          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">

            {/* Supplier */}

            <div>

              <label className="block mb-2 font-medium">

                Supplier

              </label>

              <div className="relative">

                <input
                  value={order.party}
                  placeholder="Search supplier..."
                  className="w-full h-12 rounded-xl border px-4"
                  onFocus={() =>
                    setShowSuggestions(true)
                  }
                  onChange={(e) => {
                    setOrder({
                      ...order,
                      party: e.target.value,
                    });

                    setShowSuggestions(true);
                  }}
                />

                {showSuggestions &&
                  filteredSuppliers.length > 0 && (

                  <div className="absolute z-50 mt-2 w-full rounded-2xl border bg-white shadow-lg max-h-72 overflow-y-auto">

                    {filteredSuppliers.map(
                      (
                        supplier,
                        index
                      ) => (

                        <button
                          key={supplier}
                          ref={(el) =>
                            suggestionRefs.current[
                              index
                            ] = el
                          }
                          onClick={() =>
                            selectSupplier(
                              supplier
                            )
                          }
                          className={`w-full text-left px-4 py-3 ${
                            highlightedIndex ===
                            index
                              ? "bg-blue-100"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          {supplier}
                        </button>

                      )
                    )}

                  </div>

                )}

              </div>

            </div>

            {/* Amount */}

            <div>

              <label className="block mb-2 font-medium">
                Expected Amount
              </label>

              <input
                type="number"
                value={order.expectedAmount}
                onChange={(e) =>
                  setOrder({
                    ...order,
                    expectedAmount:
                      e.target.value,
                  })
                }
                className="w-full h-12 rounded-xl border px-4"
              />

            </div>

            {/* Date */}

            <div>

              <label className="block mb-2 font-medium">
                Expected Date
              </label>

              <input
                type="date"
                value={order.expectedDate}
                onChange={(e) =>
                  setOrder({
                    ...order,
                    expectedDate:
                      e.target.value,
                  })
                }
                className="w-full h-12 rounded-xl border px-4"
              />

            </div>

          </div>

          {/* Footer */}

          <div className="border-t bg-white px-5 pt-5 pb-[calc(env(safe-area-inset-bottom)+20px)] space-y-3">

            <button
              onClick={() => {

                const user = JSON.parse(
                  localStorage.getItem(
                    "user"
                  )
                );

                onSave({
                  store_id: user.store_id,
                  supplier_name:
                    order.party,
                  expected_amount:
                    Number(
                      order.expectedAmount
                    ),
                  expected_date:
                    order.expectedDate,
                  created_by:
                    user.user_id,
                  items: [],
                });

              }}
              className="w-full h-14 rounded-2xl bg-blue-600 text-white font-semibold"
            >
              Create Purchase Order
            </button>

            <button
              onClick={onClose}
              className="w-full h-14 rounded-2xl border"
            >
              Cancel
            </button>

          </div>

        </div>

      </div>

    </>
  );
}