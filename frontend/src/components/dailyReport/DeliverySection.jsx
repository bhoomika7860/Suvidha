import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, Truck } from "lucide-react";

import SectionCard from "./SectionCard";
import dailyReportsService from "../../services/dailyReportsService";
import deliveryAssignmentService from "../../services/deliveryAssignmentService";

export default function DeliverySection() {
  const [report, setReport] = useState(null);

  const [deliveryBoys, setDeliveryBoys] = useState([]);

  const [rows, setRows] = useState([
    {
      delivery_boy_id: "",
      deliveries_completed: "",
    },
  ]);

  async function load() {
    try {
      const today =
        await dailyReportsService.getTodayReport();

      setReport(today);

      const boys =
        await deliveryAssignmentService.getDeliveryBoys();
        console.log("Delivery Boys:", boys);
      setDeliveryBoys(boys);

      const assignments =
        await deliveryAssignmentService.getAssignments(
          today.id
        );

      if (assignments.length > 0) {
        setRows(
          assignments.map((assignment) => ({
            delivery_boy_id:
              assignment.delivery_boy_id,
            deliveries_completed:
              assignment.deliveries_completed,
          }))
        );
      } else {
        setRows([
          {
            delivery_boy_id: "",
            deliveries_completed: "",
          },
        ]);
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const totalDeliveries = useMemo(() => {
    return rows.reduce(
      (sum, row) =>
        sum + Number(row.deliveries_completed || 0),
      0
    );
  }, [rows]);

  function addRow() {
    setRows([
      ...rows,
      {
        delivery_boy_id: "",
        deliveries_completed: "",
      },
    ]);
  }

  function updateRow(index, field, value) {
  console.log("Typing:", value);

  const updated = [...rows];

  updated[index] = {
    ...updated[index],
    [field]: value,
  };

  console.log(updated);

  setRows(updated);
}

  async function handleSave() {
    try {
      for (const row of rows) {
        if (!row.delivery_boy_id) continue;

        await deliveryAssignmentService.createAssignment({
          daily_report_id: report.id,
          delivery_boy_id: Number(row.delivery_boy_id),
          deliveries_completed: Number(
            row.deliveries_completed
          ),
        });
      }

      await dailyReportsService.updateDeliveries(
        report.id,
        totalDeliveries
      );

      await load();

      alert("Deliveries saved.");
    } catch (err) {
      console.error(err);
    }
  }

  if (!report) return null;

  console.log(rows);

  return (
    <SectionCard title="Deliveries">
      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Truck
              size={18}
              className="text-violet-600"
            />

            <h3 className="font-semibold">
              Delivery Summary
            </h3>

            
          </div>

          <button
            onClick={addRow}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            <Plus size={16} />
            Add Delivery Boy
          </button>
        </div>

        <div className="space-y-3">
          {rows.map((row, index) => {
            const selectedIds = rows
              .filter((_, i) => i !== index)
              .map((r) => Number(r.delivery_boy_id));

            return (
              <div
                key={index}
                className="grid grid-cols-12 gap-3 items-center"
              >
                <select
                  value={row.delivery_boy_id}
                  onChange={(e) =>
                    updateRow(
                      index,
                      "delivery_boy_id",
                      e.target.value
                    )
                  }
                  className="col-span-6 h-11 rounded-xl border border-gray-200 px-4"
                >
                  <option value="">
                    Select Delivery Boy
                  </option>

                  {deliveryBoys
                    .filter(
                      (boy) =>
                        !selectedIds.includes(boy.id) ||
                        boy.id ===
                          Number(row.delivery_boy_id)
                    )
                    .map((boy) => (
                      <option
                        key={boy.id}
                        value={boy.id}
                      >
                        {boy.full_name}
                      </option>
                    ))}
                </select>

                <input
  value={row.deliveries_completed}
  onChange={(e) => {
    console.log("typing", e.target.value);

    setRows((prev) =>
      prev.map((r, i) =>
        i === index
          ? {
              ...r,
              deliveries_completed: e.target.value,
            }
          : r
      )
    );
  }}
  className="col-span-5 h-11 border-2 border-red-500 rounded-xl px-4"
/>

                <button
                  onClick={() =>
                    removeRow(index)
                  }
                  className="flex justify-center"
                >
                  <Trash2
                    size={18}
                    className="text-red-500"
                  />
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">
            Today's Deliveries
          </p>

          <h2 className="mt-2 text-3xl font-bold text-violet-600">
            {totalDeliveries}
          </h2>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          className="h-11 rounded-xl bg-blue-600 px-8 font-medium text-white hover:bg-blue-700"
        >
          Save Deliveries
        </button>
      </div>
    </SectionCard>
  );
}