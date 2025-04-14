"use client";

import React from "react";

const DeliveryAddress = ({ onClose, setShowCart, address, setAddress, setShowPaymentInformation }) => {

  const isAddressComplete =
    address.street && address.city && address.state && address.zip;

  return (
    <div className="flex flex-col gap-4 w-100 h-auto m-auto bg-white p-4 rounded-lg shadow-lg">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-sky-950">Delivery Address</h2>
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
          placeholder="Street Address"
          className="w-full flex justify-between border border-gray-300 rounded-md p-2 hover:bg-gray-200 shadow transition-colors whitespace-nowrap focus:outline-gray-400"
          value={address.street}
          onChange={(e) => setAddress({ ...address, street: e.target.value })}
        />
        <input
          type="text"
          placeholder="City"
          className="w-full flex justify-between border border-gray-300 rounded-md p-2 hover:bg-gray-200 shadow transition-colors whitespace-nowrap focus:outline-gray-400"
          value={address.city}
          onChange={(e) => setAddress({ ...address, city: e.target.value })}
        />
        <input
          type="text"
          placeholder="State"
          className="w-full flex justify-between border border-gray-300 rounded-md p-2 hover:bg-gray-200 shadow transition-colors whitespace-nowrap focus:outline-gray-400"
          value={address.state}
          onChange={(e) => setAddress({ ...address, state: e.target.value })}
        />
        <input
          type="text"
          placeholder="ZIP Code"
          className="w-full flex justify-between border border-gray-300 rounded-md p-2 hover:bg-gray-200 shadow transition-colors whitespace-nowrap focus:outline-gray-400"
          value={address.zip}
          onChange={(e) => setAddress({ ...address, zip: e.target.value })}
        />
        <div className="flex justify-between">
          <button
            className="border border-blue-300 bg-blue-600 text-white hover:bg-blue-400 hover:scale-103 shadow transition-colors cursor-pointer whitespace-nowrap py-2 px-4 rounded-lg shadow-md text-lg"
            onClick={(e) => {
              onClose()
              setShowCart(true)
            }}>
            Go Back
          </button>
          <button
            className="border border-green-300 bg-green-600 text-white hover:bg-green-400 hover:scale-103 shadow transition-colors cursor-pointer whitespace-nowrap py-2 px-4 rounded-lg shadow-md text-lg"
            disabled={!isAddressComplete}
            onClick={(e) => {
              onClose()
              setShowPaymentInformation(true)
            }}
            >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default DeliveryAddress;
