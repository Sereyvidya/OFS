"use client";

import React, { useState } from "react";

const Checkout = ({ onClose, cartItems }) => {
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
  });

  const isAddressComplete =
    address.street && address.city && address.state && address.zip;

  const handlePlaceOrder = async () => {
    const token = localStorage.getItem("authToken");

    if (!isAddressComplete) {
      alert("Please fill out the full address.");
      return;
    }

    //productID: item.product.id

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
        onClose(); // Close modal or redirect
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

  const handleInputChange = (field, value) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex flex-col w-100 max-h-[400px] overflow-y-auto m-auto bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Checkout</h2>
        <button
          className="bg-gray-300 px-2 rounded hover:bg-gray-400 hover:scale-103 shadow"
          onClick={onClose}
        >
          &times;
        </button>
      </div>

      <form className="flex flex-col gap-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-700">Shipping Address</h3>
        <input
          type="text"
          placeholder="Street Address"
          className="border border-black rounded-md p-2"
          value={address.street}
          onChange={(e) => handleInputChange("street", e.target.value)}
        />
        <input
          type="text"
          placeholder="City"
          className="border border-black rounded-md p-2"
          value={address.city}
          onChange={(e) => handleInputChange("city", e.target.value)}
        />
        <input
          type="text"
          placeholder="State"
          className="border border-black rounded-md p-2"
          value={address.state}
          onChange={(e) => handleInputChange("state", e.target.value)}
        />
        <input
          type="text"
          placeholder="ZIP Code"
          className="border border-black rounded-md p-2"
          value={address.zip}
          onChange={(e) => handleInputChange("zip", e.target.value)}
        />
      </form>

      <div className="space-y-2 ">
        <h3 className="text-lg font-semibold text-gray-700">Your Cart</h3>
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

        <div className="my-4">
          <p className="text-gray-700">Your cart weighs <strong>{cartWeight.toFixed(2)}</strong> lbs.</p>
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

        <button
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 hover:scale-105 transition shadow"
          onClick={handlePlaceOrder}
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default Checkout;
