"use client";

import React, { useState, useEffect, useRef } from "react";
import AdminLogin from "./components/AdminLogin.js";
import ProductGrid from "./components/ProductGrid.js";
import AddProduct from "./components/AddProduct.js";
import { FaFilter } from "react-icons/fa";
import RouteMap from "./components/RouteMap.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return showLogin ? (
    <div className="min-h-screen min-w-[700px] bg-[#f1f0e9]">
      <ToastContainer
        position="top-center"
        autoClose={1500}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover={false}
        draggable={false}
        toastClassName="rounded-lg shadow p-4"
      />
      <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm backdrop-brightness-50">
        <AdminLogin
          onLoginSuccess={(token) => {
            sessionStorage.setItem("authToken", token);
            setShowLogin(false);
          }}
        />
      </div>
    </div>
  ) : (
    <div className="min-h-screen min-w-[700px] bg-[#f1f0e9]">
      <ToastContainer
        position="top-center"
        autoClose={1500}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover={false}
        draggable={false}
        toastClassName="rounded-lg shadow p-4"
      />
      <header className="flex items-center justify-between gap-8 px-6 py-4 bg-[#41644a] border-2 border-[#90b89b4d] shadow">
        <div className="flex flex-row mr-8">
          <img src="../icon.jpg" alt="logo" className="mt-1 mr-1 w-8 h-8"></img>
          <p className="text-4xl text-[#f1f0e9] [text-shadow:_0_1px_3px_#73977b] tracking-wide">
            OFS
          </p>
        </div>
        <div className="flex flex-row w-200 gap-4">
          <div className="flex-1 min-w-40 max-w-150">
            <input
              type="text"
              placeholder="Search products"
              className="w-full px-4 py-2 text-[#f1f0e9] border-2 border-[#90b89b] rounded-full hover:bg-[#0d4715] hover:scale-102 shadow transition-colors whitespace-nowrap focus:outline-[#41644a]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div
            ref={dropdownRef}
            className="relative w-37 inline-block text-left"
          >
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
        <div className="flex gap-4">
          <button
            className="font-semibold px-4 py-2 border-2 border-[#90b89b] rounded-full text-[#f1f0e9] hover:bg-[#0d4715] hover:scale-105 shadow transition-colors cursor-pointer whitespace-nowrap"
            onClick={() => setShowOrders(true)}
          >
            View Orders
          </button>
          <button
            className="font-semibold px-4 py-2 bg-[#e9762b] border-2 border-orange-300 text-[#f1f0e9] hover:bg-orange-400 rounded-full hover:scale-105 shadow transition-colors cursor-pointer whitespace-nowrap"
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
        rerenderProductGrid={setRerenderProductGrid}
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
