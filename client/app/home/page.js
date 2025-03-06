"use client";

import React from "react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-gray-100 shadow">
        {/* OFS Logo */}
        <div className="text-4xl font-bold">OFS</div>

        {/* Search Bar */}
        <div className="flex-1 mx-50">
          <input
            type="text"
            placeholder="Search products"
            className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none"
          />
        </div>

        {/* View Cart */}
        <button className="font-semibold px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors">
          View Cart
        </button>

        {/* Login */}
        <button className="mx-3 font-semibold px-4 py-2 border border-gray-300 rounded-full white-600 text-black hover:bg-gray-400 transition-colors">
          Login
        </button>

        {/* Sign Up */}
        <button className="mx-1 font-semibold px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors">
          Sign Up
        </button>

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
  );
}