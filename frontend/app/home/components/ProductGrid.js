"use client";

import React, { useEffect, useState } from "react";

const ProductGrid = ({ isLoggedIn, setShowLogin, searchQuery, category, cartItems, setCartItems, setShowCart, fetchProducts, API_URL }) => {
  const [products, setProducts] = useState([]);

  const fetchCartItems = async () => {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      console.log("No token found.");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/cartItem/get`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setCartItems(data);
        console.log("Fetched cart items:", data);
      } else {
        console.error("Failed to fetch cart items");
      }
    } catch (error) {
      console.error("Error fetching cart items", error);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/product/display`);
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          console.error("Failed to fetch products");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
    if (isLoggedIn) {fetchCartItems()}; 
  }, [isLoggedIn, fetchProducts]);

  const handleAddToCart = async (product) => {
    if (!isLoggedIn) {
      console.log("Not logged in.");
      setShowLogin(true);
      return
    }

    const token = sessionStorage.getItem("authToken");
    if (!token) {
      console.log("No token found.");
      setShowLogin(true);
      return
    }

    console.log("Product object:", product);

    const response = await fetch(`${API_URL}/cartItem/add`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            productID: product.productID,
            quantity: 1
        })
    });

    if (response.ok) {
        console.log("Product added to cart!");
        fetchCartItems();
    } else {
        console.error("Failed to add product to cart");
    }
  };

  const filteredProducts = products
    .filter(product => product.quantity !== -1) // "Deleted" products have quantity = -1
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = category === "All" || product.category === category;
      return matchesSearch && matchesCategory;
  });

  const isInCart = (id) => {
    return cartItems.some((item) => item.product.productID === id);
  };

  if (!products.length) {
    return <div className="flex items-center justify-center h-screen text-xl">Loading...</div>;
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 px-6 py-6 w-full mx-auto">
      {filteredProducts.length > 0 ? (
        filteredProducts.map((product, index) => {
          const isAdded = isInCart(product.productID);
          return (
            <div key={index} className="rounded-md p-3 bg-[#f1f0e9] shadow flex flex-col items-center text-sm transition-transform duration-300 hover:scale-105 hover:shadow-lg">
              <div className="w-full flex justify-center bg-[#41644a] border-2 border-[#90b89b] py-2 rounded-md">
                <h3 className="font-semibold text-lg text-[#f1f0e9] [text-shadow:_0_1px_3px_#73977b]">{product.name}</h3>
              </div>
              <img
                src={`data:image/jpeg;base64,${product.image}`}
                alt={product.name}
                className="w-full aspect-1 object-cover rounded-md mt-3"
              />
              <div className="flex flex-col items-center mt-3">
                <p className="text-[#41644a]">{product.description}</p>
                <p className="text-[#41644a]">${product.price}</p>
              </div>
              <button
                className={`mt-3 px-3 py-1.5 text-sm font-medium rounded-full transition shadow whitespace-nowrap
                  ${
                    product.quantity === 0 ? 'border-2 border-red-200 bg-red-400 text-white cursor-not-allowed'
                      : isAdded ? 'border-2 border-green-300 bg-green-600 text-white hover:bg-green-400 hover:scale-105'
                      : 'bg-[#e9762b] border-2 border-orange-300 text-[#f1f0e9] hover:bg-orange-400 hover:scale-105'
                  }
                `}
                onClick={() => {
                  if (product.quantity === 0) return;
                  if (isAdded) { 
                    setShowCart(true);
                  } else {
                    handleAddToCart(product);
                  }
                }}
                disabled={product.quantity === 0}
              >
                {product.quantity === 0 ? 'Out of Stock' : isAdded ? 'View Cart' : 'Add to Cart'}
              </button>
            </div>
          );
        })
      ) : (
        <p className="text-gray-500 col-span-full text-center">No products found</p>
      )}
    </div>
  );
  
};

export default ProductGrid;
