"use client";

import React from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

const PaymentInformation = ({
  onClose,
  setShowDeliveryAddress,
  setShowOrderSummary,
  setShowPaymentInformation,
  setPaymentInformation
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
      const paymentInformation = result.paymentMethod;
      setPaymentInformation(paymentInformation);
      setShowOrderSummary(true);
      setShowPaymentInformation(false);
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
