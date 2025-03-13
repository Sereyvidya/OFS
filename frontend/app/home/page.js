"use client";

import React, { useState } from "react";
import Login from "../components/Login";
import Signup from "../components/Signup";

export default function HomePage() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="min-h-screen min-w-[700px] bg-gray-50 text-gray-900">
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
            <>
              <button 
                className="mx-3 font-semibold px-4 py-2 border border-gray-300 rounded-full white-600 text-black hover:bg-gray-400 transition-colors cursor-pointer"
              >
                User Profile
              </button>

              <button 
                className="mx-1 font-semibold px-4 py-2 inline-block whitespace-nowrap rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer"
              >
                View Cart
              </button>
            </>
          ) : (
            <>
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
          </>
          )}
          </div>
        </header>

          
        {/* Body */}
        <main className="flex-grow flex flex-col items-center justify-center p-6">
          <div className="max-w-4xl w-full text-center">
            <h1 className="text-4xl font-bold mb-4">Welcome to OFS Delivery Service</h1>
            <p className="mb-6 text-lg leading-relaxed">
              We’re a local organic food retailer chain based in Downtown San Jose.
              Our mission is to bring fresh, organic groceries straight to your door
              via our self-driving delivery service. Enjoy convenient, healthy
              shopping from the comfort of your home!
            </p>
          </div>
        </main>
      </div>

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
            onLoginSuccess={() => {
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
    </div>  
  );
}