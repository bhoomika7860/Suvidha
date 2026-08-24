import { useEffect, useRef, useState } from "react";
import { Upload, X } from "lucide-react";

import supplierService from "../../services/supplierService";

export default function ReceiveBillModal({
  isOpen,
  onClose,
  onSave,
  reportId,
}) {
  const [purchaseDate, setPurchaseDate] = useState("");
  const [party, setParty] = useState("");
  const [amount, setAmount] = useState("");
  const [billNo, setBillNo] = useState("");
  const [billImage, setBillImage] = useState(null);

  const [suppliers, setSuppliers] = useState([]);
  const [loadingSuppliers, setLoadingSuppliers] =
    useState(false);

  const [showSuggestions, setShowSuggestions] =
    useState(false);

  const [highlightedIndex, setHighlightedIndex] =
    useState(-1);

  const suggestionRefs = useRef([]);
  const modalRef = useRef(null);

  const filteredSuppliers =
    suppliers
      .filter((supplier) =>
        supplier.name
          .toLowerCase()
          .includes(party.toLowerCase())
      )
      .slice(0, 8);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const today =
      new Date().toLocaleDateString("en-CA");

    setPurchaseDate(today);

    loadSuppliers();
  }, [isOpen]);

  async function loadSuppliers() {
    try {
      setLoadingSuppliers(true);

      const data =
        await supplierService.getSuppliers();

      setSuppliers(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      console.error(
        "Failed to load suppliers:",
        err
      );

      setSuppliers([]);

      alert(
        err?.response?.data?.detail ||
          "Failed to load suppliers."
      );
    } finally {
      setLoadingSuppliers(false);
    }
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        modalRef.current &&
        !modalRef.current.contains(
          event.target
        )
      ) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener(
        "mousedown",
        handleClickOutside
      );
    }

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (
      highlightedIndex >= 0 &&
      suggestionRefs.current[
        highlightedIndex
      ]
    ) {
      suggestionRefs.current[
        highlightedIndex
      ].scrollIntoView({
        block: "nearest",
      });
    }
  }, [highlightedIndex]);

  if (!isOpen) {
    return null;
  }

  function selectSupplier(supplier) {
    setParty(supplier.name);

    setShowSuggestions(false);
    setHighlightedIndex(-1);
  }

  function handleKeyDown(e) {
    if (!showSuggestions) {
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();

        setHighlightedIndex((prev) =>
          prev <
          filteredSuppliers.length - 1
            ? prev + 1
            : 0
        );

        break;

      case "ArrowUp":
        e.preventDefault();

        setHighlightedIndex((prev) =>
          prev > 0
            ? prev - 1
            : filteredSuppliers.length - 1
        );

        break;

      case "Enter":
        e.preventDefault();

        if (highlightedIndex >= 0) {
          selectSupplier(
            filteredSuppliers[
              highlightedIndex
            ]
          );
        }

        break;

      case "Escape":
        setShowSuggestions(false);
        setHighlightedIndex(-1);
        break;

      default:
        break;
    }
  }

  function handleSubmit() {
    if (
      !party.trim() ||
      !amount ||
      !billNo.trim()
    ) {
      return;
    }

    const user = JSON.parse(
      localStorage.getItem("user")
    );

    onSave({
      store_id: user.store_id,
      daily_report_id: reportId,
      product_name: "Purchase Bill",
      quantity: 1,
      supplier_name: party.trim(),
      purchase_amount: Number(amount),
      created_by: user.user_id,
      bill_number: billNo.trim(),
      received_by: user.full_name,
      entered_by: "",
      status: "received",
      purchase_date: purchaseDate,
      bill_image: billImage,
    });

    setParty("");
    setAmount("");
    setBillNo("");
    setPurchaseDate("");
    setBillImage(null);
    setShowSuggestions(false);
    setHighlightedIndex(-1);

    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div
        ref={modalRef}
        className="w-[650px] rounded-2xl bg-white shadow-xl"
      >
        {/* Header */}

        <div className="flex items-center justify-between border-b px-6 py-5">
          <h2 className="text-2xl font-bold">
            Receive Purchase Bill
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <X />
          </button>
        </div>

        <div className="space-y-5 p-6">

          {/* Supplier */}

          <div className="relative">

            <label className="mb-2 block text-sm font-medium">
              Supplier
            </label>

            <input
              value={party}
              placeholder={
                loadingSuppliers
                  ? "Loading suppliers..."
                  : "Search Supplier..."
              }
              disabled={loadingSuppliers}
              className="h-11 w-full rounded-xl border border-gray-200 px-4 disabled:bg-gray-50"
              onFocus={() => {
                setShowSuggestions(true);
                setHighlightedIndex(-1);
              }}
              onChange={(e) => {
                setParty(e.target.value);
                setShowSuggestions(true);
                setHighlightedIndex(-1);
              }}
              onKeyDown={handleKeyDown}
            />

            {showSuggestions &&
              filteredSuppliers.length > 0 && (

                <div className="absolute z-50 mt-1 max-h-64 w-full overflow-y-auto rounded-xl border bg-white shadow-lg">

                  {filteredSuppliers.map(
                    (supplier, index) => (

                      <button
                        key={supplier.id}
                        ref={(el) => {
                          suggestionRefs.current[
                            index
                          ] = el;
                        }}
                        type="button"
                        onClick={() =>
                          selectSupplier(
                            supplier
                          )
                        }
                        className={`w-full px-4 py-3 text-left ${
                          highlightedIndex ===
                          index
                            ? "bg-blue-100"
                            : "hover:bg-blue-50"
                        }`}
                      >
                        {supplier.name}
                      </button>

                    )
                  )}

                </div>

              )}

            {showSuggestions &&
              !loadingSuppliers &&
              party.trim() &&
              filteredSuppliers.length === 0 && (

                <div className="absolute z-50 mt-1 w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-500 shadow-lg">
                  No supplier found.
                </div>

              )}

          </div>

          {/* Purchase Date */}

          <div>

            <label className="mb-2 block text-sm font-medium">
              Purchase Date
            </label>

            <input
              type="date"
              value={purchaseDate}
              onChange={(e) =>
                setPurchaseDate(
                  e.target.value
                )
              }
              className="h-11 w-full rounded-xl border border-gray-200 px-4"
            />

          </div>

          {/* Amount */}

          <div>

            <label className="mb-2 block text-sm font-medium">
              Amount
            </label>

            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value)
              }
              placeholder="Enter Purchase Amount"
              className="h-11 w-full rounded-xl border border-gray-200 px-4"
            />

          </div>

          {/* Bill Number */}

          <div>

            <label className="mb-2 block text-sm font-medium">
              Bill Number
            </label>

            <input
              value={billNo}
              onChange={(e) =>
                setBillNo(e.target.value)
              }
              placeholder="Enter Bill Number"
              className="h-11 w-full rounded-xl border border-gray-200 px-4"
            />

          </div>

          {/* Upload Bill */}

          <div>

            <label className="mb-2 block text-sm font-medium">
              Upload Bill
            </label>

            <label className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 transition hover:border-blue-500">

              {billImage ? (

                <img
                  src={URL.createObjectURL(
                    billImage
                  )}
                  alt="Bill"
                  className="h-full w-full rounded-2xl object-contain"
                />

              ) : (

                <>
                  <Upload
                    size={36}
                    className="text-gray-400"
                  />

                  <p className="mt-3 text-sm text-gray-500">
                    Click to upload bill image
                  </p>
                </>

              )}

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  setBillImage(
                    e.target.files?.[0] ||
                      null
                  )
                }
              />

            </label>

          </div>

          {/* Submit */}

          <button
            onClick={handleSubmit}
            disabled={
              loadingSuppliers
            }
            className="h-11 w-full rounded-xl bg-blue-600 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Submit Bill
          </button>

        </div>

      </div>
    </div>
  );
}