import { Receipt, CreditCard } from "lucide-react";
import SectionCard from "./SectionCard";

export default function SalesSection() {
  return (
    <SectionCard title="Sales">

      <div className="grid grid-cols-3 gap-6">

        {/* Payment Breakdown */}

        <div className="col-span-2 border rounded-2xl p-5 bg-gray-50">

          <div className="flex items-center gap-2 mb-5">

            <CreditCard
              size={18}
              className="text-blue-600"
            />

            <h3 className="font-semibold text-gray-900">
              Payment Breakdown
            </h3>

          </div>

          <div className="grid grid-cols-2 gap-5">

            <div>

              <label className="block text-sm font-medium mb-2">
                Cash Sales
              </label>

              <input
                type="number"
                placeholder="₹ 0"
                className="w-full h-11 rounded-xl border border-gray-200 px-4 outline-none focus:border-blue-500"
              />

            </div>

            <div>

              <label className="block text-sm font-medium mb-2">
                UPI Sales
              </label>

              <input
                type="number"
                placeholder="₹ 0"
                className="w-full h-11 rounded-xl border border-gray-200 px-4 outline-none focus:border-blue-500"
              />

            </div>

            <div>

              <label className="block text-sm font-medium mb-2">
                Card Sales
              </label>

              <input
                type="number"
                placeholder="₹ 0"
                className="w-full h-11 rounded-xl border border-gray-200 px-4 outline-none focus:border-blue-500"
              />

            </div>

            <div>

              <label className="block text-sm font-medium mb-2">
                Udhaar Sales
              </label>

              <input
                type="number"
                placeholder="₹ 0"
                className="w-full h-11 rounded-xl border border-gray-200 px-4 outline-none focus:border-blue-500"
              />

            </div>

          </div>

        </div>

        {/* Billing Summary */}

        <div className="border rounded-2xl p-5 bg-gray-50">

          <div className="flex items-center gap-2 mb-5">

            <Receipt
              size={18}
              className="text-green-600"
            />

            <h3 className="font-semibold text-gray-900">
              Billing
            </h3>

          </div>

          <label className="block text-sm font-medium mb-2">
            Total Bills
          </label>

          <input
            type="number"
            placeholder="0"
            className="w-full h-11 rounded-xl border border-gray-200 px-4 outline-none focus:border-blue-500"
          />

          <div className="mt-6 rounded-xl bg-white border border-gray-200 p-4">

            <p className="text-sm text-gray-500">
              Estimated Total Sales
            </p>

            <h2 className="text-2xl font-bold text-blue-600 mt-2">
              ₹54,100
            </h2>

          </div>

        </div>

      </div>

      <div className="flex justify-end mt-6">

        <button className="h-11 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition">

          Save Sales

        </button>

      </div>

    </SectionCard>
  );
}