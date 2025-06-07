"use client";

import React from "react";
import { useUserContext } from "../context/UserContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SearchBar from "./SearchBar";
import CategoryDropdown from "./CategoryDropdown";
import { FaShoppingCart, FaUser } from "react-icons/fa";

const NavBar = () => {
  const {
    isLoggedIn,
    setShowLogin,
    setShowSignup,
    setShowProfile,
    profile,
    setShowCart,
    cartItems,
  } = useUserContext();

  return (
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
      <header className="flex w-full flex-col items-center justify-between gap-4 border-2 border-[#90b89b4d] bg-[#41644a] px-6 py-4 shadow md:flex-row">
        {/* Logo */}
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

        <div className="flex w-full flex-col gap-4 sm:flex-row">
          <div className="w-full">
            <SearchBar />
          </div>
          <div className="w-full">
            <CategoryDropdown />
          </div>
        </div>

        {isLoggedIn ? (
          <div className="flex w-full flex-col gap-4 sm:flex-row md:w-1/4">
            <div className="w-full">
              <button
                className="flex w-full cursor-pointer justify-between gap-2 rounded-full border-2 border-[#90b89b] px-4 py-2 font-semibold whitespace-nowrap text-[#f1f0e9] shadow transition-colors hover:scale-105 hover:bg-[#0d4715] focus:ring-2 focus:ring-[#0d4715] focus:outline-none"
                onClick={(e) => setShowProfile(true)}
              >
                <FaUser className="mt-1 text-sm text-[#f1f0e9]" />
                <p>
                  {profile?.firstName && profile?.lastName ? (
                    `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`
                  ) : (
                    <span className="animate-pulse">--</span>
                  )}
                </p>
              </button>
            </div>
            <div className="w-full">
              <button
                className="flex w-full cursor-pointer justify-between gap-2 rounded-full border-2 border-orange-300 bg-[#e9762b] px-4 py-2 font-semibold whitespace-nowrap text-[#f1f0e9] shadow transition-colors hover:scale-105 hover:bg-orange-400 focus:ring-1 focus:ring-orange-500 focus:outline-none"
                onClick={(e) => setShowCart(true)}
              >
                <FaShoppingCart className="mt-1 text-sm" />
                <p>{cartItems.length}</p>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex w-full flex-col gap-4 sm:flex-row md:w-1/4">
            <div className="w-full">
              <button
                className="flex w-full cursor-pointer justify-center rounded-full border-2 border-[#90b89b] px-4 py-2 font-semibold whitespace-nowrap text-[#f1f0e9] shadow transition-colors hover:scale-105 hover:bg-[#0d4715] focus:ring-2 focus:ring-[#0d4715] focus:outline-none"
                onClick={(e) => setShowLogin(true)}
              >
                Log in
              </button>
            </div>
            <div className="w-full">
              <button
                className="flex w-full cursor-pointer justify-center rounded-full border-2 border-orange-300 bg-[#e9762b] px-4 py-2 font-semibold whitespace-nowrap text-[#f1f0e9] shadow transition-colors hover:scale-105 hover:bg-orange-400 focus:ring-1 focus:ring-orange-500 focus:outline-none"
                onClick={(e) => setShowSignup(true)}
              >
                Sign up
              </button>
            </div>
          </div>
        )}
      </header>
    </div>
  );
};

export default NavBar;
