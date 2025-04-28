"use client";

import React, { useEffect, useState, useRef } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Profile from "./components/Profile";
import Cart from "./components/Cart";
import ProductGrid from "./components/ProductGrid";
import DeliveryAddress from "./components/DeliveryAddress";
import OrderSummary from "./components/OrderSummary";
import OrderHistory from "./components/OrderHistory";
import { FaFilter } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import BannerCarousel from './components/BannerCarousel';

export default function HomePage() {
  // States for showing different components
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showDeliveryAddress, setShowDeliveryAddress] = useState(false);
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const dropdownRef = useRef(null);

  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [cartItems, setCartItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [address, setAddress] = useState({street: "", city: "", state: "", zip: ""});  
  const [paymentInformation, setPaymentInformation] = useState("");

  // Constants
  const STRIPE_PROMISE = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  const API_URL = "http://127.0.0.1:5000";

  const fetchProfile = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.log("No token found.");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/user/profile`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      } else {
        console.error("Failed to fetch profile");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchHistory = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return setOrders([]);
    const res = await fetch(`${API_URL}/order/history`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setOrders(await res.json());
    else setOrders([]);
    };

  // useEffect(() => {
  //   const token = localStorage.getItem("authToken");
  //   if (isLoggedIn && token) {
  //     fetchProfile();
  //   }
  // }, [isLoggedIn]);

  useEffect(() => {
    if (showHistory && isLoggedIn) fetchHistory();
  }, [showHistory, isLoggedIn]);
    
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

  const categories = [
    "All", "Fruits", "Vegetables", "Meat", "Seafood", "Dairy",
    "Pantry", "Beverages", "Bakery", "Spices", "Vegetarian"
  ];
  
  return (
    <div className="min-h-screen min-w-[700px] bg-[#f1f0e9]">
      <div>
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
          <div className="flex justify-center">
          {isLoggedIn ? (
            <div className="flex flex-row gap-4">
              {/* Order History button */}
              <button
                className="flex gap-2 font-semibold px-4 py-2 border-2 border-[#90b89b] rounded-full text-[#f1f0e9] hover:bg-[#0d4715] hover:scale-105 shadow transition-colors cursor-pointer whitespace-nowrap"
                onClick={() => setShowHistory(true)}
              >
                Orders
              </button>

              {/* Profile */}
              <button 
                className="flex gap-2 font-semibold px-4 py-2 border-2 border-[#90b89b] rounded-full text-[#f1f0e9] hover:bg-[#0d4715] hover:scale-105 shadow transition-colors cursor-pointer whitespace-nowrap"
                onClick={(e) => setShowProfile(true)}>
                  <FaUser className="mt-1 text-sm text-[#f1f0e9]"/>
                  <p>{(profile?.firstName && profile?.lastName) ? `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}` : <span className="animate-pulse">--</span>}</p>
              </button>

              <button 
                className="flex gap-2 font-semibold px-4 py-2 bg-[#e9762b] border-2 border-orange-300 text-[#f1f0e9] hover:bg-orange-400 rounded-full text-[#f1f0e9] hover:scale-105 shadow transition-colors cursor-pointer whitespace-nowrap"
                onClick={(e) => setShowCart(true)}>
                  <FaShoppingCart className="mt-1 text-sm"/>
                  <p>{cartItems.length}</p>
              </button>
            </div>
          ) : (
            <div className="flex flex-row gap-4">
              {/* Log in */}
              <button 
                className="font-semibold px-4 py-2 border-2 border-[#90b89b] rounded-full text-[#f1f0e9] hover:bg-[#0d4715] hover:scale-105 shadow transition-colors cursor-pointer whitespace-nowrap"
                onClick={(e) => setShowLogin(true)}>
                  Log in
              </button>
              {/* Sign up */}
              <button 
                className="font-semibold px-4 py-2 bg-[#e9762b] border-2 border-orange-300 text-[#f1f0e9] hover:bg-orange-400 rounded-full text-[#f1f0e9] hover:scale-105 shadow transition-colors cursor-pointer whitespace-nowrap"
                onClick={(e) => setShowSignup(true)}>
                  Sign up
              </button>
            </div>
          )}
          </div>
        </header>
      </div>

      {/* <BannerCarousel /> */}

      <ProductGrid
        isLoggedIn={isLoggedIn}
        setShowLogin={setShowLogin}
        searchQuery={searchQuery}
        category={category}
        cartItems={cartItems}
        setCartItems={setCartItems}
        setShowCart={setShowCart}
        API_URL={API_URL}
      />

      {/* Login popup */}
      {showLogin && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm backdrop-brightness-50">
          <Login 
            onClose={() => setShowLogin(false)}
            onSignupClick={() => {
              setShowLogin(false)
              setShowSignup(true)
              }}
            onLoginSuccess={(token) => {
              localStorage.setItem("authToken", token); 
              fetchProfile();
              setIsLoggedIn(true);
              setShowLogin(false);
            }}
            API_URL={API_URL}
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
            API_URL={API_URL}
            />
        </div>
      )}

      {/* Show Profile */}
      {showProfile && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm backdrop-brightness-50">
          <Profile 
            onClose={() => setShowProfile(false)}
            profile={profile}
            API_URL={API_URL}
            setIsLoggedIn={setIsLoggedIn}
            setProfile={setProfile}
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
            setShowCart={setShowCart}
            setShowDeliveryAddress={setShowDeliveryAddress}
            API_URL={API_URL}
          />
        </div>
      )}

      {/* Show DeliveryAddress */}
      {showDeliveryAddress && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm backdrop-brightness-50">
          <DeliveryAddress
            onClose={() => setShowDeliveryAddress(false)}
            setShowCart={setShowCart}
            address={address}
            setAddress={setAddress}
            setShowOrderSummary={setShowOrderSummary}
          />
        </div>
      )}

      {/* Show Order Summary */}
      {showOrderSummary && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm backdrop-brightness-50">
          <Elements stripe={STRIPE_PROMISE}>
            <OrderSummary
              onClose={() => setShowOrderSummary(false)}
              cartItems={cartItems}
              setCartItems={setCartItems}
              address={address}
              setShowDeliveryAddress={setShowDeliveryAddress}
              API_URL={API_URL}
              paymentInformation={paymentInformation}
              setPaymentInformation={setPaymentInformation}
            />
          </Elements>
        </div>
      )}

      {/* Order History */}
      {showHistory && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm backdrop-brightness-50">
          <OrderHistory
            onClose={() => setShowHistory(false)}
            orders={orders}
          />
        </div>
      )}
    </div>  
  );
}