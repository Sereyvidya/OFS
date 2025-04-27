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
            <div key={index} className="rounded-md p-3 bg-[#f1f0e9] shadow flex flex-col items-center text-sm transition-transform duration-300 hover:scale-105 hover:shadow-lg">
              <div className="w-full flex justify-center bg-[#41644a] border-2 border-[#90b89b] py-2 rounded-md">
                <h3 className="font-semibold text-lg text-white">{product.name}</h3>
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

              {/* Edit, Low on stock and Out of stock buttons */}
              <div className="w-full mt-3 flex justify-center relative items-center">
              {product.quantity > 10 && (
                <button
                  className="px-3 py-1.5 text-sm font-medium rounded-full transition shadow whitespace-nowrap bg-[#e9762b] border-2 border-orange-300 text-[#f1f0e9] hover:bg-orange-400 hover:scale-105'"
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
                  className="animate-bounce px-3 py-1.5 text-sm font-medium rounded-full transition shadow border-2 border-red-300 bg-red-600 text-white hover:bg-red-400 hover:scale-105 transition-colors cursor-pointer whitespace-nowrap"
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
                  className="animate-bounce relative px-3 py-1.5 text-sm font-medium rounded-full bg-yellow-600 text-white border-2 border-yellow-300 hover:bg-yellow-400 hover:scale-105 transition transform whitespace-nowrap"
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