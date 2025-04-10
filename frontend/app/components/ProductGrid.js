"use client";

import React, { useEffect, useState } from "react";
import AddToCart from "./AddToCart";

const ProductGrid = ({ isLoggedIn, setShowLogin, searchQuery, category, cartItems, setCartItems }) => {
  const [products, setProducts] = useState([]);
  const [addedToCart, setAddedToCart] = useState([]);

  // Get cartItems
  const fetchCartItems = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.log("No token found.");
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`http://127.0.0.1:5000/cartItem/get`, {
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

  // Get product
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/product/display");
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
    if (isLoggedIn) {fetchCartItems()}; // call get cartItems just once to initialize cartItems
  }, []);

  // Add product to cart 
  const handleAddToCart = async (product) => {
    if (!isLoggedIn) {
      console.log("Not logged in.");
      setShowLogin(true);
      return
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      console.log("No token found.");
      setShowLogin(true);
      return
    }

    console.log("Product object:", product);

    const response = await fetch("http://127.0.0.1:5000/cartItem/add", {
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
        fetchCartItems(); // Call get cartItems to update the state
    } else {
        console.error("Failed to add product to cart");
    }
  };

  const filteredProducts = products.filter(product => {
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
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 px-2 py-6 max-w-5xl mx-auto">
      {filteredProducts.length > 0 ? (
        filteredProducts.map((product, index) => {
          const isAdded = isInCart(product.productID);
          if (isAdded) {console.log("hi")}
          return (
            <div key={index} className="border border-gray-300 rounded-md p-3 bg-white shadow-md flex flex-col items-center text-sm">
              <h3 className="text-base font-medium">{product.name}</h3>
              <p className="text-gray-500">{product.description}</p>
              <p className="text-gray-500">${product.price}</p>
              <img
                src={`data:image/jpeg;base64,${product.image}`}
                alt={product.name}
                className="w-full aspect-1 object-cover rounded-md mt-1"
              />
              <button
                className={`mt-3 px-3 py-1.5 text-sm font-medium rounded-full transition shadow
                  ${isAdded ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}
                `}
                disabled={isAdded}
                onClick={() => handleAddToCart(product)}
              >
                {isAdded ? 'Added to Cart' : 'Add to Cart'}
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
