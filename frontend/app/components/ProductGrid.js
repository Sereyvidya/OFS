"use client";

import React, { useEffect, useState } from "react";
import AddToCart from "./AddToCart";

const ProductGrid = ({ isLoggedIn, setShowLogin }) => {
  const [products, setProducts] = useState([]);
  const [showAddToCart, setShowAddToCart] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/products");
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
  }, []);

  const handleButtonClick = (product) => {
    if (isLoggedIn) {
      setSelectedProduct(product);
      setShowAddToCart(true);
    } else {
      setShowLogin(true);
    }
  };

  const closeAdd = () => {
    setShowAddToCart(false);
  };

  if (!products.length) {
    return <div className="flex items-center justify-center h-screen text-xl">Loading...</div>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 px-2 py-6 max-w-5xl mx-auto">
      {products.map((product, index) => (
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
            className="mt-3 px-3 py-1.5 text-sm bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition"
            onClick={() => handleButtonClick(product)}
          >
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
