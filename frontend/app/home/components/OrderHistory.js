"use client";

import React from "react";

const OrderHistory = ({ orders, onClose }) => {
  return (
    <div className="flex flex-col w-100 h-auto m-auto bg-white p-4 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-sky-950 [text-shadow:_0_1px_0_rgb(107_114_128_/_30%)]">
          Order History
        </h2>
        <button
          onClick={onClose}
          className="bg-gray-300 px-2 rounded hover:bg-gray-400 hover:scale-103 shadow transition-colors"
        >
          &times;
        </button>
      </div>

      <div className="overflow-y-auto max-h-80">
        {orders.length === 0 ? (
          <p className="text-center text-gray-500 italic">You haven’t placed any orders yet.</p>
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
    </div>
  );
}

export default OrderHistory;
