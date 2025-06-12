import React, { useEffect } from "react";
import { useUserContext } from "../context/UserContext";
import { getUserOrders } from "../../api/OrderRoutes";

const OrderHistory = () => {
  const {
    API_URL,
    orders,
    setOrders,
    showOrderHistory,
    setShowOrderHistory,
    setShowProfile,
  } = useUserContext();

  const fetchUserOrders = async () => {
    const { ok, data } = await getUserOrders(API_URL);

    if (ok) {
      setOrders(data);
    }
  };

  useEffect(() => {
    fetchUserOrders();
  }, [showOrderHistory]);

  return (
    <div className="m-auto flex h-auto w-100 flex-col rounded-lg bg-[#f1f0e9] shadow">
      <div className="relative flex h-20 items-center justify-between rounded-t-lg border-2 border-[#90b89b4d] bg-[#41644a] px-4 py-4 text-white">
        <h1 className="font-display absolute top-4 left-1/2 -translate-x-1/2 transform text-4xl font-bold text-[#f1f0e9] [text-shadow:_0_1px_3px_#73977b]">
          Orders
        </h1>
        <button
          className="absolute top-4 right-4 rounded border border-[#90b89b] bg-[#f1f0e9] px-2 text-[#41644a] shadow transition-colors hover:scale-103 hover:bg-[#73977b] focus:ring-2 focus:ring-[#73977b] focus:outline-none"
          onClick={() => {
            setShowOrderHistory(false);
            setShowProfile(true);
          }}
        >
          &times;
        </button>
      </div>

      <div className="rounded-b-lg border-2 border-gray-400">
        <div className="max-h-98 space-y-4 overflow-y-auto px-4 py-4">
          {orders.length === 0 ? (
            <p className="text-center text-gray-500 italic">No orders found.</p>
          ) : (
            [...orders].reverse().map((order, index) => (
              <div key={index} className="rounded-lg border p-4 shadow-sm">
                <div className="mb-2 flex justify-between text-sm text-gray-500">
                  <span className="text-[#73977b]">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </span>
                  <span
                    className={`font-semibold ${order.status === "delivered" ? "text-green-600" : "text-yellow-600"}`}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                </div>
                <div className="flex flex-row"></div>
                <p className="font-medium text-[#0d4715]">{order.street}</p>
                <div className="flex justify-between">
                  <p className="text-[#41644a]">San Jose, CA {order.zip}</p>
                  <p className="text-[#41644a]">Total: ${order.total}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
