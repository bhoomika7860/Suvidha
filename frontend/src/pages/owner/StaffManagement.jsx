import { useState, useEffect, useMemo } from "react";
import {
  Search,
  Plus,
  Download,
  Users,
  ShieldCheck,
  UserCheck,
  UserX,
  Store,
  Eye,
  Pencil,
  Ban,
  X,
  Check,
  Phone,
  Mail,
  Calendar,
  Clock,
  Key,
  ChevronDown,
  Info,
  Truck,
  RotateCcw,
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


// ─── Add Employee Modal ───────────────────────────────────────────────────────
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
      <label className="text-sm font-medium text-[#111827]">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>

      <input
        type={type}
        placeholder={placeholder || label}
        value={value}
        onChange={onChange}
        className="border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
      />
    </div>
  );
}
function AddEmployeeModal({ onClose, storeOptions }) {

  console.log("Modal storeOptions:", storeOptions);

  const [form, setForm] = useState({
    fullName: "", username: "", password: "", confirmPassword: "",
    phone: "", email: "", store: "", role: "", status: "Active", notes: "",
  });
const handleCreateEmployee = async () => {
  try {
    // Validation
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

    // Create employee
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

    // Close modal
    onClose();

    // Refresh page so new employee appears
    window.location.reload();

  } catch (error) {
    console.error(error);

    alert(
      error.response?.data?.detail ||
      error.message ||
      "Failed to create employee."
    );
  }
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
      <div className="bg-white rounded-[20px] shadow-2xl w-full max-w-[700px] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between p-7 pb-5 border-b border-[#E5E7EB]">
          <div>
            <h2 className="text-2xl font-bold">
  Add Employee
</h2>
            <p className="text-sm text-[#6B7280] mt-0.5">Create a new pharmacy staff account</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-[#6B7280]">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <div className="p-7 space-y-5">
          <div className="grid grid-cols-2 gap-4">
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
              <label className="text-sm font-medium text-[#111827]">Store <span className="text-red-500">*</span></label>
              <div className="relative">
                <select
                  value={form.store}
                  onChange={(e) => setForm((f) => ({ ...f, store: e.target.value }))}
                  className="w-full appearance-none border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                >
                  <option value="">Select Store</option>
                  {storeOptions.map((s) => (
    <option
        key={s.id}
        value={s.id}
    >
        {s.name}
    </option>
))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#111827]">Role <span className="text-red-500">*</span></label>
              <div className="relative">
                <select
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                  className="w-full appearance-none border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                >
                  <option value="">Select Role</option>
                  <option value="Manager">Manager</option>
<option value="Staff">Staff</option>
<option value="Delivery Boy">Delivery Boy</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#111827]">Status</label>
              <div className="relative">
                <select
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                  className="w-full appearance-none border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#111827]">Notes</label>
            <textarea
              rows={3}
              placeholder="Any additional notes about this employee..."
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              className="border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white resize-none"
            />
          </div>

          {/* Info card */}
          <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <Info size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-700">Employee credentials can be changed later by the owner at any time from this panel.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-7 py-5 border-t border-[#E5E7EB]">
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-[#374151] border border-[#E5E7EB] rounded-xl hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button
  onClick={handleCreateEmployee}
  className="px-5 py-2.5 text-sm font-medium text-white bg-[#2563EB] rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
>
            Create Employee
          </button>
        </div>
      </div>
    </div>

);    
}



// ─── Main App ─────────────────────────────────────────────────────────────────


export default function App() {

  const [employees, setEmployees] = useState([]);
  const [stores, setStores] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
const closeDrawer = () => {
  setSelectedEmployee(null);
};

const loadUsers = async () => {
  try {
    setLoading(true);

    const data = await staffService.getUsers();
console.log("Users from backend:", data);
    console.log("Employees:", data);

    setEmployees(data);
    console.log("Employees state being set:", data);
  } catch (err) {
    console.error(err);
    setError("Failed to load employees.");
  } finally {
    setLoading(false);
  }
};

const loadStores = async () => {
  try {
    const data = await storesService.getStores();
    setStores(data);
  } catch (err) {
    console.error(err);
  }
};

useEffect(() => {
  loadUsers();
  loadStores();
}, []);


const storeOptions = stores.map((store) => ({
  id: store.id,
  name: store.name,
}));


console.log("Employees:", employees);
console.log("Store Options:", storeOptions);
  const [searchQuery, setSearchQuery] = useState("");
  const [storeFilter, setStoreFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = useMemo(() => {
    return employees.filter((e) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q || e.full_name.toLowerCase().includes(q) || e.username.toLowerCase().includes(q) || (e.store_name || "").toLowerCase().includes(q);
      const matchesStore =
storeFilter === "all" ||
String(e.store_id) === String(storeFilter);
      const matchesRole = roleFilter === "all" || e.role === roleFilter;
     const matchesStatus =
  statusFilter === "all" ||
  (statusFilter === "Active" && e.is_active) ||
  (statusFilter === "Inactive" && !e.is_active);

console.log({
      employee: e.full_name,
      search: matchesSearch,
      store: matchesStore,
      role: matchesRole,
      status: matchesStatus,
    });


      return matchesSearch && matchesStore && matchesRole && matchesStatus;
    });
  }, [employees, searchQuery, storeFilter, roleFilter, statusFilter]);
console.log("Filtered:", filtered);


  const kpis = [
    { label: "Total Employees", value: employees.length, icon: <Users size={18} className="text-blue-600" />, iconBg: "bg-blue-50" },
    { label: "Managers", value: employees.filter((e) => e.role === "store_manager").length, icon: <ShieldCheck size={18} className="text-emerald-600" />, iconBg: "bg-emerald-50" },
    { label: "Store Staff", value: employees.filter((e) => e.role === "staff").length, icon: <UserCheck size={18} className="text-purple-600" />, iconBg: "bg-purple-50" },
   
  {
  label: "Delivery Boys",
  value: employees.filter(
    (e) => e.role === "delivery"
  ).length,

  icon: <Truck size={18} className="text-orange-600" />,
  iconBg: "bg-orange-50",
}
  ];

  function resetFilters() {
    setSearchQuery("");
    setStoreFilter("all");
    setRoleFilter("all");
    setStatusFilter("all");
  }

  const exportStaff = () => {
  const headers = [
    "Full Name",
    "Username",
    "Email",
    "Phone",
    "Store",
    "Role",
    "Status",
  ];

  const rows = filtered.map((emp) => [
    emp.full_name,
    emp.username,
    emp.email || "",
    emp.phone || "",
    emp.store_name || "",
    emp.role,
    emp.is_active ? "Active" : "Inactive",
  ]);

  const csv = [
    headers.join(","),
    ...rows.map((row) =>
      row
        .map((value) => `"${String(value).replace(/"/g, '""')}"`)
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
};

  return (
    <div className="min-h-screen bg-[#F9FAFB]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="max-w-[1400px] mx-auto px-8 py-8">

        {/* ── Page Header ─────────────────────────────────────────── */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#111827] tracking-tight">Staff Management</h1>
            <p className="text-sm text-[#6B7280] mt-1">Manage employees across all pharmacy stores, assign roles and monitor account status.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
  onClick={exportStaff}
  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#374151] border border-[#E5E7EB] bg-white rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
>
              <Download size={15} /> Export Staff
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#2563EB] rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Plus size={15} /> Add Employee
            </button>
          </div>
        </div>

        {/* ── KPI Cards ────────────────────────────────────────────── */}
        <div className="grid grid-cols-4 gap-5 mb-6">
          {kpis.map((kpi) => (
            <div
              key={kpi.label}
              className="bg-white border border-[#E5E7EB] rounded-[20px] p-5 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 cursor-default"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${kpi.iconBg}`}>
                  {kpi.icon}
                </div>
              </div>
              <p className="text-3xl font-bold text-[#111827] tracking-tight">{kpi.value}</p>
              <p className="text-sm font-semibold text-[#374151] mt-1">{kpi.label}</p>
              <p className="text-xs text-[#6B7280] mt-1">{kpi.trend}</p>
            </div>
          ))}
        </div>

        {/* ── Filter Section ───────────────────────────────────────── */}
        <div className="bg-white border border-[#E5E7EB] rounded-[20px] p-5 mb-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
              <input
                type="text"
                placeholder="Search employee..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white text-[#111827] placeholder-[#9CA3AF]"
              />
            </div>
            <p className="text-xs text-[#9CA3AF]">Search by: Name, Username, Phone, Store</p>
          </div>
          <div className="flex items-center gap-3">
            <Select
              value={storeFilter}
              onChange={setStoreFilter}
              options={[
  { label: "All Stores", value: "all" },
  ...storeOptions.map((s) => ({
    label: s.name,
    value: s.id,
  })),
]}
            />
            <Select
              value={roleFilter}
              onChange={setRoleFilter}
              options={[
                { label: "Owner", value: "owner" },
{ label: "Manager", value: "store_manager" },
{ label: "Staff", value: "staff" },
{ label: "Delivery Boy", value: "delivery" },
              ]}
            />
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { label: "All Status", value: "all" },
                { label: "Active", value: "Active" },
                { label: "Inactive", value: "Inactive" },
                { label: "Suspended", value: "Suspended" },
              ]}
            />
            <button
              onClick={resetFilters}
              className="flex items-center gap-1.5 px-3.5 py-2 text-sm text-[#6B7280] border border-[#E5E7EB] rounded-xl hover:bg-gray-50 transition-colors"
            >
              <RotateCcw size={13} /> Reset Filters
            </button>
            <div className="ml-auto text-sm text-[#6B7280] font-medium">
              Showing <span className="text-[#111827] font-semibold">{filtered.length}</span> Employee{filtered.length !== 1 && "s"}
            </div>
          </div>
        </div>

        {/* ── Main Table ───────────────────────────────────────────── */}
        <div className="bg-white border border-[#E5E7EB] rounded-[20px] shadow-sm overflow-hidden">
          {/* Table header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#E5E7EB]">
            <div>
              <h2 className="text-base font-semibold text-[#111827]">Employees</h2>
              <p className="text-xs text-[#6B7280] mt-0.5">Manage pharmacy workforce</p>
            </div>
            <span className="text-sm text-[#6B7280]">
              Showing <span className="font-semibold text-[#111827]">{filtered.length}</span> Employee{filtered.length !== 1 && "s"}
            </span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {filtered.length === 0 ? (
              /* Empty state */
              <div className="flex flex-col items-center justify-center py-24 px-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-5">
                  <Users size={28} className="text-gray-400" />
                </div>
                <h3 className="text-base font-semibold text-[#111827] mb-2">No Employees Found</h3>
                <p className="text-sm text-[#6B7280] max-w-xs mb-6">
                  {searchQuery || storeFilter !== "all" || roleFilter !== "all" || statusFilter !== "all"
                    ? "No employees match your current filters. Try adjusting your search."
                    : "Create your first employee to start managing pharmacy staff."}
                </p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#2563EB] rounded-xl hover:bg-blue-700 transition-colors"
                >
                  <Plus size={15} /> Add Employee
                </button>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                    {["Employee", "Store", "Role", "Performance"].map((col) => (
                      <th key={col} className="text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wide px-6 py-3.5 whitespace-nowrap">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((emp) => (
                    <tr
    key={emp.id}
    onClick={
        emp.role === "owner"
            ? undefined
            : () => setSelectedEmployee(emp)
    }
    className={
        emp.role === "owner"
            ? "border-b border-[#F3F4F6] bg-gray-50"
            : "cursor-pointer border-b border-[#F3F4F6] hover:bg-[#F9FAFB]"
    }
>
                      {/* Employee */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                            style={{ backgroundColor: AVATAR_COLORS[emp.id] }}
                          >
                            
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[#111827]">{emp.full_name}</p>
                            <p className="text-xs text-[#6B7280]">@{emp.username}</p>
                          </div>
                        </div>
                      </td>
                      {/* Store */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-[#374151]">
                          <Store size={13} className="text-[#9CA3AF] flex-shrink-0" />
                          <span className="whitespace-nowrap">{emp.store_name}</span>
                        </div>
                      </td>
                      {/* Role */}
<td className="px-6 py-4">
    <RoleBadge role={emp.role} />
</td>

{/* Performance */}
<td className="px-6 py-4">
  {emp.role === "owner" ? (
    <span className="text-sm font-medium text-gray-400">-</span>
  ) : (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
        emp.performance_score >= 80
          ? "bg-green-100 text-green-700"
          : emp.performance_score >= 50
          ? "bg-yellow-100 text-yellow-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {emp.performance_score}%
    </span>
  )}
</td>

                      
                      
                      
                      
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* ── Drawer ──────────────────────────────────────────────────── */}
      {selectedEmployee && (
       <EmployeeDrawer
    employee={selectedEmployee}
    onClose={closeDrawer}
    onEmployeeUpdated={loadUsers}
/>
      )}

      {/* ── Add Modal ───────────────────────────────────────────────── */}
      {showAddModal && <AddEmployeeModal
  onClose={() => setShowAddModal(false)}
  storeOptions={storeOptions}
/>}
    </div>
  );
}