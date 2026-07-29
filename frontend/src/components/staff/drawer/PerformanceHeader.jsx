import { X, Store } from "lucide-react";
import {
  RoleBadge,
  StatusBadge,
} from "../../../pages/staff_management/components/Badges";


import {
  getInitials,
  AVATAR_COLORS,
} from "../../../pages/staff_management/utils/helpers";

export default function PerformanceHeader({
  employee,
  onClose,
}) {
  return (
    <div className="border-b border-[#E5E7EB] bg-white p-6">

      <div className="flex items-start justify-between">

        <div className="flex items-center gap-4">

          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl text-xl font-bold text-white"
            style={{
              backgroundColor:
                AVATAR_COLORS[employee.id],
            }}
          >
            {getInitials(employee.full_name)}
          </div>

          <div>

            <h2 className="text-xl font-bold text-[#111827]">
              {employee.full_name}
            </h2>

            <p className="mt-1 text-sm text-[#6B7280]">
              @{employee.username}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2">

              <RoleBadge role={employee.role} />

              <span className="flex items-center gap-1 text-sm text-[#6B7280]">
                <Store size={13} />
                {employee.store_name || "-"}
              </span>

              <StatusBadge
                active={employee.is_active}
              />

            </div>

          </div>

        </div>

        <button
          onClick={onClose}
          className="rounded-xl p-2 transition hover:bg-gray-100"
        >
          <X size={18} />
        </button>

      </div>

    </div>
  );
}