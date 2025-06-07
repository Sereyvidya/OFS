"use client";

import React from "react";
import { useUserContext } from "../context/UserContext";
import NavBar from "./NavBar";
import ProductGrid from "./ProductGrid";
import Login from "./Login";
import Signup from "./Signup";
import Profile from "./Profile";
import DeleteConfirmation from "./DeleteConfirmation";
import Cart from "./Cart";
import DeliveryAddress from "./DeliveryAddress";
import OrderSummary from "./OrderSummary";
import { Elements } from "@stripe/react-stripe-js";

/**
 * Renders the user's where they interact with the website.
 */
export default function UserPage() {
  const {
    STRIPE_PROMISE,
    showLogin,
    showSignup,
    showProfile,
    showDeleteConfirm,
    showCart,
    showDeliveryAddress,
    showOrderSummary,
  } = useUserContext();

  return (
    <div className="min-h-screen bg-[#f1f0e9]">
      {/* Navigation Bar */}
      <NavBar />

      {/* Display products */}
      <ProductGrid />

      {/* Log in form */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm backdrop-brightness-50">
          <Login />
        </div>
      )}

      {/* Sign up form */}
      {showSignup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm backdrop-brightness-50">
          <Signup />
        </div>
      )}

      {/* Profile */}
      {showProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm backdrop-brightness-50">
          <Profile />
        </div>
      )}

      {/* Confirm account deletion */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm backdrop-brightness-50">
          <DeleteConfirmation />
        </div>
      )}

      {/* Cart */}
      {showCart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm backdrop-brightness-50">
          <Cart />
        </div>
      )}

      {/* Deliver address */}
      {showDeliveryAddress && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm backdrop-brightness-50">
          <DeliveryAddress />
        </div>
      )}

      {/* Show Order Summary */}
      {showOrderSummary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm backdrop-brightness-50">
          <Elements stripe={STRIPE_PROMISE}>
            <OrderSummary />
          </Elements>
        </div>
      )}
    </div>
  );
}
