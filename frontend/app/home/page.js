"use client";

import React, { useState } from "react";
import Login from "../components/Login";
import Signup from "../components/Signup";
import Profile from "../components/Profile";
import ProductGrid from "../components/Product";;
import Carousel from "../components/Carousel";

export default function HomePage() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="min-h-screen min-w-[700px] bg-white text-gray-900">
      <div>
        {/* Header */}
        <header className="flex items-center justify-between gap-x-8 px-6 py-4 bg-gray-100 shadow">
          {/* OFS Logo */}
          <div className="text-4xl font-bold">OFS</div>
          {/* Search Bar */}
          <div className="flex-1 min-w-75 max-w-150">
            <input
              type="text"
              placeholder="Search products"
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none"
            />
          </div>
          {/* Buttons */}
          <div className="flex justify-center">
          {isLoggedIn ? (
            <div className="flex flex-row">
              <button 
                className="mx-3 font-semibold px-4 py-2 border border-gray-300 rounded-full white-600 text-black hover:bg-gray-400 transition-colors cursor-pointer whitespace-nowrap"
                onClick={(e) => setShowProfile(true)}>
                User
              </button>

              <button 
                className="mx-1 font-semibold px-4 py-2 inline-block whitespace-nowrap rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer"
                >
                View Cart
              </button>
            </div>
          ) : (
            <div className="flex flex-row">
              <button 
                className="mx-3 font-semibold px-4 py-2 border border-gray-300 rounded-full white-600 text-black hover:bg-gray-400 transition-colors cursor-pointer"
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
      <Carousel />

      <ProductGrid
          isLoggedIn={isLoggedIn}
          showLogin={showLogin}
          setShowLogin={setShowLogin}
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
    </div>  
  );
}