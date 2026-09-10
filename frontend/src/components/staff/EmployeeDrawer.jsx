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
  const [performance, setPerformance] = useState(null);
  const [statistics, setStatistics] = useState(null);

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

      setPerformance(null);
      setStatistics(null);
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
      console.error(
        "Failed to delete employee",
        error
      );

      alert(
        error?.response?.data?.detail ||
          "Failed to delete employee."
      );
    }
  }

  if (loading) {
    return (
      <>
        <button
          type="button"
          aria-label="Close employee drawer"
          onClick={onClose}
          className="fixed inset-0 z-[60] bg-black/35"
        />

        {/* Desktop loading drawer */}
        <div className="fixed bottom-0 right-0 top-0 z-[70] hidden w-[500px] items-center justify-center bg-[#F9FAFB] shadow-2xl lg:flex">
          <p className="text-sm text-[#64748B]">
            Loading employee performance...
          </p>
        </div>

        {/* Mobile loading drawer */}
        <div className="fixed inset-0 z-[70] flex flex-col bg-[#F9FAFB] lg:hidden">
          <div className="h-1 w-full bg-[#2563EB]" />
          <div className="flex flex-1 items-center justify-center">
            <p className="text-sm text-[#64748B]">
              Loading employee performance...
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <button
        type="button"
        aria-label="Close employee drawer"
        onClick={onClose}
        className="fixed inset-0 z-[60] bg-black/35"
      />

      {/* =========================================================
          DESKTOP
      ========================================================= */}

      <div className="fixed bottom-0 right-0 top-0 z-[70] hidden w-[500px] flex-col bg-[#F9FAFB] shadow-2xl lg:flex">
        <div className="shrink-0">
          <PerformanceHeader
            employee={employee}
            onClose={onClose}
          />
        </div>

        <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-6">
          {performance && (
            <>
              <PerformanceRing
                score={performance.overall_score}
              />

              <PerformanceSummary
                performance={performance}
              />

              <EmployeeInformation
                employee={employee}
              />
            </>
          )}
        </div>

        <div className="shrink-0 border-t border-[#E5E7EB] bg-white">
          <DrawerActions
            onEdit={handleEdit}
            onDelete={() => setShowDeleteModal(true)}
          />
        </div>
      </div>

      {/* =========================================================
          MOBILE
          Full-screen drawer so it never sits underneath the
          bottom navigation or gets clipped.
      ========================================================= */}

      <div className="fixed inset-0 z-[70] flex flex-col overflow-hidden bg-[#F9FAFB] lg:hidden">
        {/* Small top handle / drawer accent */}
        <div className="flex h-5 shrink-0 items-center justify-center bg-white">
          <div className="h-1 w-9 rounded-full bg-[#CBD5E1]" />
        </div>

        {/* Employee header */}
        <div className="shrink-0 border-b border-[#E5E7EB] bg-white">
          <PerformanceHeader
            employee={employee}
            onClose={onClose}
          />
        </div>

        {/* Scrollable employee details */}
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          {performance ? (
            <div className="space-y-4">
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
          ) : (
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 text-center text-sm text-[#64748B]">
              Performance information is unavailable.
            </div>
          )}
        </div>

        {/* Fixed actions — always completely visible */}
        <div className="shrink-0 border-t border-[#E5E7EB] bg-white px-4 pb-4 pt-3">
          <DrawerActions
            onEdit={handleEdit}
            onDelete={() => setShowDeleteModal(true)}
          />
        </div>
      </div>

      {showDeleteModal && (
        <DeleteEmployeeModal
          employee={employee}
          onClose={() => setShowDeleteModal(false)}
          onDelete={handleDelete}
        />
      )}
    </>
  );
}
