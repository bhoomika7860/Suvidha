import { useState } from "react";

import Card from "./shared/Card";
import PriorityChip from "./shared/PriorityChip";
import StatusChip from "./shared/StatusChip";

export default function BouncedProducts({ rows = [], title = "Bounced Products", sub = "Items flagged for follow-up" }) {
  const [hoverRow, setHoverRow] = useState(null);

  return (
    <Card className="mb-5 overflow-hidden">
      <div className="px-6 py-4 flex items-center justify-between border-b" style={{ borderColor: "#E5E7EB" }}>
        <div>
          <h2 className="text-[15px] font-semibold" style={{ color: "#111827" }}>{title}</h2>
          <p className="text-[12px] mt-0.5" style={{ color: "#6B7280" }}>{sub}</p>
        </div>

        <span className="text-[11px] font-semibold px-2.5 py-1.5 rounded-lg" style={{ background: "#FEF2F2", color: "#DC2626" }}>
          Needs Attention
        </span>
      </div>

      <table className="w-full">
        <thead>
          <tr style={{ background: "#FAFAFA" }}>
            {['Medicine', 'Quantity', 'Status'].map((header) => (
              <th
                key={header}
                className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider"
                style={{ color: "#6B7280", letterSpacing: "0.065em" }}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
  {rows.map((row) => (
    <tr
      key={row.id}
      className="border-t"
      style={{ borderColor: "#E5E7EB" }}
    >
      <td className="px-6 py-3">
        {row.product_name}
      </td>

      <td className="px-6 py-3">
        {row.quantity}
      </td>

      <td className="px-6 py-3">
        <StatusChip status="Pending" />
      </td>
    </tr>
  ))}
</tbody>
      </table>
    </Card>
  );
}
