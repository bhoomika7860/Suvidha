import {
  useEffect,
  useState,
} from "react";

import {
  Truck,
} from "lucide-react";

import SectionCard from "./SectionCard";
import dailyReportsService from "../../services/dailyReportsService";

export default function DeliverySection({
  report,
  refreshReport,
}) {
  const [deliveries, setDeliveries] =
    useState("");

  useEffect(() => {
    if (!report) {
      setDeliveries("");
      return;
    }

    setDeliveries(
      report.deliveries !== null &&
        report.deliveries !== undefined
        ? String(report.deliveries)
        : ""
    );
  }, [report]);

  async function handleSave() {
    if (!report || report.is_locked) {
      return;
    }

    const value =
      Number(deliveries || 0);

    if (value < 0) {
      alert(
        "Deliveries cannot be negative."
      );
      return;
    }

    try {
      await dailyReportsService.updateDeliveries(
        report.id,
        value
      );

      await refreshReport();

      alert(
        "Deliveries saved."
      );

    } catch (err) {
      console.error(
        "Failed to save deliveries:",
        err
      );

      alert(
        err.response?.data?.detail ||
          "Failed to save deliveries."
      );
    }
  }

  if (!report) {
    return null;
  }

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
            disabled={report.is_locked}
            onChange={(e) =>
              setDeliveries(
                e.target.value
              )
            }
            className="h-11 w-full rounded-xl border px-4 disabled:cursor-not-allowed disabled:bg-gray-100"
          />

        </div>

        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5">

          <p className="text-sm text-gray-500">
            Deliveries
          </p>

          <h2 className="mt-2 text-3xl font-bold text-violet-600">
            {Number(
              deliveries || 0
            )}
          </h2>

        </div>

      </div>

      <div className="mt-6 flex justify-end">

        <button
          type="button"
          onClick={handleSave}
          disabled={report.is_locked}
          className="h-11 rounded-xl bg-blue-600 px-8 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {report.is_locked
            ? "Report Locked"
            : "Save Deliveries"}
        </button>

      </div>

    </SectionCard>
  );
}