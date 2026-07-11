import { CheckCircle2 } from "lucide-react";

export default function CompletedTasks({
  tasks,
}) {

  return (

    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

      <div className="px-6 py-5 border-b">

        <h2 className="text-2xl font-bold">
          Completed Tasks
        </h2>

      </div>

      {tasks.length === 0 ? (

        <div className="py-14 text-center text-gray-500">

          No completed tasks yet.

        </div>

      ) : (

        <table className="w-full">

          <thead className="bg-gray-50">

            <tr>

              <th className="text-left px-6 py-4">

                Task

              </th>

              <th className="text-right px-6 py-4">

                Status

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

                <td className="px-6 py-5 text-right">

                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700">

                    <CheckCircle2 size={16} />

                    Completed

                  </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      )}

    </div>

  );

}