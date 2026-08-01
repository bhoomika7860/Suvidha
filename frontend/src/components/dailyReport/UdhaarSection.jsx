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

      
    </SectionCard>
  );
}