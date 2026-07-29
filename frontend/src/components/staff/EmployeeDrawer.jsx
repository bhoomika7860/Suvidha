import { useEffect, useState } from "react";

import { staffService } from "../../services/staffService";

import PerformanceHeader from "./drawer/PerformanceHeader";
import PerformanceRing from "./drawer/PerformanceRing";
import PerformanceSummary from "./drawer/PerformanceSummary";

import EmployeeInformation from "./drawer/EmployeeInformation";
import DrawerActions from "./drawer/DrawerActions";
import DeleteEmployeeModal from "./drawer/DeleteEmployeeModal";

export default function EmployeeDrawer({
  employee,
  onClose,
  onEmployeeUpdated,
}) {
  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [loading, setLoading] = useState(true);

  const [performance, setPerformance] =
    useState(null);

  const [statistics, setStatistics] =
    useState(null);

  useEffect(() => {
    if (employee?.id) {
      loadPerformance();
    }
  }, [employee]);

  async function loadPerformance() {
    try {
      setLoading(true);

      const response =
        await staffService.getEmployeePerformance(
          employee.id
        );

      setPerformance(response.performance);
      setStatistics(response.statistics);
    } catch (error) {
      console.error(
        "Failed to load employee performance",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  function handleEdit() {
    console.log("Edit employee", employee);
  }

  async function handleDelete() {
  try {
    await staffService.deleteEmployee(employee.id);

    setShowDeleteModal(false);

    if (onEmployeeUpdated) {
      await onEmployeeUpdated();
    }

    onClose();
  } catch (error) {
    console.error("Failed to delete employee", error);

    alert(
      error?.response?.data?.detail ||
      "Failed to delete employee."
    );
  }
}
  if (loading) {
    return (
      <>
        <div
          className="fixed inset-0 z-40 bg-black/30"
          onClick={onClose}
        />

        <div className="fixed right-0 top-0 bottom-0 z-50 flex w-[500px] items-center justify-center bg-[#F9FAFB] shadow-2xl">

          <div className="text-gray-500 text-lg">
            Loading employee performance...
          </div>

        </div>
      </>
    );
  }

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/30"
        onClick={onClose}
      />

      <div className="fixed right-0 top-0 bottom-0 z-50 flex w-[500px] flex-col bg-[#F9FAFB] shadow-2xl">

        <PerformanceHeader
          employee={employee}
          onClose={onClose}
        />

        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          <PerformanceRing
            score={performance.overall_score}
          />

          <PerformanceSummary
            performance={performance}
          />

          

          <EmployeeInformation
            employee={employee}
          />

        </div>

        <DrawerActions
          onEdit={handleEdit}
          onDelete={() =>
            setShowDeleteModal(true)
          }
        />

      </div>

      {showDeleteModal && (
        <DeleteEmployeeModal
          employee={employee}
          onClose={() =>
            setShowDeleteModal(false)
          }
          onDelete={handleDelete}
        />
      )}
    </>
  );
}