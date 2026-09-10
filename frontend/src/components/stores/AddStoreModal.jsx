import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { staffService } from "../../services/staffService";

export default function AddStoreModal({
  open,
  onClose,
  onSave,
}) {
  const [staff, setStaff] = useState([]);

  const [form, setForm] = useState({
    name: "",
    code: "",
    address: "",
    manager_name: "",
  });

  useEffect(() => {
    async function loadManagers() {
      try {
        const users = await staffService.getUsers();

        setStaff(
          users.filter(
            (user) =>
              user.role === "store_manager"
          )
        );
      } catch (err) {
        console.error(err);
      }
    }

    if (open) {
      loadManagers();
    }
  }, [open]);

  if (!open) return null;

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "manager_id"
          ? Number(value)
          : value,
    }));
  }

  function handleSave() {
    if (
      !form.name ||
      !form.code ||
      !form.address ||
      !form.manager_name
    ) {
      alert("Please fill all fields.");
      return;
    }

    onSave(form);

    setForm({
      name: "",
      code: "",
      address: "",
      manager_name: "",
    });
  }

  return (
    <>
      <div
        onClick={onClose}
        className="
          fixed
          inset-0
          z-40
          bg-black/40
        "
      />

      <div
        className="
          fixed
          inset-0
          z-50
          flex
          items-end
          justify-center
          p-0
          lg:items-center
          lg:p-6
        "
      >

        <div
          className="
            flex
            max-h-[92vh]
            w-full
            max-w-full
            flex-col
            overflow-hidden
            rounded-t-2xl
            bg-white
            shadow-xl
            lg:w-[520px]
            lg:max-h-none
            lg:rounded-2xl
          "
        >

          {/* Header */}

          <div
            className="
              flex
              shrink-0
              items-center
              justify-between
              border-b
              px-5
              py-4
              lg:px-6
              lg:py-5
            "
          >

            <h2 className="text-xl font-bold text-gray-900 lg:text-2xl">
              Add Store
            </h2>

            <button
              type="button"
              onClick={onClose}
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                bg-gray-100
                text-gray-500
                hover:bg-gray-200
              "
            >
              <X size={19} />
            </button>

          </div>


          {/* Body */}

          <div
            className="
              flex-1
              overflow-y-auto
              p-5
              lg:p-6
            "
          >

            <div className="space-y-4 lg:space-y-5">

              <input
                name="name"
                placeholder="Store Name"
                value={form.name}
                onChange={handleChange}
                className="
                  h-11
                  w-full
                  rounded-xl
                  border
                  border-gray-200
                  px-4
                  text-sm
                  outline-none
                  focus:border-blue-400
                  focus:ring-2
                  focus:ring-blue-100
                "
              />

              <input
                name="code"
                placeholder="Store Code"
                value={form.code}
                onChange={handleChange}
                className="
                  h-11
                  w-full
                  rounded-xl
                  border
                  border-gray-200
                  px-4
                  text-sm
                  outline-none
                  focus:border-blue-400
                  focus:ring-2
                  focus:ring-blue-100
                "
              />

              <textarea
                rows={4}
                name="address"
                placeholder="Address"
                value={form.address}
                onChange={handleChange}
                className="
                  w-full
                  resize-none
                  rounded-xl
                  border
                  border-gray-200
                  p-3
                  text-sm
                  outline-none
                  focus:border-blue-400
                  focus:ring-2
                  focus:ring-blue-100
                "
              />

              <input
                name="manager_name"
                placeholder="Store Manager Name"
                value={form.manager_name}
                onChange={handleChange}
                className="
                  h-11
                  w-full
                  rounded-xl
                  border
                  border-gray-200
                  px-4
                  text-sm
                  outline-none
                  focus:border-blue-400
                  focus:ring-2
                  focus:ring-blue-100
                "
              />

            </div>

          </div>


          {/* Footer */}

          <div
            className="
              flex
              shrink-0
              gap-3
              border-t
              p-4
              lg:justify-end
              lg:p-5
            "
          >

            <button
              type="button"
              onClick={onClose}
              className="
                h-11
                flex-1
                rounded-xl
                border
                border-gray-200
                text-sm
                font-medium
                text-gray-700
                hover:bg-gray-50
                lg:flex-none
                lg:px-5
              "
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="
                h-11
                flex-1
                rounded-xl
                bg-blue-600
                text-sm
                font-medium
                text-white
                hover:bg-blue-700
                lg:flex-none
                lg:px-5
              "
            >
              Save Store
            </button>

          </div>

        </div>

      </div>
    </>
  );
}