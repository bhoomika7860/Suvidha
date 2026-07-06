import { FileText } from "lucide-react";

import Card from "./shared/Card";

export default function StoreNotes({ title = "Store Notes", note, author = "Rajesh Agarwal", time = "9:12 PM" }) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: "#EFF6FF" }}>
          <FileText size={12} color="#2563EB" />
        </div>
        <div>
          <h2 className="text-[15px] font-semibold leading-none" style={{ color: "#111827" }}>{title}</h2>
          <p className="text-[11px] mt-0.5" style={{ color: "#6B7280" }}>
            Executive memo from {author} · {time}
          </p>
        </div>
      </div>

      <div className="rounded-xl p-5" style={{ background: "#FAFAFA", border: "1px solid #E5E7EB" }}>
        <p className="text-[13.5px] leading-[1.8]" style={{ color: "#111827" }}>
          {note}
        </p>
      </div>
    </Card>
  );
}
