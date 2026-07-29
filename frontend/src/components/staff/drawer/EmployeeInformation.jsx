import { Store } from "lucide-react";

function InfoRow({
  label,
  value,
  icon,
}) {
  return (
    <div className="flex items-center justify-between border-b border-[#F3F4F6] py-3 last:border-0">

      <span className="text-sm text-[#6B7280]">
        {label}
      </span>

      <span className="flex items-center gap-2 text-sm font-medium text-[#111827]">
        {icon}
        {value}
      </span>

    </div>
  );
}

export default function EmployeeInformation({
  employee,
}) {
  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6">

      <h3 className="text-lg font-semibold text-[#111827]">
        Employee Information
      </h3>

      <p className="mb-5 mt-1 text-sm text-[#6B7280]">
        Basic employee details
      </p>

      <InfoRow
        label="Username"
        value={`@${employee.username}`}
      />

      <InfoRow
        label="Role"
        value={employee.role}
      />

      <InfoRow
        label="Store"
        value={employee.store_name || "-"}
        icon={<Store size={14} />}
      />

      <InfoRow
        label="Status"
        value={
          employee.is_active
            ? "Active"
            : "Inactive"
        }
      />

      <InfoRow
        label="Joined"
        value={employee.created_at || "-"}
      />

    </div>
  );
}