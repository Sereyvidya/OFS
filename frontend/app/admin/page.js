"use client";

import React, { useState, useEffect, useRef } from "react";
import AdminLogin from "./components/AdminLogin.js";
import ProductGrid from "./components/ProductGrid.js";
import AddProduct from "./components/AddProduct.js";
import { FaFilter } from "react-icons/fa";

export default function AdminPage() {
  const [showLogin, setShowLogin] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [enRouteOrders, setEnRouteOrders] = useState([]);
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [rerenderProductGrid, setRerenderProductGrid] = useState(0);
  const [mapKey, setMapKey] = useState(0);

  const pollingRef = useRef(null);

  const categories = [
    "All",
    "Fruits",
    "Vegetables",

    "Seafood",
    "Dairy",
    "Pantry",
    "Beverages",
    "Bakery",
    "Spices",
    "Vegetarian",
  ];

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

  return showLogin ? (
    <div className="min-h-screen min-w-[700px] bg-white text-sky-950">
      <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm backdrop-brightness-50">
        <AdminLogin
          onLoginSuccess={(token) => {
            localStorage.setItem("authToken", token);
            setShowLogin(false);
          }}
        />
      </div>
    </div>
  ) : (
    <div className="min-h-screen min-w-[700px] bg-white text-sky-950">
      {/* Header */}
      <header className="flex items-center justify-between gap-x-8 px-6 py-4 bg-gray-200 shadow">
        <div className="text-4xl font-bold text-sky-950 tracking-wide">OFS</div>

        <div className="flex-1 min-w-40 max-w-150">
          <input
            type="text"
            placeholder="Search products"
            className="w-full px-4 py-2 border border-gray-300 rounded-full shadow focus:outline-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="relative w-37 inline-block text-left">
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="flex justify-between items-center font-semibold px-4 py-2 border border-gray-300 rounded-full shadow cursor-pointer"
          >
            <span>{category}</span>
            <FaFilter className="text-gray-600 ml-2" />
          </div>

          {isOpen && (
            <div className="absolute z-10 mt-2 w-full max-h-60 overflow-y-auto rounded-md bg-white border shadow-lg">
              {categories.map((cat) => (
                <div
                  key={cat}
                  onClick={() => {
                    setCategory(cat);
                    setIsOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                >
                  {cat}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            className="font-semibold px-4 py-2 border rounded-full bg-white-600 text-black hover:bg-gray-400 shadow"
            onClick={() => setShowOrders(true)}
          >
            View Orders
          </button>
          <button
            className="font-semibold px-4 py-2 border rounded-full bg-blue-600 text-white hover:bg-blue-400 shadow"
            onClick={() => setShowAddProduct(true)}
          >
            Add Product
          </button>
        </div>
      </header>

      <ProductGrid
        searchQuery={searchQuery}
        category={category}
        setEditingProduct={setEditingProduct}
        setShowAddProduct={setShowAddProduct}
        rerenderProductGrid={rerenderProductGrid}
      />

      {showAddProduct && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm backdrop-brightness-50 z-50">
          <AddProduct
            onClose={() => setShowAddProduct(false)}
            editingProduct={editingProduct}
            setEditingProduct={setEditingProduct}
            setRerenderProductGrid={setRerenderProductGrid}
          />
        </div>
      )}

      {showOrders && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-[90%] h-[90%] p-6 overflow-auto rounded-lg shadow-xl relative">
            <button
              onClick={() => setShowOrders(false)}
              className="absolute top-4 right-6 text-gray-600 hover:text-black text-xl"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-4">
              Optimized Delivery Route
            </h2>

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
      )}
    </div>
  );
}

function OrderList({ title, orders }) {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
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
    <div className="border px-4 py-2 rounded shadow-sm bg-gray-50 mb-2">
      <p>
        <strong>#{order.orderID}</strong> — {order.address}
      </p>
      <p>Weight: {order.weight.toFixed(2)} lbs</p>
      <p>Status: {order.status}</p>
    </div>
  );
}
