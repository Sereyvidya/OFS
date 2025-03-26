"use client"; // Ensure it's a client component

import { useState } from "react";

export default function AddProduct() {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
  });

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      if (response.ok) {
        alert("Product added successfully!");
        setProduct({ name: "", price: "", description: "", category: "" });
      } else {
        alert("Failed to add product");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add a Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" type="text" placeholder="Product Name" value={product.name} onChange={handleChange} required className="border p-2 w-full" />
        <input name="price" type="number" placeholder="Price" value={product.price} onChange={handleChange} required className="border p-2 w-full" />
        <textarea name="description" placeholder="Description" value={product.description} onChange={handleChange} required className="border p-2 w-full"></textarea>
        <input name="category" type="text" placeholder="Category" value={product.category} onChange={handleChange} required className="border p-2 w-full" />
        <button type="submit" className="bg-blue-500 text-white p-2 w-full">Add Product</button>
      </form>
    </div>
  );
}
