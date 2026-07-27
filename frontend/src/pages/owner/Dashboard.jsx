import useIsMobile from "../../hooks/useIsMobile";

import OwnerDashboardDesktop from "./OwnerDashboardDesktop";
import OwnerDashboardMobile from "./OwnerDashboardMobile";

export default function Dashboard() {
  const isMobile = useIsMobile();

  return isMobile ? (
    <OwnerDashboardMobile />
  ) : (
    <OwnerDashboardDesktop />
  );
}