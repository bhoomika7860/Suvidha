import { useState, useEffect, useMemo } from "react";

import {
  Search,
  Plus,
  Download,
  Users,
  ShieldCheck,
  UserCheck,
  Truck,
  X,
  RotateCcw,
  Store,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";

import EmployeeDrawer from "../../components/staff/EmployeeDrawer";
import storesService from "../../services/storeService";
import { staffService } from "../../services/staffService";

import {
  RoleBadge,
  Select,
} from "../staff_management/components/Badges";

import {
  getInitials,
  AVATAR_COLORS,
} from "../staff_management/utils/helpers";

// ─────────────────────────────────────────────────────────────
// ADD EMPLOYEE MODAL
// ─────────────────────────────────────────────────────────────

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder = "",
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={name}
        className="text-sm font-medium text-[#111827]"
      >
        {label}
        {required && (
          <span className="ml-0.5 text-red-500">*</span>
        )}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder || label}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3 py-2.5 text-sm text-[#111827] placeholder-[#9CA3AF] transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      />
    </div>
  );
}

function AddEmployeeModal({ onClose, storeOptions }) {
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
    phone: "",
    email: "",
    store: "",
    role: "",
    status: "Active",
    notes: "",
  });

  const [saving, setSaving] = useState(false);

  async function handleCreateEmployee() {
    try {
      if (
        !form.fullName ||
        !form.username ||
        !form.password ||
        !form.store ||
        !form.role
      ) {
        alert("Please fill all required fields.");
        return;
      }

      if (form.password !== form.confirmPassword) {
        alert("Passwords do not match.");
        return;
      }

      setSaving(true);

      await staffService.createUser({
        full_name: form.fullName,
        username: form.username,
        password: form.password,
        phone: form.phone,
        email: form.email,
        store_id: Number(form.store),
        role:
          form.role === "Manager"
            ? "store_manager"
            : form.role === "Delivery Boy"
              ? "delivery"
              : "staff",
        is_active: form.status === "Active",
      });

      alert("Employee created successfully.");
      onClose();
      window.location.reload();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.detail ||
          error.message ||
          "Failed to create employee."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="flex max-h-[94vh] w-full flex-col overflow-hidden rounded-t-[24px] bg-white shadow-2xl sm:max-w-[700px] sm:rounded-[20px]">
        <div className="flex shrink-0 items-start justify-between border-b border-[#E5E7EB] px-5 pb-4 pt-5 sm:px-7 sm:pb-5 sm:pt-7">
          <div className="min-w-0 pr-4">
            <h2 className="text-xl font-bold tracking-tight text-[#111827] sm:text-2xl">
              Add Employee
            </h2>
            <p className="mt-1 text-sm leading-5 text-[#6B7280]">
              Create a new pharmacy staff account
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[#6B7280] hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-7">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
              label="Full Name"
              name="fullName"
              value={form.fullName}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  fullName: e.target.value,
                }))
              }
              required
              placeholder="e.g. Kunal"
            />

            <Field
              label="Username"
              name="username"
              value={form.username}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  username: e.target.value,
                }))
              }
              required
              placeholder="e.g. admin1"
            />

            <Field
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  password: e.target.value,
                }))
              }
              required
              placeholder="Min 8 characters"
            />

            <Field
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  confirmPassword: e.target.value,
                }))
              }
              required
              placeholder="Repeat password"
            />

            <Field
              label="Phone"
              name="phone"
              value={form.phone}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  phone: e.target.value,
                }))
              }
              required
              placeholder="+91 98765 43210"
            />

            <Field
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  email: e.target.value,
                }))
              }
              placeholder="employee@Suvidha.com"
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#111827]">
                Store <span className="text-red-500">*</span>
              </label>

              <select
                value={form.store}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    store: e.target.value,
                  }))
                }
                className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3 py-2.5 text-sm text-[#111827] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">Select Store</option>
                {storeOptions.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#111827]">
                Role <span className="text-red-500">*</span>
              </label>

              <select
                value={form.role}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    role: e.target.value,
                  }))
                }
                className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3 py-2.5 text-sm text-[#111827] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">Select Role</option>
                <option value="Manager">Manager</option>
                <option value="Staff">Staff</option>
                <option value="Delivery Boy">Delivery Boy</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#111827]">
                Status
              </label>

              <select
                value={form.status}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    status: e.target.value,
                  }))
                }
                className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3 py-2.5 text-sm text-[#111827] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="text-sm font-medium text-[#111827]">
              Notes
            </label>

            <textarea
              rows={3}
              placeholder="Any additional notes about this employee..."
              value={form.notes}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  notes: e.target.value,
                }))
              }
              className="mt-1.5 w-full resize-none rounded-xl border border-[#E5E7EB] bg-white px-3 py-2.5 text-sm text-[#111827] placeholder-[#9CA3AF] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-end gap-3 border-t border-[#E5E7EB] bg-white px-5 py-4 sm:px-7 sm:py-5">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm font-medium text-[#374151] hover:bg-gray-50 disabled:opacity-50 sm:px-5"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleCreateEmployee}
            disabled={saving}
            className="rounded-xl bg-[#2563EB] px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:px-5"
          >
            {saving ? "Creating..." : "Create Employee"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// STAFF MANAGEMENT
// ─────────────────────────────────────────────────────────────

export default function StaffManagement() {
  const [employees, setEmployees] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [storeFilter, setStoreFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const closeDrawer = () => {
    setSelectedEmployee(null);
  };

  async function loadUsers() {
    try {
      setLoading(true);
      setError("");

      const data = await staffService.getUsers();

      setEmployees(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Failed to load employees.");
    } finally {
      setLoading(false);
    }
  }

  async function loadStores() {
    try {
      const data = await storesService.getStores();
      setStores(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadUsers();
    loadStores();
  }, []);

  const storeOptions = stores.map((store) => ({
    id: store.id,
    name: store.name,
  }));

  const filtered = useMemo(() => {
    return employees.filter((employee) => {
      const q = searchQuery.trim().toLowerCase();

      const matchesSearch =
        !q ||
        (employee.full_name || "").toLowerCase().includes(q) ||
        (employee.username || "").toLowerCase().includes(q) ||
        (employee.phone || "").toLowerCase().includes(q) ||
        (employee.store_name || "").toLowerCase().includes(q);

      const matchesStore =
        storeFilter === "all" ||
        String(employee.store_id) === String(storeFilter);

      const matchesRole =
        roleFilter === "all" ||
        employee.role === roleFilter;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "Active" && employee.is_active) ||
        (statusFilter === "Inactive" && !employee.is_active) ||
        (statusFilter === "Suspended" &&
          employee.status === "Suspended");

      return (
        matchesSearch &&
        matchesStore &&
        matchesRole &&
        matchesStatus
      );
    });
  }, [
    employees,
    searchQuery,
    storeFilter,
    roleFilter,
    statusFilter,
  ]);

  const kpis = [
    {
      label: "Total Employees",
      value: employees.length,
      icon: Users,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      label: "Managers",
      value: employees.filter(
        (employee) => employee.role === "store_manager"
      ).length,
      icon: ShieldCheck,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      label: "Store Staff",
      value: employees.filter(
        (employee) => employee.role === "staff"
      ).length,
      icon: UserCheck,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      label: "Delivery Boys",
      value: employees.filter(
        (employee) => employee.role === "delivery"
      ).length,
      icon: Truck,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
    },
  ];

  function resetFilters() {
    setSearchQuery("");
    setStoreFilter("all");
    setRoleFilter("all");
    setStatusFilter("all");
  }

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    storeFilter !== "all" ||
    roleFilter !== "all" ||
    statusFilter !== "all";

  function exportStaff() {
    const headers = [
      "Full Name",
      "Username",
      "Email",
      "Phone",
      "Store",
      "Role",
      "Status",
    ];

    const rows = filtered.map((employee) => [
      employee.full_name,
      employee.username,
      employee.email || "",
      employee.phone || "",
      employee.store_name || "",
      employee.role,
      employee.is_active ? "Active" : "Inactive",
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((value) =>
            `"${String(value).replace(/"/g, '""')}"`
          )
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "staff_list.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
  }

  return (
    <div
      className="min-h-screen bg-[#F9FAFB]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* =========================================================
          DESKTOP — UNCHANGED WORKFLOW
      ========================================================= */}

      <div className="hidden lg:block">
        <div className="mx-auto max-w-[1400px] px-8 py-8">

          <div className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#111827]">
                Staff Management
              </h1>

              <p className="mt-1 text-sm text-[#6B7280]">
                Manage employees across all pharmacy stores,
                assign roles and monitor account status.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={exportStaff}
                className="flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-medium text-[#374151] shadow-sm hover:bg-gray-50"
              >
                <Download size={15} />
                Export Staff
              </button>

              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
              >
                <Plus size={15} />
                Add Employee
              </button>
            </div>
          </div>

          <div className="mb-6 grid grid-cols-4 gap-5">
            {kpis.map((kpi) => {
              const Icon = kpi.icon;

              return (
                <div
                  key={kpi.label}
                  className="rounded-[20px] border border-[#E5E7EB] bg-white p-5 shadow-sm"
                >
                  <div
                    className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${kpi.iconBg}`}
                  >
                    <Icon
                      size={18}
                      className={kpi.iconColor}
                    />
                  </div>

                  <p className="text-3xl font-bold tracking-tight text-[#111827]">
                    {kpi.value}
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#374151]">
                    {kpi.label}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mb-5 rounded-[20px] border border-[#E5E7EB] bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="relative max-w-sm flex-1">
                <Search
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
                />

                <input
                  type="text"
                  placeholder="Search employee..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-[#E5E7EB] bg-white py-2.5 pl-9 pr-4 text-sm text-[#111827] placeholder-[#9CA3AF] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <p className="text-xs text-[#9CA3AF]">
                Search by: Name, Username, Phone, Store
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Select
                value={storeFilter}
                onChange={setStoreFilter}
                options={[
                  { label: "All Stores", value: "all" },
                  ...storeOptions.map((store) => ({
                    label: store.name,
                    value: store.id,
                  })),
                ]}
              />

              <Select
                value={roleFilter}
                onChange={setRoleFilter}
                options={[
                  { label: "Owner", value: "owner" },
                  {
                    label: "Manager",
                    value: "store_manager",
                  },
                  { label: "Staff", value: "staff" },
                  {
                    label: "Delivery Boy",
                    value: "delivery",
                  },
                ]}
              />

              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                options={[
                  { label: "All Status", value: "all" },
                  { label: "Active", value: "Active" },
                  {
                    label: "Inactive",
                    value: "Inactive",
                  },
                  {
                    label: "Suspended",
                    value: "Suspended",
                  },
                ]}
              />

              <button
                type="button"
                onClick={resetFilters}
                className="flex items-center gap-1.5 rounded-xl border border-[#E5E7EB] px-3.5 py-2 text-sm text-[#6B7280] hover:bg-gray-50"
              >
                <RotateCcw size={13} />
                Reset Filters
              </button>

              <div className="ml-auto text-sm font-medium text-[#6B7280]">
                Showing{" "}
                <span className="font-semibold text-[#111827]">
                  {filtered.length}
                </span>{" "}
                Employee
                {filtered.length !== 1 && "s"}
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-[20px] border border-[#E5E7EB] bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] px-6 py-5">
              <div>
                <h2 className="text-base font-semibold text-[#111827]">
                  Employees
                </h2>

                <p className="mt-0.5 text-xs text-[#6B7280]">
                  Manage pharmacy workforce
                </p>
              </div>

              <span className="text-sm text-[#6B7280]">
                Showing{" "}
                <span className="font-semibold text-[#111827]">
                  {filtered.length}
                </span>{" "}
                Employee
                {filtered.length !== 1 && "s"}
              </span>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex items-center justify-center py-24 text-sm text-gray-500">
                  Loading employees...
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center px-8 py-24 text-center">
                  <h3 className="text-base font-semibold text-[#111827]">
                    Unable to load employees
                  </h3>

                  <p className="mt-2 text-sm text-[#6B7280]">
                    {error}
                  </p>

                  <button
                    type="button"
                    onClick={loadUsers}
                    className="mt-5 rounded-xl bg-[#2563EB] px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Try Again
                  </button>
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center px-8 py-24 text-center">
                  <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
                    <Users size={28} className="text-gray-400" />
                  </div>

                  <h3 className="mb-2 text-base font-semibold text-[#111827]">
                    No Employees Found
                  </h3>

                  <p className="mb-6 max-w-xs text-sm text-[#6B7280]">
                    {hasActiveFilters
                      ? "No employees match your current filters. Try adjusting your search."
                      : "Create your first employee to start managing pharmacy staff."}
                  </p>

                  {!hasActiveFilters && (
                    <button
                      type="button"
                      onClick={() => setShowAddModal(true)}
                      className="flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      <Plus size={15} />
                      Add Employee
                    </button>
                  )}
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                      {[
                        "Employee",
                        "Store",
                        "Role",
                        "Performance",
                      ].map((column) => (
                        <th
                          key={column}
                          className="whitespace-nowrap px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-[#6B7280]"
                        >
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {filtered.map((employee) => {
                      const isOwner =
                        employee.role === "owner";

                      return (
                        <tr
                          key={employee.id}
                          onClick={
                            isOwner
                              ? undefined
                              : () =>
                                  setSelectedEmployee(
                                    employee
                                  )
                          }
                          className={
                            isOwner
                              ? "border-b border-[#F3F4F6] bg-gray-50"
                              : "cursor-pointer border-b border-[#F3F4F6] hover:bg-[#F9FAFB]"
                          }
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                                style={{
                                  backgroundColor:
                                    AVATAR_COLORS[
                                      employee.id
                                    ],
                                }}
                              >
                                {getInitials(
                                  employee.full_name
                                )}
                              </div>

                              <div>
                                <p className="text-sm font-semibold text-[#111827]">
                                  {employee.full_name}
                                </p>

                                <p className="text-xs text-[#6B7280]">
                                  @{employee.username}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1.5 text-sm text-[#374151]">
                              <Store
                                size={13}
                                className="shrink-0 text-[#9CA3AF]"
                              />
                              <span className="whitespace-nowrap">
                                {employee.store_name}
                              </span>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <RoleBadge role={employee.role} />
                          </td>

                          <td className="px-6 py-4">
                            {isOwner ? (
                              <span className="text-sm font-medium text-gray-400">
                                -
                              </span>
                            ) : (
                              <span
                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                  employee.performance_score >=
                                  80
                                    ? "bg-green-100 text-green-700"
                                    : employee.performance_score >=
                                        50
                                      ? "bg-yellow-100 text-yellow-700"
                                      : "bg-red-100 text-red-700"
                                }`}
                              >
                                {employee.performance_score}%
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          MOBILE
      ========================================================= */}

      <div className="lg:hidden w-full min-h-screen bg-[#F9FAFB] pb-24 overflow-x-hidden">

        {/* Header — exact Purchases typography and spacing */}
        <div className="w-full bg-white border-b px-5 pt-6 pb-5">

          <div className="flex items-center justify-between gap-3">

            <h1 className="text-3xl font-bold text-gray-900">
              Staff Management
            </h1>

            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="flex shrink-0 items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm"
            >
              <Plus size={16} />
              Add
            </button>

          </div>

          <p className="mt-1 text-gray-500">
            Manage employees across all stores.
          </p>

        </div>

        {/* Export button stays completely outside the header */}
        <div className="px-4 pt-5">

          <button
            type="button"
            onClick={exportStaff}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm"
          >
            <Download size={15} />
            Export Staff
          </button>

        </div>

        <div className="w-full px-4 pt-4">

          {/* Compact KPIs */}
          <div className="mb-5 grid grid-cols-2 gap-3">
            {kpis.map((kpi) => {
              const Icon = kpi.icon;

              return (
                <div
                  key={kpi.label}
                  className="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm"
                >
                  <div
                    className={`mb-2.5 flex h-9 w-9 items-center justify-center rounded-xl ${kpi.iconBg}`}
                  >
                    <Icon
                      size={17}
                      className={kpi.iconColor}
                    />
                  </div>

                  <p className="text-2xl font-bold leading-7 tracking-tight text-[#111827]">
                    {kpi.value}
                  </p>

                  <p className="mt-1 text-xs font-semibold text-[#5B6475]">
                    {kpi.label}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Search / Filters */}
          <div className="mb-4 rounded-2xl border border-[#E5E7EB] bg-white p-3 shadow-sm">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]"
              />

              <input
                type="text"
                placeholder="Search employee..."
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(e.target.value)
                }
                className="w-full rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] py-3 pl-10 pr-4 text-sm text-[#111827] placeholder-[#9CA3AF] focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/10"
              />
            </div>

            <div className="mt-3 flex items-center justify-between">
              <button
                type="button"
                onClick={() =>
                  setShowMobileFilters((value) => !value)
                }
                className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-medium ${
                  showMobileFilters || hasActiveFilters
                    ? "border-blue-200 bg-blue-50 text-blue-600"
                    : "border-[#E5E7EB] bg-white text-[#475569]"
                }`}
              >
                <SlidersHorizontal size={15} />
                Filters

                {hasActiveFilters && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white">
                    !
                  </span>
                )}
              </button>

              <span className="text-xs font-medium text-[#64748B]">
                {filtered.length} employee
                {filtered.length !== 1 && "s"}
              </span>
            </div>

            {showMobileFilters && (
              <div className="mt-3 space-y-2.5 border-t border-[#F1F5F9] pt-3">
                <Select
                  value={storeFilter}
                  onChange={setStoreFilter}
                  options={[
                    { label: "All Stores", value: "all" },
                    ...storeOptions.map((store) => ({
                      label: store.name,
                      value: store.id,
                    })),
                  ]}
                />

                <Select
                  value={roleFilter}
                  onChange={setRoleFilter}
                  options={[
                    { label: "All Roles", value: "all" },
                    {
                      label: "Owner",
                      value: "owner",
                    },
                    {
                      label: "Manager",
                      value: "store_manager",
                    },
                    {
                      label: "Staff",
                      value: "staff",
                    },
                    {
                      label: "Delivery Boy",
                      value: "delivery",
                    },
                  ]}
                />

                <Select
                  value={statusFilter}
                  onChange={setStatusFilter}
                  options={[
                    { label: "All Status", value: "all" },
                    {
                      label: "Active",
                      value: "Active",
                    },
                    {
                      label: "Inactive",
                      value: "Inactive",
                    },
                    {
                      label: "Suspended",
                      value: "Suspended",
                    },
                  ]}
                />

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#E5E7EB] px-3.5 py-2.5 text-sm font-medium text-[#64748B]"
                  >
                    <RotateCcw size={14} />
                    Reset Filters
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Mobile employee list */}
          {loading ? (
            <div className="rounded-2xl border border-[#E5E7EB] bg-white px-5 py-14 text-center shadow-sm">
              <p className="text-sm text-[#64748B]">
                Loading employees...
              </p>
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-[#E5E7EB] bg-white px-5 py-14 text-center shadow-sm">
              <p className="text-sm font-medium text-[#111827]">
                Unable to load employees
              </p>

              <button
                type="button"
                onClick={loadUsers}
                className="mt-4 rounded-xl bg-[#2563EB] px-4 py-2.5 text-sm font-medium text-white"
              >
                Try Again
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-[#E5E7EB] bg-white px-5 py-14 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
                <Users
                  size={25}
                  className="text-gray-400"
                />
              </div>

              <h3 className="text-base font-semibold text-[#111827]">
                No Employees Found
              </h3>

              <p className="mx-auto mt-2 max-w-xs text-sm leading-5 text-[#6B7280]">
                {hasActiveFilters
                  ? "No employees match your current filters."
                  : "Create your first employee to start managing pharmacy staff."}
              </p>

              <button
                type="button"
                onClick={
                  hasActiveFilters
                    ? resetFilters
                    : () => setShowAddModal(true)
                }
                className="mt-5 rounded-xl bg-[#2563EB] px-4 py-2.5 text-sm font-medium text-white"
              >
                {hasActiveFilters
                  ? "Reset Filters"
                  : "Add Employee"}
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filtered.map((employee) => {
                const isOwner =
                  employee.role === "owner";

                return (
                  <button
                    key={employee.id}
                    type="button"
                    disabled={isOwner}
                    onClick={() =>
                      !isOwner &&
                      setSelectedEmployee(employee)
                    }
                    className={`w-full rounded-2xl border border-[#E5E7EB] bg-white px-3.5 py-3 text-left shadow-sm ${
                      isOwner
                        ? "cursor-default bg-gray-50"
                        : "active:bg-[#F8FAFC]"
                    }`}
                  >
                    {/* Compact single employee row */}
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                        style={{
                          backgroundColor:
                            AVATAR_COLORS[
                              employee.id
                            ],
                        }}
                      >
                        {getInitials(
                          employee.full_name
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold leading-5 text-[#111827]">
                              {employee.full_name}
                            </p>

                            <p className="truncate text-[11px] leading-4 text-[#64748B]">
                              @{employee.username}
                            </p>
                          </div>

                          {!isOwner && (
                            <ChevronRight
                              size={16}
                              className="shrink-0 text-[#94A3B8]"
                            />
                          )}
                        </div>

                        <div className="mt-1.5 flex min-w-0 items-center gap-2">
                          <span className="flex min-w-0 items-center gap-1 text-[11px] font-medium text-[#64748B]">
                            <Store
                              size={11}
                              className="shrink-0 text-[#94A3B8]"
                            />

                            <span className="truncate">
                              {employee.store_name ||
                                "No store"}
                            </span>
                          </span>

                          <span className="h-3 w-px shrink-0 bg-[#E2E8F0]" />

                          <span className="shrink-0">
                            <RoleBadge
                              role={employee.role}
                            />
                          </span>
                        </div>
                      </div>

                      {!isOwner && (
                        <span
                          className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold ${
                            employee.performance_score >=
                            80
                              ? "bg-green-100 text-green-700"
                              : employee.performance_score >=
                                  50
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {employee.performance_score}%
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Employee drawer */}
      {selectedEmployee && (
        <EmployeeDrawer
          employee={selectedEmployee}
          onClose={closeDrawer}
          onEmployeeUpdated={loadUsers}
        />
      )}

      {/* Add employee */}
      {showAddModal && (
        <AddEmployeeModal
          onClose={() => setShowAddModal(false)}
          storeOptions={storeOptions}
        />
      )}
    </div>
  );
}
