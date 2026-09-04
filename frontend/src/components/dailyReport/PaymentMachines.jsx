import {
  useEffect,
  useMemo,
  useState,
} from "react";

import paymentMachineService from "../../services/paymentMachineService";
import paymentMachineEntryService from "../../services/paymentMachineEntryService";

const NUMBER_INPUT_CLASS =
  "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

function handleNumberWheel(e) {
  e.currentTarget.blur();
}

export default function PaymentMachines({
  reportId,
  onTotalChange,
  onMachinesChange,
}) {
  const [machines, setMachines] = useState([]);
  const [newMachine, setNewMachine] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  async function loadMachines() {
    if (!reportId) {
      return;
    }

    try {
      const machineList =
        await paymentMachineService.getMachines();

      const entries =
        await paymentMachineEntryService.get(reportId);

      const merged = machineList.map((machine) => {
        const existing = entries.find(
          (entry) =>
            entry.machine_id === machine.id
        );

        const savedAmount =
          existing?.amount !== undefined &&
          existing?.amount !== null
            ? Number(existing.amount)
            : 0;

        return {
          ...machine,
          amount:
            savedAmount > 0
              ? String(savedAmount)
              : "",
        };
      });

      setMachines(merged);
    } catch (err) {
      console.error(
        "Failed to load payment machines:",
        err
      );
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
    if (!newMachine.trim()) {
      return;
    }

    try {
      await paymentMachineService.addMachine({
        machine_name: newMachine,
      });

      setNewMachine("");
      setShowAdd(false);

      await loadMachines();
    } catch (err) {
      console.error(
        "Failed to add payment machine:",
        err
      );
    }
  }

  async function deleteMachine(id) {
    if (
      !window.confirm(
        "Delete this machine?"
      )
    ) {
      return;
    }

    try {
      await paymentMachineService.deleteMachine(id);

      await loadMachines();
    } catch (err) {
      console.error(
        "Failed to delete payment machine:",
        err
      );
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-3 sm:p-6">

      {/* HEADER */}

      <div className="mb-3 flex items-center justify-between gap-3 sm:mb-6">

        <h4 className="text-base font-semibold text-gray-900 sm:text-lg">
          UPI / Card Payments
        </h4>

        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="shrink-0 rounded-lg border border-blue-600 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 sm:px-3 sm:py-2 sm:text-sm"
        >
          + Machine
        </button>

      </div>


      {/* MACHINES */}

      {machines.map((machine) => (
        <div
          key={machine.id}
          className="mb-2 rounded-xl border border-gray-200 bg-gray-50 p-2.5 sm:mb-3 sm:flex sm:items-center sm:gap-4 sm:px-4 sm:py-3"
        >

          {/* MACHINE NAME */}

          <div className="mb-2 min-w-0 truncate text-sm font-medium text-gray-900 sm:mb-0 sm:flex-1">
            {machine.machine_name}
          </div>


          {/* AMOUNT + DELETE */}

          <div className="flex items-center gap-2">

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
              onWheel={handleNumberWheel}
              placeholder="Amount"
              className={`${NUMBER_INPUT_CLASS} h-9 min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-2.5 text-right text-sm font-medium outline-none focus:border-blue-500 sm:h-9 sm:w-28 sm:flex-none sm:px-2 sm:text-base`}
            />

            <button
              type="button"
              onClick={() =>
                deleteMachine(machine.id)
              }
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm text-red-500 hover:bg-red-50"
              aria-label={`Delete ${machine.machine_name}`}
            >
              🗑
            </button>

          </div>

        </div>
      ))}


      {/* ADD MACHINE */}

      {showAdd && (
        <div className="mt-3 flex flex-col gap-2 rounded-xl border border-dashed border-blue-300 bg-blue-50 p-2.5 sm:mt-4 sm:flex-row sm:items-center sm:gap-3 sm:p-3">

          <input
            value={newMachine}
            onChange={(e) =>
              setNewMachine(e.target.value)
            }
            placeholder="Machine Name"
            className="h-9 min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-blue-500"
          />

          <div className="flex gap-2">

            <button
              type="button"
              onClick={addMachine}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-1.5 text-sm text-white hover:bg-blue-700 sm:flex-none"
            >
              Add
            </button>

            <button
              type="button"
              onClick={() => {
                setShowAdd(false);
                setNewMachine("");
              }}
              className="flex-1 rounded-lg border px-4 py-1.5 text-sm hover:bg-gray-100 sm:flex-none"
            >
              Cancel
            </button>

          </div>

        </div>
      )}


      {/* TOTAL */}

      <div className="mt-4 border-t pt-3 sm:mt-6 sm:pt-5">

        <div className="flex items-center justify-between gap-3">

          <span className="text-sm font-medium text-gray-700 sm:text-base">
            Total Digital Collection
          </span>

          <span className="shrink-0 text-2xl font-bold text-blue-600 sm:text-3xl">
            ₹{total.toLocaleString("en-IN")}
          </span>

        </div>

      </div>

    </div>
  );
}