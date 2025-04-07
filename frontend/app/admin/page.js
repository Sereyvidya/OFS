"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [products, setProducts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const isAdmin = localStorage.getItem("isAdmin"); // Store this during login

    if (!token || isAdmin !== "true") {
      alert("Access denied. Admins only.");
      router.push("/");
    }
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const deleteProduct = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/products/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        alert("Product deleted successfully!");
        fetchProducts();
      } else {
        alert("Failed to delete product.");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <button onClick={fetchProducts} className="bg-blue-500 text-white p-2 mb-4">Fetch Products</button>
      <ul>
        {products.map((product) => (
          <li key={product.id} className="border p-2 mb-2 flex justify-between">
            <span>{product.name}</span>
            <button onClick={() => deleteProduct(product.id)} className="bg-red-500 text-white p-1">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}