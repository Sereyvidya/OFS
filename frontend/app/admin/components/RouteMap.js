"use client";

import React, { useEffect, useRef } from "react";

const RouteMap = ({ onClose, showOrders, pendingOrders, setPendingOrders,
  enRouteOrders, setEnRouteOrders, deliveredOrders, setDeliveredOrders,
  mapKey, setMapKey
}) => {

  const pollingRef = useRef(null);

  function OrderList({ title, orders }) {
    return (
      <div>
        <h3 className="text-xl text-[#41644a] font-semibold mb-2">{title}</h3>
        {orders.length > 0 ? (
          orders.map((order) => <OrderCard key={order.orderID} order={order} />)
        ) : (
          <p className="text-gray-400 italic">No orders</p>
        )}
      </div>
    );
  }
  
  function OrderCard({ order }) {
    return (
      <div className="border px-4 py-2 rounded shadow-sm bg-[#a8cbb0] text-[#41644a] mb-2">
        <p>
          <strong>#{order.orderID}</strong> — {order.address}
        </p>
        <p>Weight: {order.weight.toFixed(2)} lbs</p>
        <p>Status: {order.status}</p>
      </div>
    );
  }

  const fetchOrders = () => {
    fetch("http://127.0.0.1:5000/order/all-statuses")
      .then((res) => res.json())
      .then((data) => {
        if (data.orders) {
          setPendingOrders(data.orders.filter((o) => o.status === "awaiting"));
          setEnRouteOrders(data.orders.filter((o) => o.status === "en route"));
          setDeliveredOrders(
            data.orders.filter((o) => o.status === "delivered"),
          );
        }
      })
      .catch((err) => console.error("Error fetching orders:", err));
  };

  const deployRoute = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const res = await fetch("http://127.0.0.1:5000/order/deploy", { 
        method: "POST",
        // headers: {
        //   Authorization: `Bearer ${token}`,
        //   "Content-Type": "application/json",
        // },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      // Only reload map if the response includes orders
      if (data.orders) {
        setMapKey(k => k + 1);
        fetchOrders();
      }
    } catch (err) {
      console.error("Deploy failed:", err);
    }
  };

  const startPolling = () => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    pollingRef.current = setInterval(() => {
      fetchOrders();
    }, 3000); // Poll every 3 seconds
  };

  const stopPolling = () => {
    if (pollingRef.current) clearInterval(pollingRef.current);
  };

  useEffect(() => {
    if (showOrders) {
      fetchOrders();
      startPolling();
    } else {
      stopPolling();
    }
    return () => stopPolling();
  }, [showOrders]);


  return (
    <div className="bg-[#f1f0e9] w-[90%] h-[90%] overflow-auto rounded-lg shadow-xl relative">
      <div className="relative bg-[#41644a] border-2 border-[#90b89b4d] text-white flex justify-between items-center h-20 px-4 py-4 rounded-t-lg">
        <h1 className="absolute left-1/2 top-4 transform -translate-x-1/2 font-display text-4xl font-bold text-[#f1f0e9] [text-shadow:_0_1px_3px_#73977b]">Delivery Routes</h1>
        <button
          className="absolute right-4 top-4 bg-[#f1f0e9] border border-[#90b89b] text-[#41644a] px-2 rounded hover:bg-[#73977b] hover:scale-103 shadow transition-colors"
          onClick={onClose}
        >
          &times;
        </button>
      </div>

      <div className="border-2 border-gray-400 rounded-b-lg p-4">
        <button
          onClick={() => {
            fetch("http://127.0.0.1:5000/order/deploy", { method: "POST" })
              .then((res) => res.json())
              .then((data) => {
                if (data.orders) {
                  setMapKey((k) => k + 1); // reload map
                  fetchOrders();
                }
              });
          }}
          className="mb-4 px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700"
        >
          Deploy Route
        </button>

        <iframe
          key={mapKey}
          src="http://127.0.0.1:5000/order/optimized-route-map"
          title="Delivery Route Map"
          className="w-full h-[400px] border mb-6"
        />

        <div className="grid grid-cols-3 gap-4">
          <OrderList title="Pending Orders" orders={pendingOrders} />
          <OrderList title="En Route Orders" orders={enRouteOrders} />
          <OrderList title="Delivered Orders" orders={deliveredOrders} />
        </div>
      </div>
    </div>
  );
}

export default RouteMap;
