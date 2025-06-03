"use client";

import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUserContext } from "../context/UserContext";
import SearchBar from "./SearchBar";
import CategoryDropdown from "./CategoryDropdown";
import Login from "./Login";
import Signup from "./Signup";
import ProductGrid from "./ProductGrid";
import Cart from "./Cart";

export default function UserPage() {
  const {
    showLogin,
    setShowLogin,
    showSignup,
    setShowSignup,
    showCart,
    setShowCart,
    isLoggedIn,
  } = useUserContext();

  return (
    <div className="min-h-screen bg-[#f1f0e9]">
      {/* HEADER */}
      <div>
        <ToastContainer
          position="top-center"
          autoClose={1500}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover={false}
          draggable={false}
          toastClassName="rounded-lg shadow p-4"
        />
        <header className="flex items-center justify-between gap-8 border-2 border-[#90b89b4d] bg-[#41644a] px-6 py-4 shadow">
          {/* LOGO */}
          <div className="mr-8 flex flex-row">
            <img
              src="/favicon.png"
              alt="logo"
              className="mt-1 mr-1 h-8 w-8"
            ></img>
            <p className="text-4xl tracking-wide text-[#f1f0e9] [text-shadow:_0_1px_3px_#73977b]">
              OFS
            </p>
          </div>

          {/* SEARCH BAR & CATEGORIES DROPDOWN */}
          <div className="flex w-200 flex-row gap-4">
            <SearchBar />
            <CategoryDropdown />
          </div>

          {/* BUTTONS */}
          <div className="flex justify-center">
            {isLoggedIn ? (
              <div className="flex flex-row gap-4">
                {/* Log in */}
                <button
                  className="cursor-pointer rounded-full border-2 border-[#90b89b] px-4 py-2 font-semibold whitespace-nowrap text-[#f1f0e9] shadow transition-colors hover:scale-105 hover:bg-[#0d4715] focus:ring-2 focus:ring-[#0d4715] focus:outline-none"
                  // onClick={(e) => setShowLogin(true)}
                >
                  Profile
                </button>
                {/* Cart */}
                <button
                  className="cursor-pointer rounded-full border-2 border-orange-300 bg-[#e9762b] px-4 py-2 font-semibold whitespace-nowrap text-[#f1f0e9] shadow transition-colors hover:scale-105 hover:bg-orange-400 focus:ring-1 focus:ring-orange-500 focus:outline-none"
                  onClick={(e) => setShowCart(true)}
                >
                  Cart
                </button>
              </div>
            ) : (
              <div className="flex flex-row gap-4">
                {/* Log in */}
                <button
                  className="cursor-pointer rounded-full border-2 border-[#90b89b] px-4 py-2 font-semibold whitespace-nowrap text-[#f1f0e9] shadow transition-colors hover:scale-105 hover:bg-[#0d4715] focus:ring-2 focus:ring-[#0d4715] focus:outline-none"
                  onClick={(e) => setShowLogin(true)}
                >
                  Log in
                </button>
                {/* Sign up */}
                <button
                  className="cursor-pointer rounded-full border-2 border-orange-300 bg-[#e9762b] px-4 py-2 font-semibold whitespace-nowrap text-[#f1f0e9] shadow transition-colors hover:scale-105 hover:bg-orange-400 focus:ring-1 focus:ring-orange-500 focus:outline-none"
                  onClick={(e) => setShowSignup(true)}
                >
                  Sign up
                </button>
              </div>
            )}
          </div>
        </header>
      </div>

      {/* Display products */}
      <ProductGrid />

      {/* Log in form */}
      {showLogin && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm backdrop-brightness-50">
          <Login />
        </div>
      )}

      {/* Sign up form */}
      {showSignup && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm backdrop-brightness-50">
          <Signup />
        </div>
      )}

      {/* Cart */}
      {showCart && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm backdrop-brightness-50">
          <Cart />
        </div>
      )}
    </div>
  );
}
