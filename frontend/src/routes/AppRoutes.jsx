import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/owner/Dashboard";
import DailyReportView from "../pages/DailyReportView/DailyReportView";
import StoreDashboard from "../pages/store/Dashboard";
import LoginScreen from "../pages/auth/LoginScreen";
import OwnerLayout from "../components/layout/OwnerLayout";
import DailyReports from "../pages/owner/DailyReports";
import Analytics from "../pages/analytics/Analytics";
import StaffManagement from "../pages/staff_management/StaffManagement";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginScreen />} />
      <Route
  path="/owner-dashboard"
  element={
    <OwnerLayout>
      <Dashboard />
    </OwnerLayout>
  }
/>
<Route
  path="/analytics"
  element={
    <OwnerLayout>
      <Analytics />
    </OwnerLayout>
  }
/>

<Route
  path="/daily-reports"
  element={
    <OwnerLayout>
      <DailyReports />
    </OwnerLayout>
  }
/>

<Route
  path="/daily-reports/:storeId"
  element={
    <OwnerLayout>
      <DailyReports />
    </OwnerLayout>
  }
/>

<Route
  path="/daily-reports/report/:id"
  element={
    <OwnerLayout>
      <DailyReportView />
    </OwnerLayout>
  }
/>
      <Route path="/staff-dashboard" element={<StoreDashboard />} />

      <Route
  path="/staff"
  element={
    <OwnerLayout>
      <StaffManagement />
    </OwnerLayout>
  }
/>
    </Routes>
  );
}




export default AppRoutes;
