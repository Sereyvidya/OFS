"use client";

import React, { useState } from "react";
import AddProduct from "./components/AddProduct.js"; 
import AdminLogin from "./components/AdminLogin.js"; 
import ProductGrid from "../home/components/ProductGrid.js";;
import { FaFilter } from "react-icons/fa";

export default function AdminPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const [showAddProduct, setShowAddProduct] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");

  const categories = [
    "All", "Fruits", "Vegetables", "Meat", "Seafood", "Dairy",
    "Pantry", "Beverages", "Bakery", "Spices", "Vegetarian"
  ];

  return (
    !showLogin ? (
      <div className="min-h-screen min-w-[700px] bg-white text-sky-950">
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm backdrop-brightness-50">
        <AdminLogin 
          onLoginSuccess={(token) => {
            localStorage.setItem("authToken", token); 
            setIsLoggedIn(true);
            setShowLogin(false);
          }}
        />
        </div>
      </div>
    ) : (
      <p>hi</p>
    )
  )
}
