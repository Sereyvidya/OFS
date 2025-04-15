"use client";

import React from "react";

const OrderSummary = ({ onClose, cartItems, address, paymentInformation, setShowPaymentInformation }) => {

  const handlePlaceOrder = async () => {
    const token = localStorage.getItem("authToken");

    const arr = cartItems.map((item) => ({
      productID: item.product.productID,
      quantity: item.quantity,
      priceAtPurchase: item.product.price,
    }))

    console.log(arr)
  
    try {
      const response = await fetch("http://127.0.0.1:5000/order/add", {
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
          cartItems: arr,
        }),
      });
  
      if (response.ok) {
        alert("Order placed successfully!");
        onClose();
      } else {
        const error = await response.json();
        console.error("Error placing order:", error);
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("There was an error placing your order.");
    }
  };

  const subTotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  const cartWeight = cartItems.reduce(
    (total, item) => total + item.product.weight * item.quantity,
    0
  );
  const deliveryFee = cartWeight > 20 ? 10 : 0;
  const TAX_RATE = 0.0825;
  const totalWithTaxes = subTotal * (1 + TAX_RATE);
  const totalCost = totalWithTaxes + deliveryFee;

  const lastFourDigits =
  paymentInformation.number && paymentInformation.number.length >= 4
    ? paymentInformation.number.slice(-4)
    : "****";


  return (
    <div className="flex flex-col gap-4 w-100 h-auto m-auto bg-white p-4 rounded-lg shadow-lg">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-sky-950">Order Summary</h2>
        <button
          className="bg-gray-300 px-2 rounded hover:bg-gray-400 hover:scale-103 shadow"
          onClick={onClose}
        >
          &times;
        </button>
      </div>

      {/* Cart Items */}
      <div className="space-y-1">
        {cartItems.map((item) => (
          <div className="flex justify-between" key={item.cartItemID}>
            <span className="text-gray-700">{item.product.name}</span>
            <span className="text-gray-700">
              ${(item.product.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>


      {/* Payment Information & Delivery Address */}
      <div className="border-t border-gray-300 pt-4">
        <h3 className="text-lg font-medium text-sky-950 mb-2">Payment & Delivery</h3>
        <div className="text-gray-700">
            <p><span className="font-semibold">Cardholder:</span> {paymentInformation.name}</p>
            <p>
              <span className="font-semibold">Card Number:</span> **** **** **** {lastFourDigits}
            </p>
            <p>
              <span className="font-semibold">Expires:</span> {paymentInformation.expirationDate}
            </p>
            <p>
              <span className="font-semibold">Delivery to:</span> 
              {address.street}, {address.city}, {address.state} {address.zip}
            </p>
          </div>
      </div>

      {/* Cost Summary Section */}
      <div className="my-4 border-t border-gray-300 pt-4">
        <div className="flex justify-between">
          <p className="text-gray-700">Subtotal</p>
          <p className="text-gray-700">${subTotal.toFixed(2)}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-700">After taxes</p>
          <p className="text-gray-700">${totalWithTaxes.toFixed(2)}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-700">Delivery Fee</p>
          <p className="text-gray-700">${deliveryFee.toFixed(2)}</p>
        </div>
        <div className="flex justify-between font-bold text-green-700">
          <p>Total</p>
          <p>${totalCost.toFixed(2)}</p>
        </div>
      </div>

      {/* Buttons Section */}
      <div className="flex justify-between">
        <button
          className="border border-blue-300 bg-blue-600 text-white hover:bg-blue-400 hover:scale-103 transition-colors cursor-pointer whitespace-nowrap py-2 px-4 rounded-lg shadow-md text-lg"
          onClick={() => {
            onClose();
            setShowPaymentInformation(true);
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