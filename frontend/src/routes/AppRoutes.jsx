import { Routes, Route } from "react-router-dom";

import Dashboard from "../pages/owner/Dashboard";
import DailyReportView from "../pages/DailyReportView/DailyReportView";
import Stores from "../pages/owner/Stores";
import LoginScreen from "../pages/auth/LoginScreen";
import OwnerLayout from "../components/layout/OwnerLayout";
import DailyReports from "../pages/owner/DailyReports";
import Analytics from "../pages/analytics/Analytics";
import StaffManagement from "../pages/owner/StaffManagement";
import OwnerPurchases from "../pages/owner/OwnerPurchases";
import OwnerUdhaar from "../pages/owner/OwnerUdhaar";
import Suppliers from "../pages/owner/Suppliers";
import Tasks from "../pages/owner/Tasks";

import ManagerDashboard from "../pages/manager/Dashboard";
import ManagerLayout from "../components/layout/ManagerLayout";
import Purchases from "../pages/manager/Purchases";
import Expenses from "../pages/manager/Expenses";
import DailyReport from "../pages/manager/DailyReport";
import PreviousReports from "../pages/manager/PreviousReports";
import Profile from "../pages/manager/Profile";
import Udhaar from "../pages/manager/Udhaar";

import StaffLayout from "../components/layout/StaffLayout";
import StaffDashboard from "../pages/staff/StaffDashboard";
import StaffTasks from "../pages/staff/StaffTasks";
import StaffPurchases from "../pages/staff/StaffPurchases";
import StaffExpenses from "../pages/staff/StaffExpenses";
import StaffUdhaar from "../pages/staff/Udhaar";

import Delivery from "../pages/delivery/Delivery";

import ProtectedRoute from "../components/auth/ProtectedRoute";
import { ROLES } from "../constants/roles";

function AppRoutes() {
  return (
    <Routes>

      {/* ================= LOGIN ================= */}

      <Route
        path="/"
        element={<LoginScreen />}
      />


      {/* ================= OWNER ================= */}

      <Route
        element={
          <ProtectedRoute
            allowedRoles={[ROLES.OWNER]}
          >
            <OwnerLayout />
          </ProtectedRoute>
        }
      >

        <Route
          path="/owner-dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/analytics"
          element={<Analytics />}
        />

        <Route
          path="/staff-management"
          element={<StaffManagement />}
        />

        <Route
          path="/daily-reports"
          element={<DailyReports />}
        />

        <Route
          path="/daily-reports/:storeId"
          element={<DailyReports />}
        />

        <Route
          path="/tasks"
          element={<Tasks />}
        />

        <Route
          path="/owner/udhaar"
          element={<OwnerUdhaar />}
        />

        <Route
          path="/stores"
          element={<Stores />}
        />

        <Route
          path="/owner-purchases"
          element={<OwnerPurchases />}
        />

        <Route
          path="/suppliers"
          element={<Suppliers />}
        />

        <Route
          path="/previous-reports"
          element={<PreviousReports />}
        />

        <Route
          path="/daily-reports/report/:id"
          element={<DailyReportView />}
        />

      </Route>


      {/* ================= MANAGER ================= */}

      <Route
        element={
          <ProtectedRoute
            allowedRoles={[ROLES.STORE_MANAGER]}
          >
            <ManagerLayout />
          </ProtectedRoute>
        }
      >

        <Route
          path="/manager-dashboard"
          element={<ManagerDashboard />}
        />

        <Route
          path="/daily-report"
          element={<DailyReport />}
        />

        <Route
          path="/manager-previous-reports"
          element={<PreviousReports />}
        />

        <Route
          path="/manager-purchases"
          element={<Purchases />}
        />

        <Route
          path="/manager-expenses"
          element={<Expenses />}
        />

        <Route
          path="/manager/udhaar"
          element={<Udhaar />}
        />

        <Route
          path="/manager-tasks"
          element={<StaffTasks />}
        />

      </Route>


      {/* ================= STAFF ================= */}

      <Route
        element={
          <ProtectedRoute
            allowedRoles={[ROLES.STAFF]}
          >
            <StaffLayout />
          </ProtectedRoute>
        }
      >

        <Route
          path="/staff-dashboard"
          element={<StaffDashboard />}
        />

        <Route
          path="/staff/udhaar"
          element={<StaffUdhaar />}
        />

        <Route
          path="/staff-tasks"
          element={<StaffTasks />}
        />

        <Route
          path="/staff-purchases"
          element={<StaffPurchases />}
        />

        <Route
          path="/staff-expenses"
          element={<StaffExpenses />}
        />

      </Route>


      {/* ================= DELIVERY ================= */}

      <Route
        path="/delivery"
        element={
          <ProtectedRoute
            allowedRoles={[ROLES.DELIVERY]}
          >
            <Delivery />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default AppRoutes;