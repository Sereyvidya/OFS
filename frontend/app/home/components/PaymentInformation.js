"use client";

import React from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

const PaymentInformation = ({
  onClose,
  setShowDeliveryAddress,
  setShowOrderSummary,
  setPaymentMethodId,
  address,
  cartItems
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleNext = async (e) => {
    e.preventDefault();
  
    if (!stripe || !elements) return;
  
    const cardElement = elements.getElement(CardElement);
    const result = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });
  
    if (result.error) {
      console.error(result.error.message);
      alert("Payment info error: " + result.error.message);
    } else {
      const paymentMethodId = result.paymentMethod.id;
      setPaymentMethodId(paymentMethodId);
      
      const totalPrice = cartItems.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      );

      const reducedCartItems = cartItems.map(item => ({
        productID: item.product.productID,
        quantity: item.quantity,
        priceAtPurchase: parseFloat(item.product.price)
      }));

      const orderData = {
        street: address.street,
        city: address.city,
        state: address.state,
        zip: address.zip,
        total: totalPrice,
        cartItems: reducedCartItems,
        paymentMethodId: paymentMethodId,
      };
  
      try {
        const response = await fetch("http://127.0.0.1:5000/order/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify(orderData),
        });
  
        const data = await response.json();
        console.log("Full response from server:", data);
  
        if (response.ok) {
          alert("Order placed successfully!");
          onClose();
          setShowOrderSummary(true);
        } else {
          alert("Payment error: " + data.error);
        }
      } catch (err) {
        console.error(err);
        alert("Something went wrong during order placement");
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 w-100 h-auto m-auto bg-white p-4 rounded-lg shadow-lg">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-sky-950">Payment Information</h2>
        <button
          className="bg-gray-300 px-2 rounded hover:bg-gray-400 hover:scale-103 shadow"
          onClick={onClose}
        >
          &times;
        </button>
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleNext}>
        <div className="border border-gray-300 rounded-md p-4 hover:bg-gray-100 shadow">
          <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
        </div>

        <div className="flex justify-between mt-4">
          <button
            type="button"
            className="border border-blue-300 bg-blue-600 text-white hover:bg-blue-400 hover:scale-103 shadow transition-colors cursor-pointer whitespace-nowrap py-2 px-4 rounded-lg shadow-md text-lg"
            onClick={() => {
              onClose();
              setShowDeliveryAddress(true);
            }}
          >
            Go Back
          </button>
          <button
            type="submit"
            className="border border-green-300 bg-green-600 text-white hover:bg-green-400 hover:scale-103 shadow transition-colors cursor-pointer whitespace-nowrap py-2 px-4 rounded-lg shadow-md text-lg"
            disabled={!stripe}
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentInformation;
