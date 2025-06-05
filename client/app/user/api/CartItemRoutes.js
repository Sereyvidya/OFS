// APIs related to cart_item_routes.py in the server

export const getAllItemsFromCart = async (API_URL) => {
  try {
    const token = sessionStorage.getItem("authToken");
    const res = await fetch(`${API_URL}/cart-item/get`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    return { ok: res.ok, data };
  } catch (error) {
    console.error("Error getting all items from cart:", error);
    return { ok: false };
  }
};

export const postItemToCart = async (API_URL, product) => {
  try {
    const token = sessionStorage.getItem("authToken");
    const res = await fetch(`${API_URL}/cart-item/post`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productID: product.productID,
        quantity: 1,
      }),
    });

    const data = await res.json();
    return { ok: res.ok, data };
  } catch (error) {
    console.error("Error adding an item to cart:", error);
    return { ok: false };
  }
};

export const putItemInCart = async (API_URL, cartItemID, newQuantity) => {
  try {
    const token = sessionStorage.getItem("authToken");
    const res = await fetch(`${API_URL}/cart-item/put/${cartItemID}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quantity: newQuantity }),
    });

    const data = await res.json();
    return { ok: res.ok, data };
  } catch (error) {
    console.error("Error updating an item in cart:", error);
    return { ok: false };
  }
};

export const deleteItemFromCart = async (API_URL, cartItemID) => {
  try {
    const token = sessionStorage.getItem("authToken");
    const res = await fetch(`${API_URL}/cart-item/delete/${cartItemID}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    return { ok: res.ok, data };
  } catch (error) {
    console.error("Error deleting an item from cart:", error);
    return { ok: false };
  }
};
