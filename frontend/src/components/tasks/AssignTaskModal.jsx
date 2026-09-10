import { useEffect, useMemo, useState } from "react";
import {
  X,
  ClipboardList,
  Store,
  UserRound,
  Target,
  Camera,
} from "lucide-react";

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
    requiresPhoto: false,
  });

  const [stores, setStores] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    if (!open) return;

    async function loadData() {
      try {
        const [storesData, usersData] =
          await Promise.all([
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

    return employees.filter(
      (emp) => emp.role === backendRole
    );
  }, [employees, form.role]);

  if (!open) return null;

  function handleChange(e) {
    const {
      name,
      value,
      checked,
      type,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  }

  function handleAssign() {
    if (
      !form.store ||
      !form.role ||
      !form.employee ||
      !form.task
    ) {
      alert(
        "Please fill all required fields."
      );
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
      requiresPhoto: false,
    });

    onClose();
  }

  const inputClass =
    "w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10";

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">

      <div
        className="flex max-h-[94vh] w-full flex-col overflow-hidden rounded-t-[24px] bg-white shadow-2xl sm:max-w-xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="flex shrink-0 items-start justify-between border-b border-gray-200 px-5 pb-4 pt-5 sm:px-6 sm:pb-5 sm:pt-6">

          <div className="flex min-w-0 items-center gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <ClipboardList size={19} />
            </div>

            <div className="min-w-0">

              <h2 className="text-xl font-bold text-gray-900">
                Assign Task
              </h2>

              <p className="mt-0.5 text-sm text-gray-500">
                Assign a task to a pharmacy employee.
              </p>

            </div>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-gray-500 transition hover:bg-gray-100"
            aria-label="Close"
          >
            <X size={18} />
          </button>

        </div>


        {/* =====================================================
            FORM
        ===================================================== */}

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">

          <div className="space-y-4">

            {/* Store */}

            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-900">
                <Store
                  size={14}
                  className="text-gray-400"
                />
                Store
              </label>

              <select
                name="store"
                className={inputClass}
                value={form.store}
                onChange={handleChange}
              >
                <option value="">
                  Select Store
                </option>

                {stores.map((store) => (
                  <option
                    key={store.id}
                    value={store.id}
                  >
                    {store.name}
                  </option>
                ))}
              </select>
            </div>


            {/* Role */}

            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-900">
                <UserRound
                  size={14}
                  className="text-gray-400"
                />
                Role
              </label>

              <select
                name="role"
                className={inputClass}
                value={form.role}
                onChange={handleChange}
              >
                <option value="">
                  Select Role
                </option>
                <option>Store Manager</option>
                <option>Staff</option>
                <option>Delivery Boy</option>
              </select>
            </div>


            {/* Employee */}

            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-900">
                <UserRound
                  size={14}
                  className="text-gray-400"
                />
                Employee
              </label>

              <select
                name="employee"
                className={inputClass}
                value={form.employee}
                onChange={handleChange}
                disabled={!form.role}
              >
                <option value="">
                  {form.role
                    ? "Select Employee"
                    : "Select role first"}
                </option>

                {filteredEmployees.map(
                  (employee) => (
                    <option
                      key={employee.id}
                      value={employee.id}
                    >
                      {employee.full_name}
                    </option>
                  )
                )}
              </select>
            </div>


            {/* Task */}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-900">
                Task Name
              </label>

              <input
                name="task"
                placeholder="Enter task name"
                className={inputClass}
                value={form.task}
                onChange={handleChange}
              />
            </div>


            {/* Task Type */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900">
                Task Type
              </label>

              <div className="grid grid-cols-3 gap-2">

                {[
                  {
                    value: "normal",
                    label: "Normal",
                  },
                  {
                    value: "sales",
                    label: "Sales",
                  },
                  {
                    value: "delivery",
                    label: "Delivery",
                  },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        type: option.value,
                        target:
                          option.value ===
                          "normal"
                            ? ""
                            : prev.target,
                      }))
                    }
                    className={`min-h-11 rounded-xl border px-2 py-2.5 text-sm font-medium transition ${
                      form.type ===
                      option.value
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}

              </div>
            </div>


            {/* Target */}

            {form.type !== "normal" && (
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-900">
                  <Target
                    size={14}
                    className="text-gray-400"
                  />
                  Target
                </label>

                <input
                  name="target"
                  inputMode="numeric"
                  placeholder={
                    form.type === "sales"
                      ? "Sales Target (₹)"
                      : "Number of Deliveries"
                  }
                  className={inputClass}
                  value={form.target}
                  onChange={handleChange}
                />
              </div>
            )}


            {/* Photo proof */}

            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">

              <input
                type="checkbox"
                name="requiresPhoto"
                checked={form.requiresPhoto}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />

              <div className="flex min-w-0 items-center gap-2">

                <Camera
                  size={15}
                  className="shrink-0 text-gray-400"
                />

                <span className="text-sm font-medium text-gray-700">
                  Require Photo Proof
                </span>

              </div>

            </label>

          </div>

        </div>


        {/* =====================================================
            ACTIONS
        ===================================================== */}

        <div className="flex shrink-0 gap-3 border-t border-gray-200 bg-white px-5 py-4 sm:justify-end sm:px-6">

          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 sm:flex-none"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleAssign}
            className="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 sm:flex-none"
          >
            Assign Task
          </button>

        </div>

      </div>
    </div>
  );
}
