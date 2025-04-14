"use client";

import React, { useState } from "react";

const AddProduct = ({ onClose }) => {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    weight: ""
  });
  const [image, setImage] = useState(null); // State for the image file
  const [errorMessage, setErrorMessage] = useState("");

  const categories = [
    "Fruits", "Vegetables", "Meat", "Seafood", "Dairy",
    "Pantry", "Beverages", "Bakery", "Spices", "Vegetarian",
  ];

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // Store the selected image file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!product.price) {
      setErrorMessage("Please enter the product price.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("price", product.price);
      formData.append("description", product.description);
      formData.append("category", product.category);
      formData.append("quantity", product.quantity);
      if (image) {
        formData.append("image", image); // Append the image file
        console.log(`Image filename: ${image.name}`);
        console.log(`Image content type: ${image.type}`);
      }

      const response = await fetch("http://127.0.0.1:5000/product/add", {
        method: "POST",
        body: formData, // Send FormData instead of JSON
      });

      if (response.ok) {
        alert("Product added successfully!");
        setProduct({ name: "", price: "", description: "", category: "" });
        setImage(null); // Reset the image state
        onClose();
      } else {
        const errorData = await response.json();
        //console.error("Error adding product:", errorData);
        setErrorMessage(errorData.error || "Failed to add product.");
        return;
      }
    } catch (error) {
      console.error("Error adding product:", error);
      setErrorMessage("An error occurred while adding the product.");
    }
  };

  return (
    <div className="flex flex-col w-150 h-auto m-auto bg-white p-4 rounded-lg">
      {/* Close button */}
      <div>
        <button
          className="text-lg font-bold text-gray-600 hover:text-black"
          onClick={onClose}
        >
          x
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <h1 className="text-2xl font-bold text-center">Add Product</h1>

        {errorMessage && (
          <p className="text-red-500 text-center">{errorMessage}</p>
        )}

        <input
          name="name"
          type="text"
          placeholder="Product Name"
          value={product.name}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          name="price"
          type="float"
          placeholder="Price"
          value={product.price}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          name="weight"
          type="float"
          placeholder="weight"
          value={product.weight}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={product.description}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        ></textarea>
        <select
          name="category"
          value={product.category}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        >
          <option value="" disabled>
            Select a Category
          </option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <input
          name="quantity"
          type="number"
          placeholder="Quantity"
          value={product.quantity || ""}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;