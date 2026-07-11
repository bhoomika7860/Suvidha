import {
  AlertCircle,
  CheckCircle2,
  Lock,
} from "lucide-react";

export default function ReviewSection() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-xl font-semibold text-gray-900">
            Review & Submit
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Verify today's report before final submission.
          </p>

        </div>

        <div className="flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-4 py-2 text-sm font-medium">

          <Lock size={15} />

          Report will lock after submission

        </div>

      </div>

      {/* Status */}

      <div className="grid grid-cols-2 gap-5 mt-6">

        {/* Completed */}

        <div className="rounded-2xl border border-green-200 bg-green-50 p-5">

          <div className="flex items-center gap-2 mb-4">

            <CheckCircle2
              size={20}
              className="text-green-600"
            />

            <h3 className="font-semibold text-green-700">
              Completed (3)
            </h3>

          </div>

          <ul className="space-y-2 text-sm text-gray-700">

            <li>✓ Sales</li>

            <li>✓ Expenses</li>

            <li>✓ Purchases</li>

          </ul>

        </div>

        {/* Remaining */}

        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5">

          <div className="flex items-center gap-2 mb-4">

            <AlertCircle
              size={20}
              className="text-orange-600"
            />

            <h3 className="font-semibold text-orange-700">
              Remaining (3)
            </h3>

          </div>

          <ul className="space-y-2 text-sm text-gray-700">

            <li>• Deliveries</li>

            <li>• Bounced Products</li>

            <li>• Notes</li>

          </ul>

        </div>

      </div>

      {/* Footer */}

      <div className="mt-8 flex items-center justify-between border-t pt-5">

        <p className="text-sm text-gray-500">
          Complete all pending sections to enable report submission.
        </p>

        <div className="flex gap-3">

          <button className="h-11 px-6 rounded-xl border border-gray-200 hover:bg-gray-50 transition">

            Save Draft

          </button>

          <button className="w-60 h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition">

            Submit Daily Report

          </button>

        </div>

      </div>

    </div>
  );
}