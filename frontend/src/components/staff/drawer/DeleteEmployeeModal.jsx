import { AlertTriangle } from "lucide-react";

export default function DeleteEmployeeModal({
  employee,
  onClose,
  onDelete,
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40">

      <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl">

        <div className="mb-6 flex items-center gap-4">

          <div className="rounded-2xl bg-red-100 p-3">
            <AlertTriangle
              className="text-red-600"
              size={24}
            />
          </div>

          <div>

            <h2 className="text-xl font-bold">
              Delete Employee
            </h2>

            <p className="mt-1 text-sm text-[#6B7280]">
              This action cannot be undone.
            </p>

          </div>

        </div>

        <div className="space-y-3 rounded-2xl border border-red-200 bg-red-50 p-4">

          <p className="text-sm text-[#374151]">

            <strong>
              {employee.full_name}
            </strong>{" "}
            will no longer be able to
            log into PharmaCore360.

          </p>

          <p className="text-sm text-[#374151]">

            Historical reports,
            purchases,
            expenses and audit logs
            will remain.

          </p>

        </div>

        <div className="mt-8 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="rounded-xl border border-[#E5E7EB] px-5 py-2.5"
          >
            Cancel
          </button>

          <button
            onClick={onDelete}
            className="rounded-xl bg-red-600 px-5 py-2.5 text-white hover:bg-red-700"
          >
            Delete Employee
          </button>

        </div>

      </div>

    </div>
  );
}