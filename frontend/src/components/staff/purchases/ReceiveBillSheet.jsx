import { useEffect, useRef, useState } from "react";
import { X, Upload, Camera, Image as ImageIcon } from "lucide-react";
import purchaseService from "../../../services/purchaseService";

export default function ReceiveBillSheet({
  isOpen,
  onClose,
  onSave,
}) {
  const [supplier, setSupplier] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [amount, setAmount] = useState("");
  const [billNumber, setBillNumber] = useState("");
  const [billImage, setBillImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const today = new Date().toISOString().split("T")[0];

    setSupplier("");
    setPurchaseDate(today);
    setAmount("");
    setBillNumber("");
    setBillImage(null);
    setPreviewUrl(null);
    setIsSubmitting(false);
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (!isOpen) return null;

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setBillImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!supplier.trim()) {
      alert("Please enter supplier name.");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      alert("Please enter a valid purchase amount.");
      return;
    }

    if (!billNumber.trim()) {
      alert("Please enter bill number.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        supplier_name: supplier.trim(),
        purchase_date: purchaseDate,
        purchase_amount: Number(amount),
        bill_number: billNumber.trim(),
        bill_image: billImage,
      };

      const response = await purchaseService.receiveBill(payload);

      if (onSave) {
        onSave(response);
      }

      onClose();
    } catch (error) {
      console.error("Failed to submit purchase bill:", error);
      alert(
        error?.response?.data?.detail ||
          "Failed to submit purchase bill. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end bg-black/40">
      <div className="w-full max-h-[92vh] overflow-hidden rounded-t-[24px] bg-white">
        {/* Handle */}
        <div className="flex justify-center pt-3">
          <div className="h-1.5 w-14 rounded-full bg-gray-300" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-200 px-5 pb-4 pt-3">
          <div>
            <h2 className="text-[24px] font-semibold text-gray-950">
              Receive Bill
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Upload today's supplier bill
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="mt-1 rounded-full p-1 text-gray-900"
            aria-label="Close"
          >
            <X size={25} strokeWidth={2} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="max-h-[calc(92vh-145px)] overflow-y-auto px-5 pb-6 pt-5"
        >
          {/* Supplier */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-gray-900">
              Supplier
            </label>

            <input
              type="text"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              placeholder="Search Supplier..."
              className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-blue-500"
            />
          </div>

          {/* Purchase Date */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-gray-900">
              Purchase Date
            </label>

            <input
              type="date"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-blue-500"
            />
          </div>

          {/* Amount */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-gray-900">
              Amount
            </label>

            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter Purchase Amount"
              className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-blue-500"
            />
          </div>

          {/* Bill Number */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-gray-900">
              Bill Number
            </label>

            <input
              type="text"
              value={billNumber}
              onChange={(e) => setBillNumber(e.target.value)}
              placeholder="Enter Bill Number"
              className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-blue-500"
            />
          </div>

          {/* Upload Bill */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-gray-900">
              Upload Bill
            </label>

            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleImageChange}
            />

            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />

            {!previewUrl ? (
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="flex min-h-[150px] w-full flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 text-gray-500"
              >
                <Upload
                  size={34}
                  strokeWidth={1.8}
                  className="mb-3 text-gray-400"
                />

                <span className="text-sm">
                  Click to upload bill image
                </span>
              </button>
            ) : (
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <img
                  src={previewUrl}
                  alt="Bill preview"
                  className="max-h-[220px] w-full object-contain"
                />

                <div className="flex gap-2 border-t border-gray-200 p-3">
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 py-2 text-sm"
                  >
                    <Camera size={17} />
                    Camera
                  </button>

                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 py-2 text-sm"
                  >
                    <ImageIcon size={17} />
                    Gallery
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-12 w-full rounded-xl bg-blue-600 text-sm font-semibold text-white disabled:opacity-60"
          >
            {isSubmitting ? "Submitting..." : "Submit Bill"}
          </button>
        </form>
      </div>
    </div>
  );
}