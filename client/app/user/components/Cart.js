"use client";

import React, { useState } from "react";
import { useUserContext } from "../context/UserContext";
import { putItemInCart, deleteItemFromCart } from "../api/CartItemRoutes";
import CartItemCard from "./CartItemCard";

/**
 * Renders user's cart.
 */
const Cart = () => {
  const { API_URL, setShowCart, cartItems, fetchCart } = useUserContext();
  const [errors, setErrors] = useState({});

  const handleUpdateItemQuantity = async (cartItemID, newQuantity) => {
    setErrors((prev) => ({ ...prev, [cartItemID]: "" }));
    const { ok, data } = await putItemInCart(API_URL, cartItemID, newQuantity);
    if (ok) {
      fetchCart();
    } else {
      setErrors((prev) => ({
        ...prev,
        [cartItemID]:
          data?.error || "Updating item's quantity failed. Please try again.",
      }));
    }
  };

  const handleRemoveItemFromCart = async (cartItemID) => {
    const { ok, data } = await deleteItemFromCart(API_URL, cartItemID);
    if (ok) {
      fetchCart();
    } else {
      console.error(
        data.error || "Removing item from cart failed. Please try again.",
      );
    }
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  return (
    <div className="m-auto flex h-auto w-100 flex-col rounded-lg bg-[#f1f0e9]">
      <div className="relative flex h-20 items-center justify-between rounded-t-lg border-2 border-[#90b89b4d] bg-[#41644a] px-4 py-4 text-[#f1f0e9]">
        <h1 className="font-display absolute top-4 left-1/2 -translate-x-1/2 transform text-4xl font-bold text-[#f1f0e9] [text-shadow:_0_1px_3px_#73977b]">
          Your Cart
        </h1>
        <button
          className="absolute top-4 right-4 rounded border border-[#90b89b] bg-[#f1f0e9] px-2 text-[#41644a] shadow transition-colors hover:scale-103 hover:bg-[#73977b]"
          onClick={() => setShowCart(false)}
        >
          &times;
        </button>
      </div>

      <div className="rounded-b-lg border-2 border-gray-400">
        <div className="max-h-88 space-y-4 overflow-y-auto px-4 py-4">
          {cartItems.length === 0 ? (
            <p className="text-center text-gray-500 italic">
              Your cart is empty.
            </p>
          ) : (
            cartItems.map((item) => (
              <CartItemCard
                key={item.cartItemID}
                item={item}
                error={errors[item.cartItemID]}
                handleUpdateItemQuantity={handleUpdateItemQuantity}
                handleRemoveItemFromCart={handleRemoveItemFromCart}
              />
            ))
          )}
        </div>

        <div className="flex flex-row justify-between px-4 pb-4">
          <p className="mt-4 rounded-md px-4 py-2 text-lg font-medium text-[#0d4715] shadow">
            Total: ${totalPrice.toFixed(2)}
          </p>
          <button
            className="mt-4 cursor-pointer rounded-lg border border-green-300 bg-green-600 px-4 py-2 text-lg whitespace-nowrap text-[#f1f0e9] shadow shadow-md transition-colors hover:scale-103 hover:bg-green-400"
            disabled={cartItems.length === 0}
            onClick={() => {
              setShowCart(false);
              // setShowDeliveryAddress(true);
            }}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
