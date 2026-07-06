import { AlertTriangle, ClipboardList, Package, Truck } from "lucide-react";

import Card from "./shared/Card";
import SectionHeader from "./shared/SectionHeader";

export default function OperationalSummary({ items = [] }) {
  return (
    <Card className="p-5">
      <SectionHeader title="Operational Summary" sub="Today at a glance" />

      <div className="grid grid-cols-2 gap-3">
        {items.map((tile) => {
          const Icon = tile.icon || Truck;

          return (
            <div
              key={tile.label}
              className="rounded-xl p-3.5"
              style={{ background: "#FAFAFA", border: "1px solid #E5E7EB" }}
            >
              <div className="w-6 h-6 rounded-md flex items-center justify-center mb-2.5" style={{ background: tile.iconBg || "#EFF6FF" }}>
                <span style={{ color: tile.iconColor || "#2563EB" }}>
                  <Icon size={13} />
                </span>
              </div>

              <p className="text-[11px] font-medium mb-1" style={{ color: "#6B7280" }}>{tile.label}</p>
              <p className="text-[17px] font-bold leading-none mb-0.5" style={{ color: "#111827" }}>{tile.value}</p>
              <p className="text-[11px]" style={{ color: "#6B7280" }}>{tile.sub}</p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
