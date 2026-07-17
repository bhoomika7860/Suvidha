import { useEffect, useState } from "react";
import deliveryService from "../../services/deliveryService";

export default function TargetCard() {
  const [completed, setCompleted] = useState(0);
  const [target, setTarget] = useState(0);

  useEffect(() => {
    loadTarget();
  }, []);

  async function loadTarget() {
    try {
      const deliveries =
        await deliveryService.getDeliveries();

      const total = deliveries.length;

      const completedCount = deliveries.filter(
        (delivery) =>
          delivery.status === "completed"
      ).length;

      setTarget(total);
      setCompleted(completedCount);

    } catch (err) {
      console.error(err);
    }
  }

  const percent =
    target === 0
      ? 0
      : (completed / target) * 100;

  return (
    <div className="bg-white rounded-2xl border shadow-sm p-5">

      <h2 className="text-lg font-bold">
        Today's Target
      </h2>

      <p className="text-gray-500 mt-1">
        {completed} of {target} Deliveries
      </p>

      <div className="mt-4 h-3 rounded-full bg-gray-200 overflow-hidden">

        <div
          className="h-3 rounded-full bg-blue-600"
          style={{
            width: `${percent}%`,
          }}
        />

      </div>

      <h3 className="mt-4 text-3xl font-bold text-blue-600">
        {Math.round(percent)}%
      </h3>

    </div>
  );
}