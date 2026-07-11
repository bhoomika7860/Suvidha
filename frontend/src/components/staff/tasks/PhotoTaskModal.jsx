import { useState } from "react";
import { Camera, X } from "lucide-react";

export default function PhotoTaskModal({
  open,
  task,
  onClose,
  onSubmit,
}) {

  const [note, setNote] = useState("");

  if (!open) return null;

  function handleSubmit() {

    onSubmit({
  ...task,
  note,
  photoUploaded: true,
});

    setNote("");

  }

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 z-40"
      />

      <div className="fixed inset-0 flex items-center justify-center z-50">

        <div className="w-[560px] bg-white rounded-2xl shadow-xl">

          <div className="flex justify-between items-center border-b px-6 py-5">

            <div>

              <h2 className="text-2xl font-bold">
                Upload Task Photo
              </h2>

              <p className="text-gray-500 mt-1">
                {task?.title}
              </p>

            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <X />
            </button>

          </div>

          <div className="p-6 space-y-5">

            <div>

              <label className="block font-medium mb-2">
                Upload Photo
              </label>

              <div className="h-48 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center">

                <Camera
                  size={42}
                  className="text-gray-400"
                />

                <p className="text-gray-500 mt-3">

                  Image upload will be connected later

                </p>

              </div>

            </div>

            <div>

              <label className="block font-medium mb-2">

                Note (Optional)

              </label>

              <textarea
                rows={4}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full border rounded-xl p-3 resize-none"
                placeholder="Add any remarks..."
              />

            </div>

            <button
              onClick={handleSubmit}
              className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >

              Submit Task

            </button>

          </div>

        </div>

      </div>
    </>
  );
}