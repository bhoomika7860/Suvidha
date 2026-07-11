import { FileText } from "lucide-react";
import SectionCard from "./SectionCard";

export default function NotesSection() {
  return (
    <SectionCard title="Manager Notes">

      <div className="flex items-start gap-4">

        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">

          <FileText
            size={18}
            className="text-slate-600"
          />

        </div>

        <div className="flex-1">

          <h3 className="font-semibold text-gray-900">
            Notes for the Owner
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            Mention stock issues, supplier delays, staff updates or anything important
            the owner should know before reviewing today's report.
          </p>

        </div>

      </div>

      <div className="mt-5">

        <textarea
          rows={6}
          placeholder="Example: Cipla delivery was delayed by 2 hours. Customer demand for Dolo 650 was high today..."
          className="w-full rounded-2xl border border-gray-200 p-4 resize-none outline-none focus:border-blue-500 transition"
        />

      </div>

      <div className="flex justify-between items-center mt-5">

        <p className="text-xs text-gray-400">
          This note will be visible to the Store Owner.
        </p>

        <button className="h-11 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition">

          Save Notes

        </button>

      </div>

    </SectionCard>
  );
}