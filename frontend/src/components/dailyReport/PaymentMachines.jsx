import { useEffect, useMemo, useState } from "react";
import paymentMachineService from "../../services/paymentMachineService";
import paymentMachineEntryService from "../../services/paymentMachineEntryService";

export default function PaymentMachines({
  reportId,
  onTotalChange,
  onMachinesChange,
}) {
  const [machines, setMachines] = useState([]);
  const [newMachine, setNewMachine] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  async function loadMachines() {
    if (!reportId) return;

    try {
      const machineList =
        await paymentMachineService.getMachines();

      const entries =
        await paymentMachineEntryService.get(reportId);

      const merged = machineList.map((machine) => {
        const existing = entries.find(
          (entry) => entry.machine_id === machine.id
        );

        return {
          ...machine,
          amount:
  existing?.amount !== undefined &&
  existing?.amount !== null
    ? String(existing.amount)
    : "",
        };
      });

      setMachines(merged);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadMachines();
  }, [reportId]);

  const total = useMemo(() => {
  return machines.reduce(
    (sum, machine) =>
      sum + Number(machine.amount || 0),
    0
  );
}, [machines]);

  useEffect(() => {
    onTotalChange?.(total);
  }, [total, onTotalChange]);

  useEffect(() => {
  onMachinesChange?.(
    machines.map((machine) => ({
      machine_id: machine.id,
      amount: Number(machine.amount || 0),
    }))
  );
}, [machines, onMachinesChange]);

  function changeAmount(id, value) {
  setMachines((prev) =>
    prev.map((machine) =>
      machine.id === id
        ? {
            ...machine,
            amount: value,
          }
        : machine
    )
  );
}

  async function addMachine() {
    if (!newMachine.trim()) return;

    try {
      await paymentMachineService.addMachine({
        machine_name: newMachine,
      });

      setNewMachine("");
      setShowAdd(false);

      await loadMachines();
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteMachine(id) {
    if (!window.confirm("Delete this machine?"))
      return;

    try {
      await paymentMachineService.deleteMachine(id);

      await loadMachines();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">

      <div className="mb-6 flex items-center justify-between">

        <h4 className="text-lg font-semibold text-gray-900">
          UPI / Card Payments
        </h4>

        <button
          onClick={() => setShowAdd(true)}
          className="rounded-lg border border-blue-600 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
        >
          + Machine
        </button>

      </div>

      {machines.map((machine) => (
        <div
          key={machine.id}
          className="mb-3 flex items-center gap-4 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3"
        >

          <div className="flex-1 font-medium">
            {machine.machine_name}
          </div>

          <input
            type="number"
            min="0"
            value={machine.amount}
            onChange={(e) =>
              changeAmount(
                machine.id,
                e.target.value
              )
            }
            className="h-10 w-36 rounded-lg border px-3 text-right"
          />

          <button
            onClick={() =>
              deleteMachine(machine.id)
            }
            className="rounded-lg p-2 text-red-500 hover:bg-red-50"
          >
            🗑
          </button>

        </div>
      ))}

      {showAdd && (
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-dashed border-blue-300 bg-blue-50 p-3">

          <input
            value={newMachine}
            onChange={(e) =>
              setNewMachine(e.target.value)
            }
            placeholder="Machine Name"
            className="h-10 flex-1 rounded-lg border px-3"
          />

          <button
            onClick={addMachine}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Add
          </button>

          <button
            onClick={() => {
              setShowAdd(false);
              setNewMachine("");
            }}
            className="rounded-lg border px-4 py-2 hover:bg-gray-100"
          >
            Cancel
          </button>

        </div>
      )}

      <div className="mt-6 border-t pt-5">

        <div className="flex items-center justify-between">

          <span className="text-base font-medium text-gray-700">
            Total Digital Collection
          </span>

          <span className="text-3xl font-bold text-blue-600">
            ₹{total.toLocaleString("en-IN")}
          </span>

        </div>

      </div>

    </div>
  );
}