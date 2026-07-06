import { ChevronRight } from "lucide-react";

import Card from "./shared/Card";
import SectionHeader from "./shared/SectionHeader";
import AdjBadge from "./shared/AdjBadge";

export default function AdjustmentHistory({ adjustments = [] }) {
  return (
    <Card className="p-6">
      <SectionHeader title="Adjustment History" sub="Correction requests & approvals" />

      <div className="flex flex-col gap-3">
        {adjustments.map((adjustment) => (
          <div
            key={adjustment.id}
            className="rounded-xl p-4 transition-all duration-150 hover:-translate-y-px"
            style={{ background: "#FAFAFA", border: "1px solid #E5E7EB" }}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-[13px] font-semibold leading-none mb-1" style={{ color: "#111827" }}>
                  {adjustment.field_name}
                </p>
                <p className="text-[11px]">
    {adjustment.reason}
</p>
              </div>

              <AdjBadge status={adjustment.status} />
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 rounded-lg px-3 py-2 text-center" style={{ background: "#FEF2F2" }}>
                <p className="text-[9px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: "#DC2626", opacity: 0.7, letterSpacing: "0.07em" }}>
                  Before
                </p>
                <p className="text-[13px] font-bold" style={{ color: "#DC2626" }}>{adjustment.old_value}</p>
              </div>

              <ChevronRight size={13} color="#6B7280" />

              <div className="flex-1 rounded-lg px-3 py-2 text-center" style={{ background: "#F0FDF4" }}>
                <p className="text-[9px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: "#16A34A", opacity: 0.7, letterSpacing: "0.07em" }}>
                  After
                </p>
                <p className="text-[13px] font-bold" style={{ color: "#16A34A" }}>{adjustment.new_value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
