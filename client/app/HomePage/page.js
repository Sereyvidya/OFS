"use client";

import React from "react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow">
        {/* OFS Logo */}
        <div className="text-4xl font-bold">OFS</div>

        {/* Search Bar */}
        <div className="flex-1 mx-100">
          <input
            type="text"
            placeholder="Search products"
            className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none"
          />
        </div>

        {/* View Cart */}
        <button className="font-semibold px-4 py-2 rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors">
          View Cart
        </button>
      </header>

      {/* Body (Blank for Now) */}
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
