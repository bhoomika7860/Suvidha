import { useMediaQuery } from "react-responsive";
import DesktopDashboard from "./DesktopDashboard";
import MobileDashboard from "./MobileDashboard";

export default function Dashboard() {
  const isMobile = useMediaQuery({
    maxWidth: 1023,
  });

  return isMobile
    ? <MobileDashboard />
    : <DesktopDashboard />;
}