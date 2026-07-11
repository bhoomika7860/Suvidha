import HeroCard from "../../components/manager/hero/HeroCard";
import KPISection from "../../components/manager/KPISection";
import ProgressChecklist from "../../components/manager/ProgressChecklist";
import SalesSummary from "../../components/manager/SalesSummary";
import QuickActions from "../../components/manager/QuickActions";
import PurchaseSummary from "../../components/manager/PurchaseSummary";
import ExpenseSummary from "../../components/manager/ExpenseSummary";
import BouncedProducts from "../../components/manager/BouncedProducts";


export default function Dashboard() {
  return (
    <div className="space-y-6">

    <HeroCard />

    <KPISection />


<div className="grid grid-cols-3 gap-6">

    <ProgressChecklist />

    <SalesSummary />

    <QuickActions />

</div>

<div className="grid grid-cols-3 gap-6">

    <PurchaseSummary />

    <ExpenseSummary />

    <BouncedProducts />

</div>
</div>

    
  );
}

