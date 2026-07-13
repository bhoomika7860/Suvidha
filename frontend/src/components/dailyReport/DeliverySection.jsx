import { useEffect, useState } from "react";
import { Truck } from "lucide-react";
import SectionCard from "./SectionCard";
import dailyReportsService from "../../services/dailyReportsService";

export default function DeliverySection() {
  const [report, setReport] = useState(null);

  const [deliveries, setDeliveries] = useState(0);

  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    async function load() {
      const today =
        await dailyReportsService.getTodayReport();

      setReport(today);
      setDeliveries(today.deliveries || 0);
    }

    load();
  }, []);

  async function handleSave() {
    try {
      await dailyReportsService.updateDeliveries(
        report.id,
        Number(deliveries)
      );

      alert("Deliveries updated.");
    } catch (err) {
      console.error(err);
    }
  }

  if (!report) return null;

  return (
    <SectionCard title="Deliveries">

      <div className="grid grid-cols-3 gap-6">

        <div className="border rounded-2xl bg-gray-50 p-5">

          <div className="flex items-center gap-2 mb-5">

            <Truck
              size={18}
              className="text-violet-600"
            />

            <h3 className="font-semibold text-gray-900">
              Delivery Summary
            </h3>

          </div>

          <label className="block text-sm font-medium mb-2">
            Deliveries Completed
          </label>

          <input
            type="number"
            value={deliveries}
            onChange={(e) =>
              setDeliveries(e.target.value)
            }
            className="w-full h-11 rounded-xl border border-gray-200 px-4 outline-none focus:border-blue-500"
          />

          <div className="mt-6 rounded-xl bg-white border border-gray-200 p-4">

            <p className="text-sm text-gray-500">
              Today's Deliveries
            </p>

            <h2 className="text-2xl font-bold text-violet-600 mt-2">
              {deliveries}
            </h2>

          </div>

        </div>

        <div className="col-span-2 border rounded-2xl bg-gray-50 p-5">

          <h3 className="font-semibold text-gray-900 mb-4">
            Delivery Remarks
          </h3>

          <textarea
            rows={6}
            value={remarks}
            onChange={(e) =>
              setRemarks(e.target.value)
            }
            placeholder="Optional remarks about today's deliveries..."
            className="w-full rounded-xl border border-gray-200 p-4 resize-none outline-none focus:border-blue-500"
          />

        </div>

      </div>

      <div className="flex justify-end mt-6">

        <button
          onClick={handleSave}
          className="h-11 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
        >
          Save Deliveries
        </button>

      </div>

    </SectionCard>
  );
}