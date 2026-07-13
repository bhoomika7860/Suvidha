import { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import SectionCard from "./SectionCard";
import dailyReportsService from "../../services/dailyReportsService";

export default function NotesSection() {
  const [report, setReport] = useState(null);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    async function load() {
      const data =
        await dailyReportsService.getTodayReport();

      setReport(data);
      setNotes(data.notes || "");
    }

    load();
  }, []);

  async function saveNotes() {
    await dailyReportsService.updateNotes(
      report.id,
      notes
    );

    alert("Notes saved.");
  }

  if (!report) return null;

  return (
    <SectionCard title="Manager Notes">

      <div className="flex items-start gap-4">

        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">

          <FileText
            size={18}
            className="text-slate-600"
          />

        </div>

        <div className="flex-1">

          <h3 className="font-semibold">
            Notes for the Owner
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            Mention stock issues, supplier delays, staff updates or anything important the owner should know.
          </p>

        </div>

      </div>

      <div className="mt-5">

        <textarea
          rows={6}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full rounded-2xl border border-gray-200 p-4 resize-none outline-none focus:border-blue-500"
        />

      </div>

      <div className="flex justify-between items-center mt-5">

        <p className="text-xs text-gray-400">
          This note will be visible to the Store Owner.
        </p>

        <button
          onClick={saveNotes}
          className="h-11 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
        >
          Save Notes
        </button>

      </div>

    </SectionCard>
  );
}