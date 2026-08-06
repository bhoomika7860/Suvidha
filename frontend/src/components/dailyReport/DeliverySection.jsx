import { useEffect, useState } from "react";
import { Truck } from "lucide-react";

import SectionCard from "./SectionCard";
import dailyReportsService from "../../services/dailyReportsService";

export default function DeliverySection({
  report,
  refreshReport,
}) {
  const [deliveries, setDeliveries] = useState(0);

  useEffect(() => {
    if (!report) return;

    setDeliveries(report.deliveries || 0);
  }, [report]);

  async function handleSave() {
    try {
      await dailyReportsService.updateDeliveries(
        report.id,
        Number(deliveries)
      );

      await refreshReport();

      alert("Deliveries saved.");
    } catch (err) {
      console.error(err);
    }
  }

  if (!report) return null;

  return (
    <SectionCard title="Deliveries">
      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">

        <div className="mb-5 flex items-center gap-2">

          <Truck
            size={18}
            className="text-violet-600"
          />

          <h3 className="font-semibold">
            Deliveries
          </h3>

        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">

          <label className="mb-2 block font-medium">
            Total Deliveries
          </label>

          <input
            type="number"
            min="0"
            value={deliveries}
            onChange={(e) =>
              setDeliveries(e.target.value)
            }
            className="h-11 w-full rounded-xl border px-4"
          />

        </div>

        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5">

          <p className="text-sm text-gray-500">
            Deliveries
          </p>

          <h2 className="mt-2 text-3xl font-bold text-violet-600">
            {Number(deliveries)}
          </h2>

        </div>

      </div>

      <div className="mt-6 flex justify-end">

        <button
          onClick={handleSave}
          className="h-11 rounded-xl bg-blue-600 px-8 font-medium text-white hover:bg-blue-700"
        >
          Save Deliveries
        </button>

      </div>

    </SectionCard>
  );
}