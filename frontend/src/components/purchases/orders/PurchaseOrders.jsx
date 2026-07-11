import PurchaseOrderTable from "./PurchaseOrderTable";
import CreatePurchaseOrderModal from "./CreatePurchaseOrderModal";

export default function PurchaseOrders({
  purchaseOrders,
  setPurchaseOrders,
  showModal,
  setShowModal,
}) {

  function addPurchaseOrder(order) {

    setPurchaseOrders(prev => [

      {
        id: Date.now(),
        ...order,
      },

      ...prev,

    ]);

    setShowModal(false);

  }

  return (

    <>

      <PurchaseOrderTable
        purchaseOrders={purchaseOrders}
      />

      <CreatePurchaseOrderModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSave={addPurchaseOrder}
      />

    </>

  );

}