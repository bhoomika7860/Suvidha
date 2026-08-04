import {
  X,
  User,
  Briefcase,
  Store,
  Activity,
  Target,
  Camera,
  Image,
} from "lucide-react";

import { useState, useRef } from "react";

export default function MobileTaskDrawer({
  task,
  isOpen,
  onClose,
  onComplete,
}) {
  const cameraInput = useRef(null);
  const galleryInput = useRef(null);

  const [actualSales, setActualSales] =
    useState("");

  const [actualDeliveries, setActualDeliveries] =
    useState("");

  const [photo, setPhoto] =
    useState(null);

  const [note, setNote] =
    useState("");

  if (!isOpen || !task) return null;

  const taskType =
    task.task_type || task.type || "normal";

  const assignedTarget =
    task.assigned_target ??
    task.target_value ??
    task.target_quantity;

  return (
    <>
      {/* ================= Backdrop ================= */}

      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/40"
      />

      {/* ================= Bottom Sheet ================= */}

      <div className="fixed inset-0 z-50 flex items-end">

        <div className="bg-white w-full h-[96vh] rounded-t-[30px] flex flex-col animate-slide-up">

          {/* Handle */}

          <div className="flex justify-center pt-3 pb-1">

            <div className="w-14 h-1.5 rounded-full bg-gray-300" />

          </div>

          {/* Header */}

          <div className="flex items-start justify-between px-6 pt-4 pb-5 border-b">

            <div>

              <h1 className="text-3xl font-bold">
                Task Details
              </h1>

              <p className="mt-2 text-gray-500">
                {task.title}
              </p>

            </div>

            <button
              onClick={onClose}
              className="w-11 h-11 rounded-full hover:bg-gray-100 flex items-center justify-center"
            >
              <X size={24} />
            </button>

          </div>

          {/* ================= Scroll Area ================= */}

          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">

            {/* Assigned To */}

            <div className="flex gap-5">

              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">

                <User
                  size={20}
                  className="text-blue-600"
                />

              </div>

              <div>

                <p className="text-sm text-gray-500">
                  Assigned To
                </p>

                <p className="font-semibold text-lg">
                  {task.assigned_to_name}
                </p>

              </div>

            </div>

            {/* Role */}

            <div className="flex gap-5">

              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">

                <Briefcase
                  size={20}
                  className="text-blue-600"
                />

              </div>

              <div>

                <p className="text-sm text-gray-500">
                  Role
                </p>

                <p className="font-semibold text-lg capitalize">
                  {task.role}
                </p>

              </div>

            </div>

            {/* Store */}

            <div className="flex gap-5">

              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">

                <Store
                  size={20}
                  className="text-blue-600"
                />

              </div>

              <div>

                <p className="text-sm text-gray-500">
                  Store
                </p>

                <p className="font-semibold text-lg">
                  {task.store_name}
                </p>

              </div>

            </div>

            {/* Task Type */}

            <div className="flex gap-5">

              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">

                <Activity
                  size={20}
                  className="text-blue-600"
                />

              </div>

              <div>

                <p className="text-sm text-gray-500">
                  Task Type
                </p>

                <p className="font-semibold text-lg capitalize">
                  {taskType}
                </p>

              </div>

            </div>

            {/* Target */}

            {(taskType === "sales" ||
              taskType === "delivery") && (

              <div className="flex gap-5">

                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">

                  <Target
                    size={20}
                    className="text-blue-600"
                  />

                </div>

                <div>

                  <p className="text-sm text-gray-500">
                    Assigned Target
                  </p>

                  <p className="font-semibold text-lg">

                    {taskType === "sales"
                      ? `₹${assignedTarget}`
                      : `${assignedTarget} Deliveries`}

                  </p>

                </div>

              </div>

            )}

            {/* Status */}

            <div>

              <p className="text-sm text-gray-500 mb-3">
                Status
              </p>

              <span className="inline-flex px-5 py-2.5 rounded-full bg-red-100 text-red-700 text-sm font-semibold">
                Pending
              </span>

            </div>

            {/* ================= Sales ================= */}

            {taskType === "sales" && (

              <div>

                <label className="block text-sm font-medium mb-3">
                  Actual Sales
                </label>

                <input
                  type="number"
                  value={actualSales}
                  onChange={(e) =>
                    setActualSales(
                      e.target.value
                    )
                  }
                  placeholder="Enter today's sales"
                  className="w-full h-12 rounded-xl border border-gray-300 px-4"
                />

              </div>

            )}

            {/* ================= Delivery ================= */}

            {taskType === "delivery" && (

              <div>

                <label className="block text-sm font-medium mb-3">
                  Completed Deliveries
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
                  className="w-full h-12 rounded-xl border border-gray-300 px-4"
                />

              </div>

            )}

            {/* ===== Part B starts here ===== */}

                        {/* ================= Photo Proof ================= */}

            <div className="space-y-4">

              <h3 className="text-lg font-semibold">
                Photo Proof
              </h3>

              <div className="grid grid-cols-2 gap-4">

                <button
                  type="button"
                  onClick={() =>
                    cameraInput.current.click()
                  }
                  className="rounded-2xl border border-gray-200 p-5 flex flex-col items-center justify-center gap-3 active:scale-[0.98]"
                >
                  <Camera
                    size={30}
                    className="text-blue-600"
                  />

                  <span className="text-sm font-medium">
                    Take Photo
                  </span>

                </button>

                <button
                  type="button"
                  onClick={() =>
                    galleryInput.current.click()
                  }
                  className="rounded-2xl border border-gray-200 p-5 flex flex-col items-center justify-center gap-3 active:scale-[0.98]"
                >
                  <Image
                    size={30}
                    className="text-blue-600"
                  />

                  <span className="text-sm font-medium">
                    Gallery
                  </span>

                </button>

              </div>

              <input
                ref={cameraInput}
                hidden
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) =>
                  setPhoto(e.target.files?.[0] || null)
                }
              />

              <input
                ref={galleryInput}
                hidden
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setPhoto(e.target.files?.[0] || null)
                }
              />

              {photo && (

                <div className="rounded-2xl overflow-hidden border border-gray-200">

                  <img
                    src={URL.createObjectURL(photo)}
                    alt="Task Proof"
                    className="w-full h-64 object-cover"
                  />

                </div>

              )}

            </div>

            {/* ================= Remarks ================= */}

            <div>

              <label className="block text-lg font-semibold mb-3">
                Remarks
              </label>

              <textarea
                rows={5}
                value={note}
                onChange={(e) =>
                  setNote(e.target.value)
                }
                placeholder="Add remarks..."
                className="w-full rounded-2xl border border-gray-300 p-4 resize-none"
              />

            </div>

          </div>

          {/* ================= Sticky Footer ================= */}

          <div className="border-t bg-white shadow-[0_-6px_18px_rgba(0,0,0,0.08)] px-5 pt-5 pb-[calc(env(safe-area-inset-bottom)+20px)] space-y-3">

            <button
              onClick={() => {
                const updatedTask = {
                  ...task,
                  completed_quantity:
                    taskType === "sales"
                      ? Number(actualSales)
                      : taskType === "delivery"
                      ? Number(actualDeliveries)
                      : task.completed_quantity,

                  note,

                  photo,
                };

                onComplete(updatedTask);

                onClose();
              }}
              className="w-full h-14 rounded-2xl bg-green-600 hover:bg-green-700 text-white text-base font-semibold"
            >
              Mark Complete
            </button>

            <button
              onClick={onClose}
              className="w-full h-14 rounded-2xl border border-gray-300 font-medium"
            >
              Close
            </button>

          </div>

        </div>

      </div>

    </>
  );
}