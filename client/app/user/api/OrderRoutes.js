// APIs related to order_routes.py in the server

import { fetchWithRefresh } from "./AuthRoutes";

export const postOrder = async (
  API_URL,
  address,
  total,
  orderItems,
  paymentMethodId,
) => {
  try {
    const res = await fetchWithRefresh(`${API_URL}/order/post`, API_URL, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        street: address.street,
        city: address.city,
        state: address.state,
        zip: address.zip,
        total: total,
        orderItems: orderItems,
        paymentMethodId: paymentMethodId,
      }),
    });
    const data = await res.json();
    return { ok: res.ok, data };
  } catch (error) {
    console.error("Error with placing an order:", error);
    return {
      ok: false,
      error: "Error with placing an order. Please try again.",
    };
  }
};
