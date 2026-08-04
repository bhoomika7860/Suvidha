import { useEffect, useMemo, useState } from "react";

import Purchases from "../manager/Purchases";

import purchaseService from "../../services/purchaseService";

import PurchaseStats from "../../components/purchases/PurchaseStats";

import PurchaseToolbar from "../../components/purchases/PurchaseToolbar";

import PurchaseOrderCard from "../../components/staff/purchases/PurchaseOrderCard";
import PurchaseBillCard from "../../components/staff/purchases/PurchaseBillCard";

import PurchaseOrderSheet from "../../components/staff/purchases/PurchaseOrderSheet";
import PurchaseBillSheet from "../../components/staff/purchases/PurchaseBillSheet";

import CreatePurchaseOrderSheet from "../../components/staff/purchases/CreatePurchaseOrderSheet";
import ReceiveBillSheet from "../../components/staff/purchases/ReceiveBillSheet";

import {
  Search,
  ClipboardList,
  Receipt,
} from "lucide-react";

export default function StaffPurchases() {

  /* ================= STATE ================= */

  const [search, setSearch] = useState("");

  const [activeTab, setActiveTab] =
    useState("orders");

  const [activeFilter, setActiveFilter] =
    useState("received");

  const [purchaseOrders,
    setPurchaseOrders] = useState([]);

  const [purchases,
    setPurchases] = useState([]);

  const [selectedOrder,
    setSelectedOrder] = useState(null);

  const [selectedPurchase,
    setSelectedPurchase] = useState(null);

  const [showOrderSheet,
    setShowOrderSheet] = useState(false);

  const [showReceiveSheet,
    setShowReceiveSheet] = useState(false);

  /* ================= LOAD ================= */

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {

    try {

      const [
        purchaseData,
        purchaseOrderData,
      ] = await Promise.all([

        purchaseService.getTodayPurchases(),

        purchaseService.getPurchaseOrders(),

      ]);

      setPurchases(purchaseData);

      setPurchaseOrders(
        purchaseOrderData
      );

    } catch (err) {

      console.error(err);

    }

  }

  /* ================= CREATE BILL ================= */

  async function addPurchase(purchase) {

    try {

      await purchaseService.createPurchase(
        purchase
      );

      await loadData();

      setShowReceiveSheet(false);

    } catch (err) {

      console.error(err);

    }

  }

  /* ================= CREATE ORDER ================= */

  async function addPurchaseOrder(order) {

    try {

      await purchaseService.createPurchaseOrder(
        order
      );

      await loadData();

      setShowOrderSheet(false);

    } catch (err) {

      console.error(err);

    }

  }

  /* ================= RECEIVE ORDER ================= */

  async function receivePurchaseOrder(
    order
  ) {

    try {

      await purchaseService.updatePurchaseOrderStatus(
        order.id,
        "Received"
      );

      await loadData();

      setActiveTab("received");

    } catch (err) {

      console.error(err);

    }

  }

  /* ================= FILTER PURCHASES ================= */

  const filteredPurchases =
    useMemo(() => {

      return purchases.filter(
        (purchase) => {

          const matchesSearch =

            (purchase.supplier_name || "")
              .toLowerCase()
              .includes(
                search.toLowerCase()
              )

            ||

            (purchase.bill_number || "")
              .toLowerCase()
              .includes(
                search.toLowerCase()
              );

          const matchesStatus =
            purchase.status === activeFilter;

          return (
            matchesSearch &&
            matchesStatus
          );

        }
      );

    }, [
      purchases,
      search,
      activeFilter,
    ]);

  /* ================= FILTER ORDERS ================= */

  const filteredOrders =
    useMemo(() => {

      return purchaseOrders.filter(
        (order) =>

          order.supplier_name
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )

      );

    }, [
      purchaseOrders,
      search,
    ]);

      return (
    <>
      {/* ================= DESKTOP ================= */}

      <div className="hidden lg:block">
        <Purchases />
      </div>

      {/* ================= MOBILE ================= */}

      <div className="lg:hidden min-h-screen bg-gray-50 pb-24">

        {/* Header */}

        <div className="bg-white px-5 pt-6 pb-5 border-b">

          <h1 className="text-3xl font-bold">
            Purchases
          </h1>

          <p className="text-gray-500 mt-2">
            Manage purchase orders and bills.
          </p>

        </div>

        <div className="px-4 py-5 space-y-5">

          {/* Tabs */}

          <div className="grid grid-cols-2 rounded-2xl bg-gray-200 p-1">

            <button
              onClick={() =>
                setActiveTab("orders")
              }
              className={`h-11 rounded-xl text-sm font-semibold transition ${
                activeTab === "orders"
                  ? "bg-white shadow text-blue-600"
                  : "text-gray-600"
              }`}
            >
              Purchase Orders
            </button>

            <button
              onClick={() =>
                setActiveTab("received")
              }
              className={`h-11 rounded-xl text-sm font-semibold transition ${
                activeTab === "received"
                  ? "bg-white shadow text-blue-600"
                  : "text-gray-600"
              }`}
            >
              Received Bills
            </button>

          </div>

          {/* Stats */}

          <PurchaseStats
            purchases={purchases}
            purchaseOrders={purchaseOrders}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            activeTab={activeTab}
          />

          {/* Search */}

          <div className="relative">

            <Search
              size={18}
              className="absolute left-4 top-3.5 text-gray-400"
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder={
                activeTab === "orders"
                  ? "Search purchase orders..."
                  : "Search bills..."
              }
              className="w-full h-11 rounded-xl border border-gray-200 bg-white pl-11 pr-4 outline-none"
            />

          </div>

          {/* Action Button */}

          {activeTab === "orders" ? (

            <button
              onClick={() =>
                setShowOrderSheet(true)
              }
              className="w-full h-12 rounded-2xl bg-blue-600 text-white font-semibold"
            >
              Create Purchase Order
            </button>

          ) : (

            <button
              onClick={() =>
                setShowReceiveSheet(true)
              }
              className="w-full h-12 rounded-2xl bg-blue-600 text-white font-semibold"
            >
              Receive New Bill
            </button>

          )}

          {/* ================= ORDER LIST ================= */}

          {activeTab === "orders" && (

            filteredOrders.length === 0 ? (

              <div className="bg-white rounded-2xl border border-gray-200 py-16 text-center">

                <ClipboardList
                  size={40}
                  className="mx-auto text-gray-300"
                />

                <p className="mt-4 text-gray-500">
                  No purchase orders found.
                </p>

              </div>

            ) : (

              <div className="space-y-4">

                {filteredOrders.map((order) => (

                  <PurchaseOrderCard
                    key={order.id}
                    order={order}
                    onClick={() =>
                      setSelectedOrder(order)
                    }
                  />

                ))}

              </div>

            )

          )}

          {/* ================= BILL LIST ================= */}

          {activeTab === "received" && (

            filteredPurchases.length === 0 ? (

              <div className="bg-white rounded-2xl border border-gray-200 py-16 text-center">

                <Receipt
                  size={40}
                  className="mx-auto text-gray-300"
                />

                <p className="mt-4 text-gray-500">
                  No bills found.
                </p>

              </div>

            ) : (

              <div className="space-y-4">

                {filteredPurchases.map((purchase) => (

                  <PurchaseBillCard
                    key={purchase.id}
                    purchase={purchase}
                    onClick={() =>
                      setSelectedPurchase(
                        purchase
                      )
                    }
                  />

                ))}

              </div>

            )

          )}

        </div>

          {/* ================= Bottom Sheets ================= */}

          <PurchaseOrderSheet
            order={selectedOrder}
            isOpen={selectedOrder !== null}
            onClose={() =>
              setSelectedOrder(null)
            }
            onReceiveBill={receivePurchaseOrder}
          />

          <PurchaseBillSheet
            purchase={selectedPurchase}
            isOpen={selectedPurchase !== null}
            onClose={() =>
              setSelectedPurchase(null)
            }
            setPurchases={setPurchases}
          />

          <CreatePurchaseOrderSheet
            open={showOrderSheet}
            onClose={() =>
              setShowOrderSheet(false)
            }
            onSave={addPurchaseOrder}
          />

          <ReceiveBillSheet
            isOpen={showReceiveSheet}
            onClose={() =>
              setShowReceiveSheet(false)
            }
            onSave={addPurchase}
          />

        </div>


    </>
  );
}