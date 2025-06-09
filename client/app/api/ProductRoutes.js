// APIs related to product_routes.py in the server

import { fetchWithRefresh } from "./AuthRoutes";

export const getAllProducts = async (API_URL) => {
  try {
    const res = await fetch(`${API_URL}/product/get`, {
      method: "GET",
    });

    let data = null;
    try {
      data = await res.json();
    } catch (err) {
      console.warn("Could not parse response JSON:", err);
    }
    return { ok: res.ok, data };
  } catch (error) {
    console.error("Error getting all products:", error);
    return { ok: false };
  }
};

export const postProduct = async (API_URL, formData) => {
  try {
    const res = await fetchWithRefresh(`${API_URL}/product/post`, API_URL, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    let data = null;
    try {
      data = await res.json();
    } catch (err) {
      console.warn("Could not parse response JSON:", err);
    }
    return { ok: res.ok, data };
  } catch (error) {
    console.error("Error adding a product:", error);
    return { ok: false };
  }
};

export const putProduct = async (API_URL, productID, formData) => {
  try {
    const res = await fetchWithRefresh(
      `${API_URL}/product/put/${productID}`,
      API_URL,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
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
    console.error("Error updating a product:", error);
    return { ok: false };
  }
};

export const deleteProduct = async (API_URL, productID) => {
  try {
    const res = await fetchWithRefresh(
      `${API_URL}/product/delete/${productID}`,
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
    console.error("Error deleting a product:", error);
    return { ok: false };
  }
};
