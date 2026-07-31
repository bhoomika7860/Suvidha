import { Link } from "react-router-dom";

export default function UdhaarSection() {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">

      <div className="flex items-center justify-between">

        <div>
          <h2 className="text-xl font-bold">
            Udhaar
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Manage today's customer credit entries and repayments.
          </p>
        </div>

        <Link
          to="/manager/udhaar"
          className="rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-700"
        >
          Open Udhaar
        </Link>

      </div>

    </div>
  );
}