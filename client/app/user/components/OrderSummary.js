"use client";

import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import { useUserContext } from "../context/UserContext";
import { postOrder } from "../../api/OrderRoutes";

/**
 * Renders a summary of the user's order including the cart's content
 * and weight; the subtotal, deliveryfree, and total costs;
 * delivery address; and payment information.
 */
const OrderSummary = () => {
  const {
    API_URL,
    cartItems,
    address,
    setShowDeliveryAddress,
    setShowOrderSummary,
    fetchCart,
    fetchAllProducts,
  } = useUserContext();

  // For disabling check out button while waiting for a response
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set a cooldown on the check out button when response is successful
  const [cooldown, setCooldown] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  const cartWeight = cartItems.reduce(
    (total, item) => total + item.product.weight * item.quantity,
    0,
  );
  const deliveryFee = cartWeight > 20 ? 10 : 0;
  const subTotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );
  const total = subTotal + deliveryFee;

  const orderItems = cartItems.map((item) => ({
    productID: item.product.productID,
    quantity: item.quantity,
    priceAtPurchase: parseFloat(item.product.price),
  }));

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (isSubmitting || cooldown) return;

    setIsSubmitting(true);

    if (!stripe || !elements) {
      toast.error("Payment system not ready. Please refresh and try again.");
      setIsSubmitting(false);
      return;
    }

    // Gets user-inputed card information and use it to create a payment
    const cardElement = elements.getElement(CardElement);
    const { paymentError, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });
    if (paymentError || !paymentMethod) {
      toast.error(
        paymentError?.message ||
          "Unable to create payment method. Please check your card info.",
      );
      setIsSubmitting(false);
      return;
    }

    const paymentMethodId = paymentMethod.id;
    const { ok, data, error } = await postOrder(
      API_URL,
      address,
      total,
      orderItems,
      paymentMethodId,
    );
    if (ok) {
      fetchCart();
      fetchAllProducts();
      setCooldown(true);
      setTimeout(() => setCooldown(false), 5000);
      toast.success("Order placed successfully!", {
        onClose: () => {
          setShowOrderSummary(false);
        },
      });
    } else {
      toast.error(data?.error || error);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="m-auto flex h-auto w-110 flex-col rounded-lg bg-[#f1f0e9] shadow-lg">
      <div className="relative flex h-20 items-center justify-between rounded-t-lg border-2 border-[#90b89b4d] bg-[#41644a] px-4 py-4 text-white">
        <h1 className="font-display absolute top-4 left-1/2 -translate-x-1/2 transform text-4xl font-bold text-[#f1f0e9] [text-shadow:_0_1px_3px_#73977b]">
          Your Order
        </h1>
        <button
          className="absolute top-4 right-4 rounded border border-[#90b89b] bg-[#f1f0e9] px-2 text-[#41644a] shadow transition-colors hover:scale-103 hover:bg-[#73977b] focus:ring-2 focus:ring-[#73977b] focus:outline-none"
          onClick={() => setShowOrderSummary(false)}
        >
          &times;
        </button>
      </div>

      <div className="flex flex-col gap-4 rounded-b-lg border-2 border-gray-400 py-4">
        {/* Cart Items */}
        <div className="mx-4 max-h-65 overflow-y-auto rounded-md border border-[#90b89b]">
          <table className="min-w-full table-auto">
            <thead className="bg-[#90b89b]">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-[#0d4715]">
                  Product
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-[#0d4715]">
                  Quantity x Price
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-[#0d4715]">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.cartItemID} className="border-t border-[#90b89b]">
                  <td className="px-4 py-2 text-sm text-[#0d4715]">
                    {item.product.name}
                  </td>
                  <td className="px-4 py-2 text-sm text-[#0d4715]">
                    {item.quantity} x ${item.product.price}
                  </td>
                  <td className="px-4 py-2 text-sm text-[#0d4715]">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cost Summary Section */}
        <div className="mx-4">
          <div className="flex justify-between">
            <p className="font-semibold text-[#0d4715]">Cart Weight:</p>
            <p className="text-[#41644a]">{cartWeight} lbs</p>
          </div>
          <div className="flex justify-between">
            <p className="font-semibold text-[#0d4715]">Delivery Fee:</p>
            <p className="text-[#41644a]">${deliveryFee.toFixed(2)}</p>
          </div>
          <div className="flex justify-between">
            <p className="font-semibold text-[#0d4715]">Subtotal:</p>
            <p className="text-[#41644a]">${subTotal.toFixed(2)}</p>
          </div>
          <div className="flex justify-between">
            <p className="font-semibold text-[#0d4715]">Total:</p>
            <p className="text-[#41644a]">${total.toFixed(2)}</p>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="mx-4 flex flex-col">
          <span className="font-semibold text-[#0d4715]">Delivery to:</span>
          <p className="text-[#41644a]">
            {address.street}, {address.city}, {address.state} {address.zip}
          </p>
        </div>

        {/* Payment Information */}
        <div className="mx-4 flex flex-col">
          <p className="font-semibold text-[#0d4715]">Payment Information:</p>
          <div className="mt-2 rounded-md border border-gray-300 p-4 text-[#0d4715] placeholder-[#73977b] shadow focus-within:outline hover:bg-[#90b89b]">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    transition:
                      "background-color 150ms ease-in-out, color 150ms ease-in-out",
                  },
                  ":focus": {
                    outline: "2px solid #9CA3AF",
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Buttons Section */}
        <div className="mx-4 flex justify-between">
          <button
            className="cursor-pointer rounded-lg border-2 border-orange-300 bg-[#e9762b] px-4 py-2 text-lg whitespace-nowrap text-[#f1f0e9] shadow-md transition-colors hover:scale-103 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            onClick={() => {
              setShowOrderSummary(false);
              setShowDeliveryAddress(true);
            }}
          >
            Go Back
          </button>
          <button
            disabled={isSubmitting || cooldown}
            className={`cursor-pointer rounded-lg border-2 border-green-300 px-4 py-2 text-lg whitespace-nowrap text-[#f1f0e9] shadow-md transition-colors focus:ring-2 focus:ring-green-500 focus:outline-none ${
              isSubmitting
                ? "cursor-not-allowed bg-green-300"
                : "bg-green-600 hover:scale-103 hover:bg-green-400"
            }`}
            onClick={handlePlaceOrder}
          >
            {isSubmitting ? "Processing..." : "Check Out"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
