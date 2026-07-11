import { useState } from "react";
import {
  Camera,
  CheckCircle2,
} from "lucide-react";

import PhotoTaskModal from "./PhotoTaskModal";

import Toast from "../../common/Toast";



export default function PendingTasks({
  tasks,
  onComplete,
}) {

  const [photoTask, setPhotoTask] = useState(null);
const [toastMessage, setToastMessage] = useState("");
  return (
    <>
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

        <div className="px-6 py-5 border-b">

          <h2 className="text-2xl font-bold">
            Pending Tasks
          </h2>

        </div>

        <table className="w-full">

          <thead className="bg-gray-50">

            <tr>

              <th className="text-left px-6 py-4">
                Task
              </th>

              <th className="text-right px-6 py-4">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {tasks.map((task) => (

              <tr
                key={task.id}
                className="border-t"
              >

                <td className="px-6 py-5 font-medium">

                  {task.title}

                </td>

                <td className="px-6 py-5">

                  <div className="flex justify-end gap-3">

                    {task.type === "photo" && (

                      <button
                        onClick={() => setPhotoTask(task)}
                        className="flex items-center gap-2 px-4 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
                      >

                        <Camera size={17} />

                        Upload Photo

                      </button>

                    )}

                    <button
                      onClick={() => {

  if (task.requiresPhoto && !task.photoUploaded) {

  setToastMessage("Please upload a photo before marking this task complete.");

setTimeout(() => {
  setToastMessage("");
}, 2500);

return;

  return;

}

  onComplete(task);

}}
                      className="flex items-center gap-2 px-4 h-10 rounded-xl bg-green-600 hover:bg-green-700 text-white"
                    >

                      <CheckCircle2 size={17} />

                      Mark Complete

                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>
        
      </div>

      <PhotoTaskModal
        open={photoTask !== null}
        task={photoTask}
        onClose={() => setPhotoTask(null)}
        onSubmit={(task) => {

  task.photoUploaded = true;

  onComplete(task);

  setPhotoTask(null);

}}
      />
      <Toast
  message={toastMessage}
  type="error"
/>

    </>
  );
}