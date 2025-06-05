// APIs related to product_routes.py in the server

export const getAllProducts = async (API_URL) => {
  try {
    const res = await fetch(`${API_URL}/product/get`, {
      method: "GET",
    });

    const data = await res.json();
    return { ok: res.ok, data };
  } catch (error) {
    console.error("Error getting all products:", error);
    return { ok: false };
  }
};
