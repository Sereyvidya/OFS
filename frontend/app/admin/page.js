"use client";

import React, { useState } from "react";
import AdminLogin from "./components/AdminLogin.js"; 
import ProductGrid from "./components/ProductGrid.js";;
import { FaFilter } from "react-icons/fa";
import AddProduct from "./components/AddProduct.js";

export default function AdminPage() {
  const [showLogin, setShowLogin] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);

  const [isOpen, setIsOpen] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [rerenderProductGrid, setRerenderProductGrid] = useState(0);

  const categories = [
    "All", "Fruits", "Vegetables", "Meat", "Seafood", "Dairy",
    "Pantry", "Beverages", "Bakery", "Spices", "Vegetarian"
  ];

  return (
    showLogin ? (
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
        <div>
          {/* Header */}
          <header className="flex items-center justify-between gap-x-8 px-6 py-4 bg-gray-200 shadow">
            {/* OFS Logo */}
            <div 
              className="text-4xl font-bold text-sky-950 tracking-wide">
              OFS
            </div>
            {/* Search Bar */}
            <div className="flex-1 min-w-40 max-w-150">
              <input
                type="text"
                placeholder="Search products"
                className="w-full px-4 py-2 border border-gray-300 rounded-full bg-white-600 hover:bg-gray-300 hover:scale-102 shadow transition-colors whitespace-nowrap focus:outline-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Categories Dropdown */}
            <div className="relative w-37 inline-block text-left">
              <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex justify-between items-center font-semibold px-4 py-2 border border-gray-300 rounded-full text-black hover:bg-gray-400 hover:scale-105 shadow transition-colors cursor-pointer whitespace-nowrap"
              >
                <span className="text-sky-950">{category}</span>
                <FaFilter className="text-gray-600 ml-2" />
              </div>

              {isOpen && (
                <div className="absolute z-10 mt-2 w-full max-h-60 overflow-y-auto rounded-md bg-white border border-gray-300 shadow-lg">
                  {categories.map((cat) => (
                    <div
                      key={cat}
                      onClick={() => {
                        setCategory(cat);
                        setIsOpen(false);
                      }}
                      className="px-4 py-2 hover:bg-gray-200 cursor-pointer text-sky-950"
                    >
                      {cat}
                    </div>
                  ))}
                </div>
              )}
            </div>


            {/* Buttons */}
            <div className="flex justify-center">
              <div className="flex flex-row gap-4">
                <button 
                  className="flex gap-2 font-semibold px-4 py-2 border border-gray-300 rounded-full bg-white-600 text-black hover:bg-gray-400 hover:scale-105 shadow transition-colors cursor-pointer whitespace-nowrap"
                  >
                  View Orders
                </button>

                <button 
                  className="flex gap-2 font-semibold px-4 py-2 border border-blue-300 rounded-full bg-blue-600 text-white hover:bg-blue-400 hover:scale-105 shadow transition-colors cursor-pointer whitespace-nowrap"
                  onClick={(e) => setShowAddProduct(true)}
                  >
                  Add Product
                </button>
              </div>
            </div>
          </header>
        </div>

        <ProductGrid
          searchQuery={searchQuery}
          category={category}
          setEditingProduct={setEditingProduct}
          setShowAddProduct={setShowAddProduct}
          rerenderProductGrid={rerenderProductGrid}
        />

        {/* Show Profile */}
        {showAddProduct && (
          <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm backdrop-brightness-50">
            <AddProduct 
              onClose={() => setShowAddProduct(false)}
              editingProduct={editingProduct}
              setEditingProduct={setEditingProduct}
              setRerenderProductGrid={setRerenderProductGrid}
            />
          </div>
        )}
      </div>
    )
  )
}
