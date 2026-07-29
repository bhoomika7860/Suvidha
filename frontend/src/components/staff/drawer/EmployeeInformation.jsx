import { useEffect, useState } from "react";
import { Store } from "lucide-react";
import { staffService } from "../../../services/staffService";

function InfoRow({ label, children }) {
  return (
    <div className="flex items-center justify-between border-b border-[#F3F4F6] py-3 last:border-0">
      <span className="text-sm text-[#6B7280]">{label}</span>

      <div className="min-w-[220px] text-right">
        {children}
      </div>
    </div>
  );
}

export default function EmployeeInformation({
  employee,
  onEmployeeUpdated,
}) {
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    username: "",
    role: "",
    is_active: true,
    store_id: null,
  });

  useEffect(() => {
    if (employee) {
      setForm({
        full_name: employee.full_name || "",
        username: employee.username || "",
        role: employee.role || "",
        is_active: employee.is_active,
        store_id: employee.store_id,
      });
    }
  }, [employee]);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await staffService.updateUser(employee.id, form);

      if (onEmployeeUpdated) {
        await onEmployeeUpdated();
      }

      setEditing(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update employee.");
    }
  };

  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6">

      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[#111827]">
            Employee Information
          </h3>

          <p className="mt-1 text-sm text-[#6B7280]">
            Basic employee details
          </p>
        </div>

        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setEditing(false)}
              className="rounded-lg border px-4 py-2 text-sm"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
              Save
            </button>
          </div>
        )}
      </div>

      <InfoRow label="Full Name">
        {editing ? (
          <input
            className="w-full rounded-lg border p-2"
            value={form.full_name}
            onChange={(e) =>
              handleChange("full_name", e.target.value)
            }
          />
        ) : (
          <span>{employee.full_name}</span>
        )}
      </InfoRow>

      <InfoRow label="Username">
        {editing ? (
          <input
            className="w-full rounded-lg border p-2"
            value={form.username}
            onChange={(e) =>
              handleChange("username", e.target.value)
            }
          />
        ) : (
          <span>@{employee.username}</span>
        )}
      </InfoRow>

      <InfoRow label="Role">
        {editing ? (
          <select
            className="w-full rounded-lg border p-2"
            value={form.role}
            onChange={(e) =>
              handleChange("role", e.target.value)
            }
          >
            <option value="owner">Owner</option>
            <option value="store_manager">Store Manager</option>
            <option value="staff">Staff</option>
            <option value="delivery">Delivery Boy</option>
          </select>
        ) : (
          <span>{employee.role}</span>
        )}
      </InfoRow>

      <InfoRow label="Store">
        <span className="flex items-center justify-end gap-2">
          <Store size={14} />
          {employee.store_name || "-"}
        </span>
      </InfoRow>

      <InfoRow label="Status">
        {editing ? (
          <select
            className="w-full rounded-lg border p-2"
            value={form.is_active ? "true" : "false"}
            onChange={(e) =>
              handleChange(
                "is_active",
                e.target.value === "true"
              )
            }
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        ) : (
          <span>
            {employee.is_active ? "Active" : "Inactive"}
          </span>
        )}
      </InfoRow>

      <InfoRow label="Joined">
        <span>{employee.created_at || "-"}</span>
      </InfoRow>

    </div>
  );
}