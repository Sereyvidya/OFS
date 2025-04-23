import React from "react";

export default function RouteMap() {
  return (
    <div className="w-full h-[600px] mt-6 border border-gray-300 rounded overflow-hidden shadow">
      <iframe
        src="http://127.0.0.1:5000/order/optimized-route-map"
        title="Optimized Delivery Route"
        width="100%"
        height="100%"
        frameBorder="0"
      />
    </div>
  );
}
