"use client";

import React from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

const OrderSummary = ({ onClose, cartItems, setCartItems, address, setShowDeliveryAddress, apiUrl, paymentInformation, setPaymentInformation }) => {

  const subTotal = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const cartWeight = cartItems.reduce((total, item) => total + item.product.weight * item.quantity, 0);

  const deliveryFee = cartWeight > 20 ? 10 : 0;
  const totalCost = subTotal + deliveryFee;

  const stripe = useStripe();
  const elements = useElements();

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    // Stripe
    if (!stripe || !elements) return;
  
    const cardElement = elements.getElement(CardElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      console.error(error.message);
      alert("Payment info error: " + error.message);
      return;
    }
    setPaymentInformation(paymentMethod);

    //Place order
    const token = localStorage.getItem("authToken");

    const orderItems = cartItems.map((item) => ({
      productID: item.product.productID,
      quantity: item.quantity,
      priceAtPurchase: parseFloat(item.product.price),
    }));

    if (!paymentInformation?.id) {
      alert("Payment method not found. Please go back and add payment info.");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/order/add`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          street: address.street,
          city: address.city,
          state: address.state,
          zip: address.zip,
          total: totalCost,
          cartItems: orderItems,
          paymentMethodId: paymentInformation.id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Order placed successfully!");
        setCartItems([]);
        onClose();
      } else {
        alert("Payment error: " + data.error);
      }
    } catch (error) {
      alert("There was an error placing your order.");
    }
  };

  return (
    <div className="flex flex-col w-110 h-auto m-auto bg-[#f1f0e9] rounded-lg shadow-lg">
      <div className="relative bg-[#41644a] border-2 border-[#90b89b4d] text-white flex justify-between items-center h-20 px-4 py-4 rounded-t-lg">
        <h1 className="absolute left-1/2 top-4 transform -translate-x-1/2 font-display text-4xl font-bold text-[#f1f0e9] [text-shadow:_0_1px_3px_#73977b]">Your Order</h1>
        <button
          className="absolute right-4 top-4 bg-[#f1f0e9] border border-[#90b89b] text-[#41644a] px-2 rounded hover:bg-[#73977b] hover:scale-103 shadow transition-colors"
          onClick={onClose}
        >
          &times;
        </button>
      </div>

      <div className="border-2 border-gray-400 rounded-b-lg flex flex-col py-4 gap-4">
        {/* Cart Items */}
        <div className="overflow-y-auto max-h-65 mx-4 rounded-md border border-[#90b89b]">
          <table className="min-w-full table-auto">
            <thead className="bg-[#90b89b]">
              <tr>
                <th className="py-2 px-4 text-left text-sm font-medium text-[#0d4715]">Product</th>
                <th className="py-2 px-4 text-left text-sm font-medium text-[#0d4715]">Quantity x Price</th>
                <th className="py-2 px-4 text-left text-sm font-medium text-[#0d4715]">Total</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.cartItemID} className="border-t border-[#90b89b]">
                  <td className="py-2 px-4 text-sm text-[#0d4715]">{item.product.name}</td>
                  <td className="py-2 px-4 text-sm text-[#0d4715]">
                    {item.quantity} x ${item.product.price}
                  </td>
                  <td className="py-2 px-4 text-sm text-[#0d4715]">
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
            <p className="font-semibold text-[#0d4715]">Subtotal:</p>
            <p className="text-[#41644a]">${subTotal.toFixed(2)}</p>
          </div>
          <div className="flex justify-between">
            <p className="font-semibold text-[#0d4715]">Delivery Fee:</p>
            <p className="text-[#41644a]">${deliveryFee.toFixed(2)}</p>
          </div>
          <div className="flex justify-between">
            <p className="font-semibold text-[#0d4715]">Total:</p>
            <p className="text-[#41644a]">${totalCost.toFixed(2)}</p>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="flex flex-col mx-4">
          <span className="font-semibold text-[#0d4715]">Delivery to:</span> 
          <p className="text-[#41644a]">
            {address.street}, {address.city}, {address.state} {address.zip}
          </p>
        </div>

        {/* Payment Information */}
        <div className="flex flex-col mx-4">
          <p className="font-semibold text-[#0d4715]">Payment Information:</p>
          <div className="mt-2 border border-gray-300 text-[#0d4715] placeholder-[#73977b] hover:bg-[#90b89b] rounded-md p-4 shadow focus-within:outline">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    transition: "background-color 150ms ease-in-out, color 150ms ease-in-out",
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
        <div className="flex justify-between mx-4">
          <button
            className="bg-[#e9762b] border border-orange-300 text-[#f1f0e9] hover:scale-103 transition-colors cursor-pointer whitespace-nowrap py-2 px-4 rounded-lg shadow-md text-lg"
            onClick={() => {
              onClose();
              setShowDeliveryAddress(true);
            }}
          >
            Go Back
          </button>
          <button
            className="border border-green-300 bg-green-600 text-[#f1f0e9] hover:bg-green-400 hover:scale-103 transition-colors cursor-pointer whitespace-nowrap py-2 px-4 rounded-lg shadow-md text-lg"
            onClick={handlePlaceOrder}
          >
            Confirm Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderSummary;