import { useState } from "react";
import {
  X,
  User,
  Building2,
  Briefcase,
  Target,
  Camera,
  Activity,
  Image,
  FileText,
  Percent,
} from "lucide-react";

export default function TaskDrawer({
  task,
  isOpen,
  onClose,
  onComplete,
}) {
  const [note, setNote] = useState("");
  const [photo, setPhoto] = useState(null);
  const [actualSales, setActualSales] = useState("");
  const [actualDeliveries, setActualDeliveries] = useState("");
  const [showImage, setShowImage] = useState(false);

  if (!isOpen || !task) return null;
console.log("showImage:", showImage);
  function handleComplete() {
    console.log("PHOTO BEFORE SUBMIT:", photo);
  onComplete({
    ...task,

    completed_quantity:
      task.type === "sales"
        ? Number(actualSales)
        : task.type === "delivery"
        ? Number(actualDeliveries)
        : 1,

    // Send the actual File object
    photo: photo,

    note,

    photoUploaded: !!photo,
  });

  setPhoto(null);
  setNote("");
  setActualSales("");
  setActualDeliveries("");

  onClose();
}

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/30 z-40"
      />

      <div className="fixed right-0 top-0 h-screen w-full sm:w-[480px] bg-white shadow-2xl z-50 flex flex-col">

        {/* Header */}

        <div className="border-b px-6 py-5 flex justify-between items-center">

          <div>
            <h2 className="text-3xl font-bold">
              Task Details
            </h2>

            <p className="text-gray-500 mt-1">
              {task.title}
            </p>

          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <X size={22} />
          </button>

        </div>

        {/* Body */}

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">

          <InfoRow
            icon={<User size={20} />}
            title="Assigned To"
            value={task.employee}
          />

          <InfoRow
            icon={<Briefcase size={20} />}
            title="Role"
            value={task.role}
          />

          <InfoRow
            icon={<Building2 size={20} />}
            title="Store"
            value={task.store}
          />

          <InfoRow
            icon={<Activity size={20} />}
            title="Task Type"
            value={task.type}
          />

          <InfoRow
            icon={<Target size={20} />}
            title="Assigned Target"
            value={
              task.type === "sales"
                ? `₹${task.target_quantity}`
                : task.target_quantity || "-"
            }
          />

          {/* SALES */}

          {task.type === "sales" && task.status !== "completed" && (
            <div>

              <label className="font-medium block mb-2">
                Actual Sales Today
              </label>

              <input
                type="number"
                value={actualSales}
                onChange={(e) =>
                  setActualSales(e.target.value)
                }
                placeholder="Enter today's sales"
                className="w-full h-11 border rounded-xl px-4"
              />

            </div>
          )}

          {task.type === "sales" &&
            task.status === "completed" && (
              <>
                <InfoRow
                  icon={<Target size={20} />}
                  title="Actual Sales"
                  value={`₹${task.completed_quantity}`}
                />

                <InfoRow
                  icon={<Percent size={20} />}
                  title="Completion"
                  value={`${task.completion_percentage}%`}
                />
              </>
            )}

          {/* DELIVERY */}

          {task.type === "delivery" &&
            task.status !== "completed" && (
              <div>

                <label className="font-medium block mb-2">
                  Deliveries Completed
                </label>

                <input
                  type="number"
                  value={actualDeliveries}
                  onChange={(e) =>
                    setActualDeliveries(
                      e.target.value
                    )
                  }
                  placeholder="Enter completed deliveries"
                  className="w-full h-11 border rounded-xl px-4"
                />

              </div>
            )}

          {task.type === "delivery" &&
            task.status === "completed" && (
              <>
                <InfoRow
                  icon={<Target size={20} />}
                  title="Completed Deliveries"
                  value={task.completed_quantity}
                />

                <InfoRow
                  icon={<Percent size={20} />}
                  title="Completion"
                  value={`${task.completion_percentage}%`}
                />
              </>
            )}

          {/* STATUS */}

          <div>

            <p className="text-sm text-gray-500 mb-2">
              Status
            </p>

            <span
              className={`px-4 py-1 rounded-full text-sm font-medium ${
                task.status === "completed"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {task.status === "completed"
                ? "Completed"
                : "Pending"}
            </span>

          </div>



         {/* PHOTO */}

<div>
  <p className="font-medium mb-2">
    Photo Proof
  </p>

  {task.status === "completed" ? (

    task.photo_url ? (

      <>
        <div className="w-full rounded-xl overflow-hidden border bg-gray-100">
          <img
  src={`${import.meta.env.VITE_API_URL}${task.photo_url}`}
  alt="Task Proof"
  className="w-full h-full object-contain"
/>
        </div>

        <button
          type="button"
          onClick={() => setShowImage(true)}
          className="mt-3 w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white py-2 font-medium"
        >
          View Full Image
        </button>
      </>

    ) : (

      <div className="border rounded-xl h-52 flex items-center justify-center text-gray-500">
        No photo uploaded
      </div>

    )

  ) : (

    <label className="border-2 border-dashed rounded-xl h-52 flex flex-col justify-center items-center cursor-pointer hover:border-blue-500">

      {photo ? (

        <img
          src={URL.createObjectURL(photo)}
          alt="Preview"
          className="w-full h-full object-cover rounded-xl"
        />

      ) : (

        <>
          <Image
            size={42}
            className="text-gray-400"
          />

          <p className="text-gray-500 mt-3">
            Click to upload photo
          </p>
        </>

      )}

      <input
        hidden
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          setPhoto(file);
        }}
      />

    </label>

  )}
</div>


          {/* REMARKS */}

          <div>

            <label className="font-medium flex items-center gap-2 mb-2">
              <FileText size={18} />
              Remarks
            </label>

            {task.status === "completed" ? (
              <div className="border rounded-xl bg-gray-50 p-4">
                {task.note || "No remarks"}
              </div>
            ) : (
              <textarea
                rows={4}
                value={note}
                onChange={(e) =>
                  setNote(e.target.value)
                }
                className="w-full border rounded-xl p-3 resize-none"
              />
            )}

          </div>

        </div>

        {/* Footer */}

        <div className="border-t p-5 space-y-3">

          {task.status !== "completed" && (
            <button
              onClick={handleComplete}
              disabled={
                (task.type === "sales" &&
                  !actualSales) ||
                (task.type === "delivery" &&
                  !actualDeliveries)
              }
              className={`w-full h-11 rounded-xl text-white font-medium ${
                (task.type === "sales" &&
                  !actualSales) ||
                (task.type === "delivery" &&
                  !actualDeliveries)
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              Mark Complete
            </button>
          )}

          <button
            onClick={onClose}
            className="w-full h-11 rounded-xl border"
          >
            Close
          </button>

        </div>

      </div>

      {showImage && (
  <div className="fixed inset-0 z-[9999] bg-black/95 flex flex-col">

    <div className="flex justify-between items-center p-4 bg-black">
      <h2 className="text-white text-xl font-semibold">
        Task Photo
      </h2>

      <button
        type="button"
        onClick={() => setShowImage(false)}
        className="text-white text-4xl"
      >
        <X />
      </button>
    </div>

    <div className="flex-1 flex items-center justify-center p-6">

      <img
        src={task.photo_url}
        alt="Task Proof"
        className="max-w-full max-h-full object-contain"
      />

    </div>

  </div>
)}
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