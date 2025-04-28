"use client";

import React from "react";

const OrderHistory = ({ orders, onClose }) => {
  return (
    <div className="flex flex-col w-100 h-auto m-auto bg-[#f1f0e9] rounded-lg shadow">
      <div className="relative bg-[#41644a] border-2 border-[#90b89b4d] text-white flex justify-between items-center h-20 px-4 py-4 rounded-t-lg">
        <h1 className="absolute left-1/2 top-4 transform -translate-x-1/2 font-display text-4xl font-bold text-[#f1f0e9] [text-shadow:_0_1px_3px_#73977b]">Orders</h1>
        <button
          className="absolute right-4 top-4 bg-[#f1f0e9] border border-[#90b89b] text-[#41644a] px-2 rounded hover:bg-[#73977b] hover:scale-103 shadow transition-colors"
          onClick={onClose}
        >
          &times;
        </button>
      </div>

      <div className="overflow-y-auto max-h-80 border-2 border-gray-400 rounded-b-lg">
        {orders.length === 0 ? (
          <p className="text-center text-gray-500 italic py-4">You haven’t placed any orders yet.</p>
        ) : (
          orders.map((order) => (
            <div key={order.orderID} className="text-[#0d4715] border-b border-[#73977b] mx-4 py-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Order #{order.orderID}</span>
                <span className="text-[#41644a]">${order.total.toFixed(2)}</span>
              </div>
              <div className="text-sm text-[#73977b] mb-2">
                  {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : ""}
              </div>
              <ul className="space-y-1">
                {(order.items || []).map((item, i) => (
                  <li key={i} className="flex justify-between">
                    <span>
                      {item.productName || `Product ${item.productID}`} x{item.quantity}
                    </span>
                    <span className="text-[#41644a]">
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
