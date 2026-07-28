import PurchaseOrderTable from "./PurchaseOrderTable";
import CreatePurchaseOrderModal from "./CreatePurchaseOrderModal";
import purchaseService from "../../../services/purchaseService";

export default function PurchaseOrders({
  purchaseOrders,
  setPurchaseOrders,
  showModal,
  setShowModal,
  setActiveTab,
}) {

  async function addPurchaseOrder(order) {
    try {
      await purchaseService.createPurchaseOrder(order);

      const orders =
        await purchaseService.getPurchaseOrders();

      setPurchaseOrders(orders);

      setShowModal(false);
    } catch (err) {
      console.error(err);
    }
  }

  async function receivePurchaseOrder(order) {
    try {
      await purchaseService.updatePurchaseOrderStatus(
        order.id,
        "Completed"
      );

      const orders =
        await purchaseService.getPurchaseOrders();

      setPurchaseOrders(orders);

      setActiveTab("received");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <PurchaseOrderTable
        purchaseOrders={purchaseOrders}
        onReceiveBill={receivePurchaseOrder}
      />

      <CreatePurchaseOrderModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSave={addPurchaseOrder}
      />
    </>
  );
}