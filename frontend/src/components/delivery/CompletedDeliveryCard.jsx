import { useEffect, useState } from "react";
import deliveryService from "../../services/deliveryService";

export default function CompletedDeliveryCard({
  task,
  onSubmitted,
}) {
  const [completed, setCompleted] = useState("");
  const [saving, setSaving] = useState(false);

const alreadySubmitted =
  task?.status === "completed";

  useEffect(() => {
    if (task) {
      setCompleted(task.completed_quantity ?? 0);
    }
  }, [task]);

  if (!task) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border p-5">
        <p className="text-center text-gray-500">
          No delivery task assigned for today.
        </p>
      </div>
    );
  }

  async function submit() {
    const value = Number(completed);

    if (isNaN(value)) {
      alert("Please enter a valid number.");
      return;
    }

    if (value < 0) {
      alert("Completed deliveries cannot be negative.");
      return;
    }

    if (value > task.target_quantity) {
      alert(
        `Completed deliveries cannot exceed today's target (${task.target_quantity}).`
      );
      return;
    }

    try {
      setSaving(true);

      await deliveryService.submitCompletedDeliveries(
        task.id,
        value
      );

      if (onSubmitted) {
        await onSubmitted();
      }

      alert("Deliveries submitted successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to submit deliveries.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border shadow-sm p-5">

      <h2 className="text-lg font-bold">
        Completed Deliveries
      </h2>

      <p className="text-gray-500 mt-1">
        Enter the number of deliveries completed today.
      </p>

      <input
  type="number"
  min={0}
  max={task.target_quantity}
  value={completed}
  disabled={alreadySubmitted}
  onChange={(e) => setCompleted(e.target.value)}
  className="mt-5 w-full rounded-xl border border-gray-300 p-4 text-center text-3xl font-bold outline-none disabled:bg-gray-100 disabled:text-gray-500"
/>

      <button
  onClick={submit}
  disabled={saving || alreadySubmitted}
  className="mt-5 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
>
  {alreadySubmitted
    ? "Already Submitted"
    : saving
    ? "Submitting..."
    : "Submit"}
</button>

    </div>
  );
}