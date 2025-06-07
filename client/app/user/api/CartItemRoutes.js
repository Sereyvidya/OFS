// APIs related to cart_item_routes.py in the server

import { fetchWithRefresh } from "./AuthRoutes";

export const getAllItemsFromCart = async (API_URL) => {
  try {
    const res = await fetchWithRefresh(`${API_URL}/cart-item/get`, API_URL, {
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
    console.error("Error getting all items from cart:", error);
    return { ok: false };
  }
};

export const postItemToCart = async (API_URL, product) => {
  try {
    const res = await fetchWithRefresh(`${API_URL}/cart-item/post`, API_URL, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productID: product.productID,
        quantity: 1,
      }),
    });

    let data = null;
    try {
      data = await res.json();
    } catch (err) {
      console.warn("Failed to parse JSON:", err);
    }
    return { ok: res.ok, data };
  } catch (error) {
    console.error("Error adding an item to cart:", error);
    return { ok: false };
  }
};

export const putItemInCart = async (API_URL, cartItemID, newQuantity) => {
  try {
    // const token = sessionStorage.getItem("authToken");
    const res = await fetchWithRefresh(
      `${API_URL}/cart-item/put/${cartItemID}`,
      API_URL,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          // Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity: newQuantity }),
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
    console.error("Error updating an item in cart:", error);
    return { ok: false };
  }
};

export const deleteItemFromCart = async (API_URL, cartItemID) => {
  try {
    const res = await fetchWithRefresh(
      `${API_URL}/cart-item/delete/${cartItemID}`,
      API_URL,
      {
        method: "DELETE",
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
    console.error("Error deleting an item from cart:", error);
    return { ok: false };
  }
};
