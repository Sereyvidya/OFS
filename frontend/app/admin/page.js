"use client";

import React, { useState, useEffect, useRef } from "react";
import AdminLogin from "./components/AdminLogin.js";
import ProductGrid from "./components/ProductGrid.js";
import AddProduct from "./components/AddProduct.js";
import { FaFilter } from "react-icons/fa";
import RouteMap from "./components/RouteMap.js";

export default function AdminPage() {
  const [showLogin, setShowLogin] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const dropdownRef = useRef(null);

  const [pendingOrders, setPendingOrders] = useState([]);
  const [enRouteOrders, setEnRouteOrders] = useState([]);
  const [deliveredOrders, setDeliveredOrders] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [rerenderProductGrid, setRerenderProductGrid] = useState(0);
  const [mapKey, setMapKey] = useState(0);

  const categories = [
    "All",
    "Fruits",
    "Vegetables",
    "Meat",
    "Seafood",
    "Dairy",
    "Pantry",
    "Beverages",
    "Bakery",
    "Spices",
    "Vegetarian",
  ];

  // closes dropdown menu even if user didn't choose an option
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  ///////////////////////////////////////////

  // const pollingRef = useRef(null);

  // const fetchOrders = () => {
  //   fetch("http://127.0.0.1:5000/order/all-statuses")
  //     .then((res) => res.json())
  //     .then((data) => {
  //       if (data.orders) {
  //         setPendingOrders(data.orders.filter((o) => o.status === "awaiting"));
  //         setEnRouteOrders(data.orders.filter((o) => o.status === "en route"));
  //         setDeliveredOrders(
  //           data.orders.filter((o) => o.status === "delivered"),
  //         );
  //       }
  //     })
  //     .catch((err) => console.error("Error fetching orders:", err));
  // };

  // const startPolling = () => {
  //   if (pollingRef.current) clearInterval(pollingRef.current);
  //   pollingRef.current = setInterval(() => {
  //     fetchOrders();
  //   }, 3000); // Poll every 3 seconds
  // };

  // const stopPolling = () => {
  //   if (pollingRef.current) clearInterval(pollingRef.current);
  // };

  // useEffect(() => {
  //   if (showOrders) {
  //     fetchOrders();
  //     startPolling();
  //   } else {
  //     stopPolling();
  //   }
  //   return () => stopPolling();
  // }, [showOrders]);

  ///////////////////////////////////////////

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
    <div className="min-h-screen min-w-[700px] bg-[#f1f0e9]">
      {/* Header */}
      <header className="flex items-center justify-between gap-8 px-6 py-4 bg-[#41644a] border-2 border-[#90b89b4d] shadow">
        {/* OFS Logo */}
        <div className="flex flex-row mr-8">
          <img src="../icon.jpg" alt="logo" className="mt-1 mr-1 w-8 h-8"></img>
          <p className="text-4xl text-[#f1f0e9] [text-shadow:_0_1px_3px_#73977b] tracking-wide">
            OFS
          </p>
        </div>

        {/* Container for search bar and dropdown */}
        <div className="flex flex-row w-200 gap-4">
            {/* Search Bar */}
            <div className="flex-1 min-w-40 max-w-150">
              <input
                type="text"
                placeholder="Search products"
                className="w-full px-4 py-2 text-[#f1f0e9] border-2 border-[#90b89b] rounded-full hover:bg-[#0d4715] hover:scale-102 shadow transition-colors whitespace-nowrap focus:outline-[#41644a]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Categories Dropdown */}
            <div ref={dropdownRef} className="relative w-37 inline-block text-left">
              <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex justify-between items-center font-semibold px-4 py-2 border-2 border-[#90b89b] rounded-full text-black hover:bg-[#0d4715] hover:scale-105 shadow transition-colors cursor-pointer whitespace-nowrap"
              >
                <span className="text-[#f1f0e9]">{category}</span>
                <FaFilter className="text-[#f1f0e9] ml-2" />
              </div>

              {isOpen && (
                <div className="absolute z-10 mt-2 w-full max-h-60 overflow-y-auto rounded-md bg-[#f1f0e9] border-2 border-gray-300 shadow-lg">
                  {categories.map((cat) => (
                    <div
                      key={cat}
                      onClick={() => {
                        setCategory(cat);
                        setIsOpen(false);
                      }}
                      className="px-4 py-2 text-[#41644a] hover:bg-[#90b89b] cursor-pointer"
                    >
                      {cat}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            className="font-semibold px-4 py-2 border-2 border-[#90b89b] rounded-full text-[#f1f0e9] hover:bg-[#0d4715] hover:scale-105 shadow transition-colors cursor-pointer whitespace-nowrap"
            onClick={() => setShowOrders(true)}
          >
            View Orders
          </button>
          <button
            className="font-semibold px-4 py-2 bg-[#e9762b] border-2 border-orange-300 text-[#f1f0e9] hover:bg-orange-400 rounded-full text-[#f1f0e9] hover:scale-105 shadow transition-colors cursor-pointer whitespace-nowrap"
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
          <RouteMap
            onClose={() => setShowOrders(false)}
            showOrders={showOrders}
            pendingOrders={pendingOrders}
            setPendingOrders={setPendingOrders}
            enRouteOrders={enRouteOrders}
            setEnRouteOrders={setEnRouteOrders}
            deliveredOrders={deliveredOrders}
            setDeliveredOrders={setDeliveredOrders}
            mapKey={mapKey}
            setMapKey={setMapKey}
          />
        </div>
      )}
    </div>
  );
}

{/* 
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
} */}
