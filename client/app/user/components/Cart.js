"use client";

import React, { useState } from "react";
import { useUserContext } from "../context/UserContext";
import { putItemInCart, deleteItemFromCart } from "../api/CartItemRoutes";
import CartItemCard from "./CartItemCard";

/**
 * Renders user's cart, showing each item, its quantity
 * and buttons for editing and removing items.
 */
const Cart = () => {
  const { API_URL, setShowCart, cartItems, fetchCart, setShowDeliveryAddress } =
    useUserContext();
  const [emptyCartError, setEmptyCartError] = useState(false);
  const [itemErrors, setItemErrors] = useState({});
  const MAXIMUM_CART_WEIGHT = 50;

  const handleUpdateItemQuantity = async (cartItemID, newQuantity) => {
    setItemErrors((prev) => ({ ...prev, [cartItemID]: "" }));
    const { ok, data } = await putItemInCart(API_URL, cartItemID, newQuantity);
    if (ok) {
      fetchCart();
    } else {
      setItemErrors((prev) => ({
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

  const handleNextClick = async (e) => {
    if (cartItems.length > 0) {
      if (cartWeight <= MAXIMUM_CART_WEIGHT) {
        setShowCart(false);
        setShowDeliveryAddress(true);
      }
    } else {
      setEmptyCartError(true);
    }
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );
  const cartWeight = cartItems.reduce(
    (total, item) => total + item.product.weight * item.quantity,
    0,
  );

  return (
    <div className="m-auto flex h-auto w-110 flex-col rounded-lg bg-[#f1f0e9]">
      <div className="relative flex h-20 items-center justify-between rounded-t-lg border-2 border-[#90b89b4d] bg-[#41644a] px-4 py-4 text-[#f1f0e9]">
        <h1 className="font-display absolute top-4 left-1/2 -translate-x-1/2 transform text-4xl font-bold text-[#f1f0e9] [text-shadow:_0_1px_3px_#73977b]">
          Your Cart
        </h1>
        <button
          className="absolute top-4 right-4 rounded border border-[#90b89b] bg-[#f1f0e9] px-2 text-[#41644a] shadow transition-colors hover:scale-103 hover:bg-[#73977b] focus:ring-2 focus:ring-[#73977b] focus:outline-none"
          onClick={() => setShowCart(false)}
        >
          &times;
        </button>
      </div>

      <div className="rounded-b-lg border-2 border-gray-400">
        <div className="max-h-90 space-y-4 overflow-y-auto px-4 py-4">
          {cartItems.length === 0 ? (
            emptyCartError ? (
              <p className="text-center text-red-500">
                Your cart must have at least 1 item to proceed.
              </p>
            ) : (
              <p className="text-center text-gray-500 italic">
                Your cart is empty.
              </p>
            )
          ) : (
            cartItems.map((item) => (
              <CartItemCard
                key={item.cartItemID}
                item={item}
                error={itemErrors[item.cartItemID]}
                handleUpdateItemQuantity={handleUpdateItemQuantity}
                handleRemoveItemFromCart={handleRemoveItemFromCart}
              />
            ))
          )}
        </div>

        <div className="right flex justify-between px-4">
          <p></p>
          {cartWeight > MAXIMUM_CART_WEIGHT ? (
            <p className="text-red-500">
              {cartWeight} / {MAXIMUM_CART_WEIGHT} lbs (limit exceeded)
            </p>
          ) : (
            <p className="text-[#41644a]">
              {cartWeight} / {MAXIMUM_CART_WEIGHT} lbs
            </p>
          )}
        </div>

        <div className="flex flex-row justify-between px-4 pb-4">
          <div className="flow-row no-wrap mt-4 flex rounded-md px-4 py-2 text-lg font-medium text-[#0d4715] shadow">
            <p className="text-[#0d4715]">Total:&nbsp;</p>
            <p className="text-[#41644a]">${totalPrice.toFixed(2)}</p>
          </div>
          <button
            className="mt-4 cursor-pointer rounded-lg border-2 border-green-300 bg-green-600 px-4 py-2 text-lg whitespace-nowrap text-[#f1f0e9] shadow shadow-md transition-colors hover:scale-103 hover:bg-green-400 focus:ring-2 focus:ring-green-500 focus:outline-none"
            onClick={handleNextClick}
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
