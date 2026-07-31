import { useEffect, useState } from "react";
import deliveryService from "../../services/deliveryService";

import DeliveryHeader from "../../components/delivery/DeliveryHeader";
import TargetCard from "../../components/delivery/TargetCard";
import CompletedDeliveryCard from "../../components/delivery/CompletedDeliveryCard";

export default function Delivery() {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadTask() {
    try {
      setLoading(true);

      const deliveryTask =
        await deliveryService.getTodayDeliveryTask();

      setTask(deliveryTask);
    } catch (err) {
      console.error(err);
      setTask(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTask();
  }, []);

  if (loading) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50">

      <DeliveryHeader />

      <div className="p-4 space-y-5">

        <TargetCard task={task} />

        <CompletedDeliveryCard
          task={task}
          onSubmitted={loadTask}
        />

      </div>

    </div>
  );
}