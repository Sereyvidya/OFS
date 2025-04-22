"use client";

import React from "react";

export default function OrderHistory({ orders, onClose }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg w-[600px] max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Order History</h2>
        <button
          onClick={onClose}
          className="bg-gray-300 px-2 rounded hover:bg-gray-400 hover:scale-103 shadow transition-colors"
        >
          &times;
        </button>
      </div>

      {orders.length === 0 ? (
        <p className="text-center text-gray-600">You haven’t placed any orders yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order.orderID} className="border-b pb-4 mb-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Order #{order.orderID}</span>
              <span className="text-gray-700">${order.total.toFixed(2)}</span>
            </div>
            <div className="text-sm text-gray-500 mb-2">
                {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : ""}
            </div>
            <ul className="space-y-1">
              {(order.items || []).map((item, i) => (
                <li key={i} className="flex justify-between">
                  <span>
                    {item.productName || `Product ${item.productID}`} x{item.quantity}
                  </span>
                  <span className="text-gray-700">
                    ${(item.priceAtPurchase * item.quantity).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}
