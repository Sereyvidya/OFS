// APIs related to product_routes.py in the server

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
