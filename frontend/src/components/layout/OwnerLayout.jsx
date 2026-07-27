import OwnerDesktopLayout from "./OwnerDesktopLayout";
import OwnerMobileLayout from "./OwnerMobileLayout";

export default function OwnerLayout() {
  const isMobile = window.innerWidth < 1024;

  return isMobile
    ? <OwnerMobileLayout />
    : <OwnerDesktopLayout />;
}