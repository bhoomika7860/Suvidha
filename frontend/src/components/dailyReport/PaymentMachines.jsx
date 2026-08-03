import { useEffect, useMemo, useState } from "react";
import paymentMachineService from "../../services/paymentMachineService";
import paymentMachineEntryService from "../../services/paymentMachineEntryService";

export default function PaymentMachines({
  reportId,
  onTotalChange,
}) {
  const [machines, setMachines] = useState([]);
  const [newMachine, setNewMachine] = useState("");

  async function loadMachines() {
  try {
    console.log("Loading machines...");
    console.log("Report ID:", reportId);

    const machineList =
  await paymentMachineService.getMachines();

console.log("Machine List:", machineList);
console.log("Is Array:", Array.isArray(machineList));
console.log("Length:", machineList.length);

    console.log("Machine List:", machineList);

    const entries =
      await paymentMachineEntryService.get(reportId);

    console.log("Entries:", entries);

    const merged = machineList.map((machine) => {
      const existing = entries.find(
        (entry) => entry.machine_id === machine.id
      );

      return {
        ...machine,
        amount: existing?.amount ?? 0,
      };
    });

    console.log("Merged:", merged);

    setMachines(merged);
  } catch (err) {
    console.error("PaymentMachines Error:", err);
  }
}

  useEffect(() => {
    if (reportId) {
      loadMachines();
    }
  }, [reportId]);

  const total = useMemo(() => {
    return machines.reduce(
      (sum, machine) =>
        sum + Number(machine.amount || 0),
      0
    );
  }, [machines]);

  useEffect(() => {
    onTotalChange(total);
  }, [total]);

  function changeAmount(id, value) {
    setMachines((prev) =>
      prev.map((machine) =>
        machine.id === id
          ? {
              ...machine,
              amount: Number(value),
            }
          : machine
      )
    );
  }

  async function addMachine() {
    if (!newMachine.trim()) return;

    await paymentMachineService.addMachine({
      machine_name: newMachine,
    });

    setNewMachine("");

    loadMachines();
  }

  async function deleteMachine(id) {
    if (
      !window.confirm(
        "Delete this machine?"
      )
    )
      return;

    await paymentMachineService.deleteMachine(
      id
    );

    loadMachines();
  }

  async function saveMachines() {
    await paymentMachineEntryService.save({
      daily_report_id: reportId,
      entries: machines.map((machine) => ({
        machine_id: machine.id,
        amount: Number(machine.amount),
      })),
    });
  }

  return (
  <>
    <div className="mb-4 rounded-lg bg-red-500 p-4 text-white text-xl font-bold">
      PAYMENT MACHINES COMPONENT LOADED
    </div>
    <div className="rounded-2xl border bg-white p-5">

      <div className="mb-5 flex items-center justify-between">

        <h3 className="text-lg font-semibold">
          Payment Machines
        </h3>

        <button
          onClick={saveMachines}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white"
        >
          Save Machines
        </button>

      </div>

      <div className="space-y-3">

        {machines.map((machine) => (

          <div
            key={machine.id}
            className="flex items-center gap-3"
          >

            <div className="flex-1 font-medium">
              {machine.machine_name}
            </div>

            <input
              type="number"
              value={machine.amount}
              onChange={(e) =>
                changeAmount(
                  machine.id,
                  e.target.value
                )
              }
              className="h-10 w-36 rounded-lg border px-3"
            />

            <button
              onClick={() =>
                deleteMachine(machine.id)
              }
              className="rounded-lg bg-red-600 px-3 py-2 text-white"
            >
              Delete
            </button>

          </div>

        ))}

      </div>

      <div className="mt-6 flex gap-3">

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
          className="rounded-lg bg-green-600 px-5 text-white"
        >
          Add Machine
        </button>

      </div>

      <div className="mt-6 rounded-xl bg-blue-50 p-4">

        <div className="flex justify-between">

          <span className="font-medium">
            Machine Total
          </span>

          <span className="text-xl font-bold text-blue-600">
            ₹{total.toLocaleString("en-IN")}
          </span>

        </div>

      </div>

    </div>
      </>
  );
}