"use client";

import React from "react";

const PaymentInformation = ({ onClose, setShowDeliveryAddress, paymentInformation, setPaymentInformation, setShowOrderSummary }) => {

  const isPaymentInformationComplete =
    paymentInformation.name && paymentInformation.number && 
    paymentInformation.expirationDate && paymentInformation.cvc;

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

      <form className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Card Holder Name"
          className="w-full flex justify-between border border-gray-300 rounded-md p-2 hover:bg-gray-200 shadow transition-colors whitespace-nowrap focus:outline-gray-400"
          value={paymentInformation.name}
          onChange={(e) => setPaymentInformation({ ...paymentInformation, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Card Number"
          className="w-full flex justify-between border border-gray-300 rounded-md p-2 hover:bg-gray-200 shadow transition-colors whitespace-nowrap focus:outline-gray-400"
          value={paymentInformation.number}
          onChange={(e) => setPaymentInformation({ ...paymentInformation, number: e.target.value })}
        />
        <input
          type="text"
          placeholder="Expiration Date"
          className="w-full flex justify-between border border-gray-300 rounded-md p-2 hover:bg-gray-200 shadow transition-colors whitespace-nowrap focus:outline-gray-400"
          value={paymentInformation.expirationDate}
          onChange={(e) => setPaymentInformation({ ...paymentInformation, expirationDate: e.target.value })}
        />
        <input
          type="text"
          placeholder="CVC"
          className="w-full flex justify-between border border-gray-300 rounded-md p-2 hover:bg-gray-200 shadow transition-colors whitespace-nowrap focus:outline-gray-400"
          value={paymentInformation.cvc}
          onChange={(e) => setPaymentInformation({ ...paymentInformation, cvc: e.target.value })}
        />
        <div className="flex justify-between">
          <button
            className="border border-blue-300 bg-blue-600 text-white hover:bg-blue-400 hover:scale-103 shadow transition-colors cursor-pointer whitespace-nowrap py-2 px-4 rounded-lg shadow-md text-lg"
            onClick={(e) => {
              onClose()
              setShowDeliveryAddress(true)
            }}>
            Go Back
          </button>
          <button
            className="border border-green-300 bg-green-600 text-white hover:bg-green-400 hover:scale-103 shadow transition-colors cursor-pointer whitespace-nowrap py-2 px-4 rounded-lg shadow-md text-lg"
            disabled={!isPaymentInformationComplete}
            onClick={(e) => {
              onClose()
              setShowOrderSummary(true)
            }}>
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentInformation;