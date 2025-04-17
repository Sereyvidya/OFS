"use client";

import React from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

const OrderSummary = ({ onClose, cartItems, address, setShowDeliveryAddress, apiUrl, paymentInformation, setPaymentInformation }) => {

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
        onClose();
      } else {
        alert("Payment error: " + data.error);
      }
    } catch (error) {
      alert("There was an error placing your order.");
    }
  };

  return (
    <div className="flex flex-col gap-4 w-100 h-auto m-auto bg-white p-4 rounded-lg shadow-lg">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-sky-950">Order Summary</h2>
        <button
          className="bg-gray-300 px-2 rounded hover:bg-gray-400 hover:scale-103 shadow"
          onClick={onClose}
        >
          &times;
        </button>
      </div>

      {/* Cart Items */}
      <div className="overflow-y-auto max-h-65 rounded-md border border-gray-300">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Product</th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Quantity x Price</th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Total</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item.cartItemID} className="border-t border-gray-300">
                <td className="py-2 px-4 text-sm text-gray-700">{item.product.name}</td>
                <td className="py-2 px-4 text-sm text-gray-700">
                  {item.quantity} x ${item.product.price}
                </td>
                <td className="py-2 px-4 text-sm text-gray-700">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cost Summary Section */}
      <div className="">
        <div className="flex justify-between">
          <p className="font-semibold text-sky-950">Subtotal:</p>
          <p className="text-gray-700">${subTotal.toFixed(2)}</p>
        </div>
        <div className="flex justify-between">
          <p className="font-semibold text-sky-950">Delivery Fee:</p>
          <p className="text-gray-700">${deliveryFee.toFixed(2)}</p>
        </div>
        <div className="flex justify-between text-sky-950">
          <p className="font-semibold">Total:</p>
          <p>${totalCost.toFixed(2)}</p>
        </div>
      </div>

      {/* Delivery Address */}
      <div className="flex flex-col">
        <span className="font-semibold">Delivery to:</span> 
        <p className="">
          {address.street}, {address.city}, {address.state} {address.zip}
        </p>
      </div>

      {/* Payment Information */}
      <div className="flex flex-col">
        <p className="font-semibold">Payment Information:</p>
        <div className="mt-1 border border-gray-300 rounded-md p-4 hover:bg-gray-200 shadow focus-within:outline focus-within:outline-gray-400">
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
      <div className="flex justify-between">
        <button
          className="border border-blue-300 bg-blue-600 text-white hover:bg-blue-400 hover:scale-103 transition-colors cursor-pointer whitespace-nowrap py-2 px-4 rounded-lg shadow-md text-lg"
          onClick={() => {
            onClose();
            setShowDeliveryAddress(true);
          }}
        >
          Go Back
        </button>
        <button
          className="border border-green-300 bg-green-600 text-white hover:bg-green-400 hover:scale-103 transition-colors cursor-pointer whitespace-nowrap py-2 px-4 rounded-lg shadow-md text-lg"
          onClick={handlePlaceOrder}
        >
          Confirm Order
        </button>
      </div>
    </div>
  );
}

export default OrderSummary;