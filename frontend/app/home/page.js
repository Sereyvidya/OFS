"use client";

import React, { useState } from "react";
import Login from "../components/Login";
import Signup from "../components/Signup";
import Profile from "../components/Profile";
import Cart from "../components/Cart";
import ProductGrid from "../components/ProductGrid";;
import Carousel from "../components/Carousel";
import { FaFilter } from "react-icons/fa";

export default function HomePage() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showCart, setShowCart] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const [cartItems, setCartItems] = useState([]);

  const categories = [
    "All", "Fruits", "Vegetables", "Meat", "Seafood", "Dairy",
    "Pantry", "Beverages", "Bakery", "Spices", "Vegetarian"
  ];

  return (
    <div className="min-h-screen min-w-[700px] bg-white text-gray-900">
      <div>
        {/* Header */}
        <header className="flex items-center justify-between gap-x-8 px-6 py-4 bg-gray-100 shadow">
          {/* OFS Logo */}
          <div className="text-4xl font-bold">OFS</div>
          {/* Search Bar */}
          <div className="flex-1 min-w-40 max-w-150">
            <input
              type="text"
              placeholder="Search products"
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Categories Dropdown */}
          <div className="flex justify-between mx-3 font-semibold px-4 py-2 border border-gray-300 rounded-full text-black hover:bg-gray-400 transition-colors cursor-pointer whitespace-nowrap">
            <select
              className="appearance-none focus:outline-none focus:ring-0"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <div className="flex items-center">
              <FaFilter className=" text-gray-600 ml-2" />
            </div>
          </div>

          

          {/* Buttons */}
          <div className="flex justify-center">

          {isAdmin ?
            <div className="flex flex-row">
              <button 
                className="mx-3 font-semibold px-4 py-2 border border-gray-300 rounded-full white-600 text-black hover:bg-gray-400 transition-colors cursor-pointer whitespace-nowrap"
                onClick={(e) => setShowProfile(true)}>
                AdminPage
              </button>
            </div> : null}
          
          {isLoggedIn ? (
            
            <div className="flex flex-row">
              <button 
                className="mx-3 font-semibold px-4 py-2 border border-gray-300 rounded-full white-600 text-black hover:bg-gray-400 transition-colors cursor-pointer whitespace-nowrap"
                onClick={(e) => setShowProfile(true)}>
                User
              </button>

              <button 
                className="mx-1 font-semibold px-4 py-2 inline-block whitespace-nowrap rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer"
                onClick={(e) => setShowCart(true)}>
                Cart
              </button>
            </div>
          ) : (
            <div className="flex flex-row">
              <button 
                className="mx-3 font-semibold px-4 py-2 border border-gray-300 rounded-full white-600 text-black hover:bg-gray-400 transition-colors cursor-pointer whitespace-nowrap"
                onClick={(e) => setShowLogin(true)}>
                Log in
              </button>
              <button 
                className="mx-1 font-semibold px-4 py-2 inline-block whitespace-nowrap rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer"
                onClick={(e) => setShowSignup(true)}>
                Sign up
              </button>
            </div>
          )}
          </div>
        </header>
      </div>
      
      {/* Carousel Section */}
      {/* <Carousel /> */}

      <ProductGrid
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
        setShowLogin={setShowLogin}
        searchQuery={searchQuery}
        category={category}
        cartItems={cartItems}
        setCartItems={setCartItems}
      />

      {/* Login popup */}
      {showLogin && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm backdrop-brightness-50">
          <Login 
            onClose={() => setShowLogin(false)}
            // onLoginClick={}
            onSignupClick={() => {
              setShowLogin(false)
              setShowSignup(true)
              }}
            onLoginSuccess={(token) => {
              localStorage.setItem("authToken", token); 
              setIsLoggedIn(true);
              const isAdmin = localStorage.getItem("isAdmin") === "true";
              if (isAdmin) {
                setIsAdmin(true);
                console.log("Admin logged in");
              }
              setShowLogin(false);
            }}
          />
        </div>
      )}

      {/* Signup popup */}
      {showSignup && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm backdrop-brightness-50">
          <Signup
            onClose={() => setShowSignup(false)}
            onLoginClick={() => {
              setShowLogin(true)
              setShowSignup(false)
            }}
            />
        </div>
      )}

      {/* Show Profile */}
      {showProfile && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm backdrop-brightness-50">
          <Profile 
            onClose={() => setShowProfile(false)}
          />
        </div>
        )}

      {/* Show Cart */}
      {showCart && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm backdrop-brightness-50">
        <Cart 
          onClose={() => setShowCart(false)}
          cartItems={cartItems}
          setCartItems={setCartItems}
        />
      </div>
      )}
    </div>  
  );
}