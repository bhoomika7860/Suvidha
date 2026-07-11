import { useEffect, useMemo, useState } from "react";
import { staffService } from "../../services/staffService";
import storeService from "../../services/storeService";

export default function AssignTaskModal({
  open,
  onClose,
  onSave,
}) {
  const [form, setForm] = useState({
    employee: "",
    role: "",
    store: "",
    task: "",
    type: "normal",
    target: "",
    due: "",
    requiresPhoto: false,
  });

  const [stores, setStores] = useState([]);
const [employees, setEmployees] = useState([]);

  useEffect(() => {
  if (!open) return;

  async function loadData() {
    try {
      const [storesData, usersData] = await Promise.all([
        storeService.getStores(),
        staffService.getUsers(),
      ]);

      setStores(storesData);
      setEmployees(usersData);
    } catch (err) {
      console.error(err);
    }
  }

  loadData();
}, [open]);


const filteredEmployees = useMemo(() => {
  if (!form.role) return [];

  const backendRole =
    form.role === "Store Manager"
      ? "store_manager"
      : form.role === "Delivery Boy"
      ? "delivery"
      : "staff";



  return employees.filter((emp) => emp.role === backendRole);
}, [employees, form.role]);


  if (!open) return null;

  function handleChange(e) {
    const { name, value, checked, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleAssign() {
    if (
      !form.store ||
      !form.role ||
      !form.employee ||
      !form.task
    ) {
      alert("Please fill all required fields.");
      return;
    }

    if (
      form.type !== "normal" &&
      !form.target
    ) {
      alert("Please enter a target.");
      return;
    }

    onSave(form);

    setForm({
      employee: "",
      role: "",
      store: "",
      task: "",
      type: "normal",
      target: "",
      due: "",
      requiresPhoto: false,
    });

    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center p-4">

      <div className="bg-white rounded-2xl w-full max-w-xl p-6">

        <h2 className="text-2xl font-bold mb-6">
          Assign Task
        </h2>

        <div className="space-y-4">

          <select
  name="store"
  className="w-full h-11 border rounded-xl px-4"
  value={form.store}
  onChange={handleChange}
>
  <option value="">Select Store</option>

  {stores.map((store) => (
    <option key={store.id} value={store.id}>
      {store.name}
    </option>
  ))}
</select>

          <select
            name="role"
            className="w-full h-11 border rounded-xl px-4"
            value={form.role}
            onChange={handleChange}
          >
            <option value="">Select Role</option>
            <option>Store Manager</option>
            <option>Staff</option>
            <option>Delivery Boy</option>
          </select>

          <select
            name="employee"
            className="w-full h-11 border rounded-xl px-4"
            value={form.employee}
            onChange={handleChange}
          >
            <option value="">Select Employee</option>
            {filteredEmployees.map((employee) => (
  <option key={employee.id} value={employee.id}>
    {employee.full_name}
  </option>
))}
          </select>

          <input
            name="task"
            placeholder="Task Name"
            className="w-full h-11 border rounded-xl px-4"
            value={form.task}
            onChange={handleChange}
          />

          <div className="grid grid-cols-3 gap-3">

            <button
              type="button"
              onClick={() =>
                setForm({
                  ...form,
                  type: "normal",
                })
              }
              className={`rounded-xl border p-4 font-medium transition ${
                form.type === "normal"
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "hover:bg-gray-50"
              }`}
            >
              Normal
            </button>

            <button
              type="button"
              onClick={() =>
                setForm({
                  ...form,
                  type: "sales",
                })
              }
              className={`rounded-xl border p-4 font-medium transition ${
                form.type === "sales"
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "hover:bg-gray-50"
              }`}
            >
              Sales
            </button>

            <button
              type="button"
              onClick={() =>
                setForm({
                  ...form,
                  type: "delivery",
                })
              }
              className={`rounded-xl border p-4 font-medium transition ${
                form.type === "delivery"
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "hover:bg-gray-50"
              }`}
            >
              Delivery
            </button>

          </div>

          {form.type !== "normal" && (
            <input
              name="target"
              placeholder={
                form.type === "sales"
                  ? "Sales Target (₹)"
                  : "Number of Deliveries"
              }
              className="w-full h-11 border rounded-xl px-4"
              value={form.target}
              onChange={handleChange}
            />
          )}

          <input
            type="date"
            name="due"
            className="w-full h-11 border rounded-xl px-4"
            value={form.due}
            onChange={handleChange}
          />

          <label className="flex items-center gap-3">

            <input
              type="checkbox"
              name="requiresPhoto"
              checked={form.requiresPhoto}
              onChange={handleChange}
            />

            <span>Require Photo Proof</span>

          </label>

        </div>

        <div className="flex justify-end gap-3 mt-8">

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl border hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            onClick={handleAssign}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
          >
            Assign Task
          </button>

        </div>

      </div>

    </div>
  );
}