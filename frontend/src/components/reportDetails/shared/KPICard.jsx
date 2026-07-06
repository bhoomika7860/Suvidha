import Card from "./Card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function KPICard({ icon, label, value, trend, dir }) {
  const TrendIcon = dir === "up" ? TrendingUp : dir === "down" ? TrendingDown : Minus;
  const trendColor = dir === "up" ? "#16A34A" : dir === "down" ? "#DC2626" : "#6B7280";

  return (
    <Card className="flex-1 p-5 transition-all duration-150 hover:-translate-y-px cursor-default">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#EFF6FF" }}>
          <span style={{ color: "#2563EB" }}>{icon}</span>
        </div>
        <span className="text-[11px] font-medium uppercase tracking-wider" style={{ color: "#6B7280", letterSpacing: "0.07em" }}>
          {label}
        </span>
      </div>

      <p className="text-[26px] font-bold leading-none mb-2" style={{ color: "#111827" }}>
        {value}
      </p>

      <div className="flex items-center gap-1">
        <TrendIcon size={11} color={trendColor} />
        <span className="text-[11px] font-medium" style={{ color: trendColor }}>
          {trend}
        </span>
      </div>
    </Card>
  );
}