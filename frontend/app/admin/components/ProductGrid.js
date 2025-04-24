"use client";

import React, { useEffect, useState } from "react";

const ProductGrid = ({ searchQuery, category, setEditingProduct, setShowAddProduct, rerenderProductGrid }) => {
  const [products, setProducts] = useState([]);

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
  }, [rerenderProductGrid]);

  const filteredProducts = products
    .filter(product => product.quantity !== -1) // "Deleted" products have quantity = -1
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = category === "All" || product.category === category;
      return matchesSearch && matchesCategory;
  });

  if (!products.length) {
    return <div className="flex items-center justify-center h-screen text-xl">Loading...</div>;
  }


  return (
    <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 px-6 py-6 w-full mx-auto">
      {filteredProducts.length > 0 ? (
        filteredProducts.map((product, index) => {
          return (
            <div key={index} className="border border-gray-300 rounded-md p-3 bg-gray-200 shadow flex flex-col items-center text-sm relative">
              <div className="w-full flex justify-center bg-sky-950 py-2 rounded-md shadow">
                <h3 className="font-semibold text-lg text-white">{product.name}</h3>
              </div>
              <img
                src={`data:image/jpeg;base64,${product.image}`}
                alt={product.name}
                className="w-full aspect-1 object-cover rounded-md mt-3"
              />
              <div className="flex flex-col items-center mt-3">
                <p className="text-gray-500">{product.description}</p>
                <p className="text-gray-500">${product.price}</p>
              </div>

              {/* Edit, Low on stock and Out of stock buttons */}
              <div className="w-full mt-3 flex justify-center relative items-center">
              {product.quantity > 10 && (
                <button
                  className="px-3 py-1.5 text-sm font-medium rounded-full transition shadow border border-blue-300 bg-blue-600 text-white hover:bg-blue-400 hover:scale-105 transition-colors cursor-pointer whitespace-nowrap"
                  onClick={() => {
                    setEditingProduct(product);
                    setShowAddProduct(true);
                  }}
                >
                  Edit
                </button>
              )}
            
              {product.quantity === 0 && (
                <button
                  className="px-3 py-1.5 text-sm font-medium rounded-full transition shadow border border-red-300 bg-red-600 text-white hover:bg-red-400 hover:scale-105 transition-colors cursor-pointer whitespace-nowrap"
                  onClick={() => {
                    setEditingProduct(product);
                    setShowAddProduct(true);
                  }}
                >
                  Out of stock
                </button>
              )}
              
              {product.quantity > 0 && product.quantity <= 10 && (
                <button
                  className="px-3 py-1.5 text-sm font-medium rounded-full transition shadow border border-yellow-300 bg-yellow-600 text-white hover:bg-yellow-400 hover:scale-105 transition-colors cursor-pointer whitespace-nowrap"
                  onClick={() => {
                    setEditingProduct(product);
                    setShowAddProduct(true);
                  }}
                >
                  Low on stock
                </button>
              )}
              </div>
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