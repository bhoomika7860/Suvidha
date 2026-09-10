import { useEffect, useState } from "react";
import { Plus, Truck } from "lucide-react";
import supplierService from "../../services/supplierService";
import SupplierTable from "../../components/suppliers/SupplierTable";

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAdd, setShowAdd] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);

  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadSuppliers();
  }, []);

  async function loadSuppliers() {
    try {
      setLoading(true);

      const data = await supplierService.getAllSuppliers();

      setSuppliers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load suppliers:", error);

      alert(
        error?.response?.data?.detail ||
          "Failed to load suppliers."
      );
    } finally {
      setLoading(false);
    }
  }

  function openAdd() {
    setEditingSupplier(null);
    setName("");
    setShowAdd(true);
  }

  function openEdit(supplier) {
    setEditingSupplier(supplier);
    setName(supplier.name);
    setShowAdd(true);
  }

  function closeForm() {
    setShowAdd(false);
    setEditingSupplier(null);
    setName("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      alert("Supplier name cannot be empty.");
      return;
    }

    try {
      setIsSubmitting(true);

      if (editingSupplier) {
        await supplierService.updateSupplier(
          editingSupplier.id,
          {
            name: trimmedName,
          }
        );
      } else {
        await supplierService.createSupplier({
          name: trimmedName,
        });
      }

      await loadSuppliers();
      closeForm();
    } catch (error) {
      console.error("Failed to save supplier:", error);

      alert(
        error?.response?.data?.detail ||
          "Failed to save supplier."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function toggleSupplier(supplier) {
    const action = supplier.is_active
      ? "deactivate"
      : "activate";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} "${supplier.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await supplierService.updateSupplier(
        supplier.id,
        {
          is_active: !supplier.is_active,
        }
      );

      await loadSuppliers();
    } catch (error) {
      console.error(
        "Failed to update supplier:",
        error
      );

      alert(
        error?.response?.data?.detail ||
          "Failed to update supplier."
      );
    }
  }

  return (
    <div className="w-full">
      {/* Desktop */}
      <div className="hidden space-y-6 lg:block">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100">
              <Truck
                size={22}
                className="text-blue-600"
              />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Suppliers
              </h1>

              <p className="mt-1 text-slate-500">
                Manage suppliers available for purchase bills.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={openAdd}
            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 font-semibold text-white transition hover:bg-blue-700"
          >
            <Plus size={18} />
            Add Supplier
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
            <h2 className="font-semibold text-slate-900">
              Supplier List
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Active suppliers appear in purchase forms.
            </p>
          </div>

          <SupplierTable
            suppliers={suppliers}
            loading={loading}
            onEdit={openEdit}
            onToggle={toggleSupplier}
          />
        </div>
      </div>

      {/* Mobile */}
      <div className="min-h-screen w-full overflow-x-hidden bg-gray-50 pb-24 lg:hidden">
        {/* Same header system as the Purchases mobile page */}
        <div className="w-full border-b bg-white px-5 pt-6 pb-5">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100">
              <Truck
                size={21}
                className="text-blue-600"
              />
            </div>

            <div className="min-w-0">
              <h1 className="text-3xl font-bold text-gray-900">
                Suppliers
              </h1>

              <p className="mt-1 text-gray-500">
                Manage suppliers available for purchase bills.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 px-4 pt-5">
          <button
            type="button"
            onClick={openAdd}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition active:scale-[0.99]"
          >
            <Plus size={17} />
            Add Supplier
          </button>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 bg-white px-5 py-4">
              <h2 className="text-sm font-semibold text-gray-900">
                Supplier List
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Active suppliers appear in purchase forms.
              </p>
            </div>

            <SupplierTable
              suppliers={suppliers}
              loading={loading}
              onEdit={openEdit}
              onToggle={toggleSupplier}
            />
          </div>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showAdd && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeForm();
            }
          }}
          onTouchStart={(event) => {
            if (event.target === event.currentTarget) {
              closeForm();
            }
          }}
        >
          <div
            className="w-full max-h-[90vh] overflow-y-auto rounded-t-[24px] bg-white shadow-2xl sm:max-w-md sm:rounded-2xl"
            onMouseDown={(event) => event.stopPropagation()}
            onTouchStart={(event) => event.stopPropagation()}
          >
            <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
              <h2 className="text-xl font-bold text-slate-900">
                {editingSupplier
                  ? "Edit Supplier"
                  : "Add Supplier"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {editingSupplier
                  ? "Update the supplier name."
                  : "Add a supplier to the purchase dropdown."}
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-5 sm:p-6"
            >
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Supplier Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  autoFocus
                  placeholder="Enter supplier name"
                  className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-11 w-full rounded-xl bg-blue-600 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                >
                  {isSubmitting
                    ? "Saving..."
                    : editingSupplier
                      ? "Save Changes"
                      : "Add Supplier"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
