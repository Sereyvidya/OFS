"use client";

import React, { useEffect, useState } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Profile from "./components/Profile";
import Cart from "./components/Cart";
import ProductGrid from "./components/ProductGrid";
import DeliveryAddress from "./components/DeliveryAddress";
import OrderSummary from "./components/OrderSummary";
import Carousel from "./components/Carousel";
import { FaFilter } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Stripe publishable key 
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

export default function HomePage() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showDeliveryAddress, setShowDeliveryAddress] = useState(false);
  const [showPaymentInformation, setShowPaymentInformation] = useState(false);
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [profile, setProfile] = useState(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [cartItems, setCartItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zip: ""
  });  
  const [paymentInformation, setPaymentInformation] = useState("");

  const apiUrl = "http://127.0.0.1:5000";
  // const apiUrl = "https://888c-76-132-78-134.ngrok-free.app";

  const fetchProfile = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.log("No token found.");
      return;
    }
    try {
      const response = await fetch(`${apiUrl}/user/profile`, {
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

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (isLoggedIn && token) {
      fetchProfile();
    }
  }, [isLoggedIn]);
  

  const categories = [
    "All", "Fruits", "Vegetables", "Meat", "Seafood", "Dairy",
    "Pantry", "Beverages", "Bakery", "Spices", "Vegetarian"
  ];
  
  return (
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
          {isLoggedIn ? (
            <div className="flex flex-row gap-4">
              <button 
                className="flex gap-2 font-semibold px-4 py-2 border border-gray-300 rounded-full bg-white-600 text-black hover:bg-gray-400 hover:scale-105 shadow transition-colors cursor-pointer whitespace-nowrap"
                onClick={(e) => setShowProfile(true)}>
                  <FaUser className="mt-1 text-sm text-sky-950"/>
                  <p>{(profile?.firstName && profile?.lastName) ? `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}` : <span className="animate-pulse">--</span>}</p>
              </button>

              <button 
                className="flex gap-2 font-semibold px-4 py-2 border border-blue-300 rounded-full bg-blue-600 text-white hover:bg-blue-400 hover:scale-105 shadow transition-colors cursor-pointer whitespace-nowrap"
                onClick={(e) => setShowCart(true)}>
                  <FaShoppingCart className="mt-1 text-sm"/>
                  <p>{cartItems.length}</p>
              </button>
            </div>
          ) : (
            <div className="flex flex-row gap-4">
              <button 
                className="font-semibold px-4 py-2 border border-gray-300 rounded-full bg-white-600 text-black hover:bg-gray-400 hover:scale-105 shadow transition-colors cursor-pointer whitespace-nowrap"
                onClick={(e) => setShowLogin(true)}>
                  Log in
              </button>
              <button 
                className="font-semibold px-4 py-2 border border-blue-300 rounded-full bg-blue-600 text-white hover:bg-blue-400 hover:scale-105 shadow transition-colors cursor-pointer whitespace-nowrap"
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
        setShowLogin={setShowLogin}
        searchQuery={searchQuery}
        category={category}
        cartItems={cartItems}
        setCartItems={setCartItems}
        setShowCart={setShowCart}
        apiUrl={apiUrl}
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
            apiUrl={apiUrl}
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
            apiUrl={apiUrl}
            />
        </div>
      )}

      {/* Show Profile */}
      {showProfile && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm backdrop-brightness-50">
          <Profile 
            onClose={() => setShowProfile(false)}
            profile={profile}
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
            apiUrl={apiUrl}
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
            // setShowPaymentInformation={setShowPaymentInformation}
          />
        </div>
      )}

      {/* Show Payment Information */}
      {/* {showPaymentInformation && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm backdrop-brightness-50">
          <Elements stripe={stripePromise}>
            <PaymentInformation 
              onClose={() => setShowPaymentInformation(false)}
              setShowDeliveryAddress={setShowDeliveryAddress}
              setShowOrderSummary={setShowOrderSummary}
              setShowPaymentInformation={setShowPaymentInformation}
              setPaymentInformation={setPaymentInformation}
            />
          </Elements>
        </div>
      )} */}

      {/* Show Order Summary */}
      {showOrderSummary && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm backdrop-brightness-50">
          <Elements stripe={stripePromise}>
            <OrderSummary
              onClose={() => setShowOrderSummary(false)}
              cartItems={cartItems}
              address={address}
              setShowDeliveryAddress={setShowDeliveryAddress}
              apiUrl={apiUrl}
              paymentInformation={paymentInformation}
              setPaymentInformation={setPaymentInformation}
            />
          </Elements>
        </div>
      )}

    </div>  
  );
}