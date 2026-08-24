import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Power,
  Truck,
} from "lucide-react";

import supplierService from "../../services/supplierService";

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAdd, setShowAdd] =
    useState(false);

  const [editingSupplier, setEditingSupplier] =
    useState(null);

  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  useEffect(() => {
    loadSuppliers();
  }, []);

  async function loadSuppliers() {
    try {
      setLoading(true);

      const data =
        await supplierService.getAllSuppliers();

      setSuppliers(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (error) {
      console.error(
        "Failed to load suppliers:",
        error
      );

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

    const trimmedName =
      name.trim();

    if (!trimmedName) {
      alert(
        "Supplier name cannot be empty."
      );
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
      console.error(
        "Failed to save supplier:",
        error
      );

      alert(
        error?.response?.data?.detail ||
          "Failed to save supplier."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function toggleSupplier(supplier) {
    const action =
      supplier.is_active
        ? "deactivate"
        : "activate";

    const confirmed =
      window.confirm(
        `Are you sure you want to ${action} "${supplier.name}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      await supplierService.updateSupplier(
        supplier.id,
        {
          is_active:
            !supplier.is_active,
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
    <div className="space-y-6">

      {/* Header */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>

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


      {/* Supplier List */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">

          <h2 className="font-semibold text-slate-900">
            Supplier List
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Active suppliers appear in purchase forms.
          </p>

        </div>

        {loading ? (

          <div className="p-12 text-center text-slate-500">
            Loading suppliers...
          </div>

        ) : suppliers.length === 0 ? (

          <div className="p-12 text-center text-slate-500">
            No suppliers found.
          </div>

        ) : (

          <div className="divide-y divide-slate-100">

            {suppliers.map(
              (supplier) => (

                <div
                  key={supplier.id}
                  className="flex flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
                >

                  <div>

                    <p className="font-semibold text-slate-900">
                      {supplier.name}
                    </p>

                    <div className="mt-1">

                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          supplier.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {supplier.is_active
                          ? "Active"
                          : "Inactive"}
                      </span>

                    </div>

                  </div>

                  <div className="flex gap-2">

                    <button
                      type="button"
                      onClick={() =>
                        openEdit(supplier)
                      }
                      className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <Pencil size={16} />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        toggleSupplier(
                          supplier
                        )
                      }
                      className={`flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-medium ${
                        supplier.is_active
                          ? "border border-red-200 text-red-600 hover:bg-red-50"
                          : "border border-green-200 text-green-600 hover:bg-green-50"
                      }`}
                    >
                      <Power size={16} />

                      {supplier.is_active
                        ? "Deactivate"
                        : "Activate"}
                    </button>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>


      {/* Add / Edit Modal */}

      {showAdd && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">

            <div className="border-b border-slate-200 px-6 py-5">

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
              className="space-y-5 p-6"
            >

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Supplier Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(
                      event.target.value
                    )
                  }
                  autoFocus
                  placeholder="Enter supplier name"
                  className="h-11 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-blue-500"
                />

              </div>

              <div className="flex gap-3">

                <button
                  type="button"
                  onClick={closeForm}
                  className="h-11 flex-1 rounded-xl border border-slate-200 font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-11 flex-1 rounded-xl bg-blue-600 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
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