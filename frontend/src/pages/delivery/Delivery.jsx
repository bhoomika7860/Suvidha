import { useState } from "react";
import { useEffect } from "react";
import deliveryService from "../../services/deliveryService";
import DeliveryHeader from "../../components/delivery/DeliveryHeader";
import TargetCard from "../../components/delivery/TargetCard";
import DeliveryToolbar from "../../components/delivery/DeliveryToolbar";
import DeliveryTable from "../../components/delivery/DeliveryTable";
import AddDeliveryModal from "../../components/delivery/AddDeliveryModal";
import dailyReportsService from "../../services/dailyReportsService";

export default function Delivery() {

  const [showModal, setShowModal] = useState(false);

  const [deliveries, setDeliveries] = useState([]);

  const [reportId, setReportId] = useState(null);

  async function loadDeliveries() {
  try {
    const report =
      await dailyReportsService.getTodayReport();

    setReportId(report.id);

    const data =
      await deliveryService.getDeliveries();

    setDeliveries(data);

  } catch (err) {
    console.error(err);
  }
}

useEffect(() => {
  loadDeliveries();
}, []);

async function addDelivery(delivery) {
  try {
    await deliveryService.createDelivery({
  daily_report_id: reportId,
  customer_name: delivery.customer_name,
  status: "completed",

  bill_number: delivery.bill_number,
  payment_amount: delivery.payment_amount,
  payment_method: delivery.payment_method,
  notes: delivery.notes,
  billImage: delivery.billImage,
});

    await loadDeliveries();

    setShowModal(false);

  } catch (err) {
    console.error(err);
  }
}

  return (

    <div className="max-w-md mx-auto min-h-screen bg-gray-50">

      <DeliveryHeader />

      <div className="p-4 space-y-5">

        <TargetCard />

        <DeliveryToolbar
          onAdd={() => setShowModal(true)}
        />

        <DeliveryTable
  deliveries={deliveries}
  reloadDeliveries={loadDeliveries}
/>

      </div>

      <AddDeliveryModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={addDelivery}
      />

    </div>

  );

}