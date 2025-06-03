// APIs related to the product_routes.py in the server

export const fetchProducts = async (API_URL, setProducts) => {
  try {
    const res = await fetch(`${API_URL}/product/get`);
    if (res.ok) {
      const data = await res.json();
      setProducts(data);
    } else {
      console.error("Failed to fetch products.");
    }
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};
