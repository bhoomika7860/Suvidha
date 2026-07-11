import { useState } from "react";

import DeliveryHeader from "../../components/delivery/DeliveryHeader";
import TargetCard from "../../components/delivery/TargetCard";
import DeliveryToolbar from "../../components/delivery/DeliveryToolbar";
import DeliveryTable from "../../components/delivery/DeliveryTable";
import AddDeliveryModal from "../../components/delivery/AddDeliveryModal";

export default function Delivery() {

  const [showModal, setShowModal] = useState(false);

  const [deliveries, setDeliveries] = useState([
    {
      id: 1,
      customer: "Rahul Sharma",
      billNo: "SP1023",
      payment: 850,
      paymentMethod: "Cash",
      notes: "Delivered successfully.",
    },
    {
      id: 2,
      customer: "Amit Kumar",
      billNo: "CP871",
      payment: 620,
      paymentMethod: "UPI",
      notes: "Collected payment.",
    },
  ]);

  function addDelivery(delivery) {

    setDeliveries(prev => [
      {
        id: Date.now(),
        ...delivery,
      },
      ...prev,
    ]);

    setShowModal(false);

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