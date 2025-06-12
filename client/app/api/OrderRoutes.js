// APIs related to order_routes.py in the server

import { fetchWithRefresh } from "./AuthRoutes";

export const postOrder = async (
  API_URL,
  address,
  total,
  weight,
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
        weight: weight,
        lat: address.lat,
        lng: address.lng,
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

export const getUserOrders = async (API_URL) => {
  try {
    const res = await fetchWithRefresh(`${API_URL}/order/get/user`, API_URL, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    let data = null;
    try {
      data = await res.json();
    } catch (err) {
      console.warn("Could not parse response JSON:", err);
    }
    return { ok: res.ok, data };
  } catch (error) {
    console.error("Error getting user's orders:", error);
    return { ok: false };
  }
};

export const getAllAwaitingOrders = async (API_URL) => {
  try {
    const res = await fetchWithRefresh(
      `${API_URL}/order/get/awaiting`,
      API_URL,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    let data = null;
    try {
      data = await res.json();
    } catch (err) {
      console.warn("Could not parse response JSON:", err);
    }
    return { ok: res.ok, data };
  } catch (error) {
    console.error("Error getting all awaiting orders:", error);
    return { ok: false };
  }
};

export const putDeliveredOrder = async (API_URL, orderID) => {
  try {
    const res = await fetchWithRefresh(
      `${API_URL}/order/put/delivered/${orderID}`,
      API_URL,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    let data = null;
    try {
      data = await res.json();
    } catch (err) {
      console.warn("Could not parse response JSON:", err);
    }
    return { ok: res.ok, data };
  } catch (error) {
    console.error("Error updating a delivered order:", error);
    return { ok: false };
  }
};
