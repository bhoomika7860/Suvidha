import PurchaseOrderTable from "./PurchaseOrderTable";
import CreatePurchaseOrderModal from "./CreatePurchaseOrderModal";
import purchaseService from "../../../services/purchaseService";

export default function PurchaseOrders({
  purchaseOrders,
  setPurchaseOrders,
  showModal,
  setShowModal,
}) {

  async function addPurchaseOrder(order) {
  try {

    await purchaseService.createPurchaseOrder(
      order
    );

    const updated =
      await purchaseService.getPurchaseOrders();

    setPurchaseOrders(updated);

    setShowModal(false);

  } catch (err) {

    console.error(err);

  }
}

  return (

    <>

      <PurchaseOrderTable
  purchaseOrders={purchaseOrders}
  onSavePurchase={async (purchase) => {
    await purchaseService.createPurchase(purchase);

    await purchaseService.updatePurchaseOrderStatus(
      purchase.purchase_order_id,
      "Completed"
    );

    const [
      purchases,
      orders,
    ] = await Promise.all([
      purchaseService.getPurchases(),
      purchaseService.getPurchaseOrders(),
    ]);

    setPurchaseOrders(orders);
  }}
/>

      <CreatePurchaseOrderModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSave={addPurchaseOrder}
      />

    </>

  );

}