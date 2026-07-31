import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import SectionCard from "./SectionCard";
import dailyReportsService from "../../services/dailyReportsService";

export default function UdhaarSection() {
  const [report, setReport] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await dailyReportsService.getTodayReport();
        setReport(data);
      } catch (err) {
        console.error(err);
      }
    }

    load();
  }, []);

  if (!report) return null;

  return (
    <SectionCard title="Udhaar">
      <div className="flex items-center justify-between">

        <div>
          <h3 className="text-lg font-semibold">
            Today's Udhaar
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Customer credit entries are managed from the Udhaar module.
          </p>
        </div>

        <Link
          to="/manager/udhaar"
          className="flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-2.5 font-medium hover:bg-gray-50"
        >
          Open Udhaar
          <ArrowRight size={18} />
        </Link>

      </div>

      <div className="mt-8 flex justify-end">

        <div className="rounded-xl border border-blue-200 bg-blue-50 px-6 py-5 min-w-[190px]">

          <p className="text-sm text-blue-700">
            Total Udhaar
          </p>

          <h2 className="mt-2 text-3xl font-bold text-blue-600">
            ₹{Number(report.udhaar_sales || 0).toLocaleString("en-IN")}
          </h2>

        </div>

      </div>
    </SectionCard>
  );
}