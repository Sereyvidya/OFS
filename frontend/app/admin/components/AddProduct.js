"use client";

import React, { useState } from "react";

const AddProduct = ({ onClose, editingProduct, setEditingProduct, setRerenderProductGrid }) => {
  const [product, setProduct] = useState(
    editingProduct || {
      name: "",
      price: "",
      description: "",
      category: "",
      weight: "",
      quantity: "",
    }
  );
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

  const isEditing = editingProduct && editingProduct.productID;

  const endpoint = isEditing
    ? `http://127.0.0.1:5000/product/edit/${editingProduct.productID}`
    : "http://127.0.0.1:5000/product/add";

  const method = isEditing ? "PUT" : "POST";

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
      formData.append("weight", product.weight);
      formData.append("description", product.description);
      formData.append("category", product.category);
      formData.append("quantity", product.quantity);
      if (image) {
        formData.append("image", image); // Append the image file
        console.log(`Image filename: ${image.name}`);
        console.log(`Image content type: ${image.type}`);
      }

      const response = await fetch(endpoint, {
        method: method,
        body: formData, // Send FormData instead of JSON
      });

      if (response.ok) {
        if (isEditing) {
          alert("Product edited successfully!");
        } else {
          alert("Product added successfully!");
        }
        setProduct({ name: "", price: "", description: "", category: "", weight: "", quantity: "" });
        setImage(null); // Reset the image state
        setRerenderProductGrid(prev => prev + 1);
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

  const handleDelete = async () => {
    if (!isEditing) return;

    const response = await fetch(`http://127.0.0.1:5000/product/delete/${editingProduct.productID}`, {
      method: "DELETE",
    });

    if (response.ok) {
      alert("Product deleted successfully!");
      setRerenderProductGrid((prev) => prev + 1);
      onClose();
    } else {
      const errorData = await response.json();
      alert(errorData.error || "Failed to delete product.");
    }
  };

  return (
    <div className="flex flex-col w-150 h-auto m-auto bg-white p-4 rounded-lg">
      {/* Close button */}
      <div>
        <button
          className="bg-gray-300 px-2 rounded hover:bg-gray-400 hover:scale-103 shadow transition-colors"
          onClick={() => {
            onClose()
            setEditingProduct(null);
          }}
        >
          &times;
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div className="flex justify-center">
          <h1 className="font-display text-4xl font-bold">{isEditing ? "Edit Product": "Add Product"}</h1>
        </div>

        {errorMessage && (
          <p className="text-red-500 text-center">{errorMessage}</p>
        )}


        {/* Product Name & Price */}
        <div className="flex flex-col sm:flex-row justify-between gap-6">
          <div className="flex flex-col w-full">
            <p>Product Name</p>
            <input 
              type="text"
              placeholder="Apple, Beef, Cheese..."
              className="mt-2 w-full flex justify-between border border-gray-300 rounded-md p-2 hover:bg-gray-200 shadow transition-colors whitespace-nowrap focus:outline-gray-400"
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}/>
          </div>
          <div className="flex flex-col w-full">
            <p>Price ($)</p>
            <input 
              type="number"
              step="0.01"
              min="0.10"
              placeholder="$5.99, $10.00, $X.XX ..."
              className="mt-2 w-full flex justify-between border border-gray-300 rounded-md p-2 hover:bg-gray-200 shadow transition-colors whitespace-nowrap focus:outline-gray-400"
              value={product.price}
              onChange={(e) => setProduct({ ...product, price: e.target.value.replace(",", ".") })}/>
          </div>
        </div>

        {/* Weight & Quantity */}
        <div className="flex flex-col sm:flex-row justify-between gap-6">
          <div className="flex flex-col w-full">
            <p>Weight (lbs)</p>
            <input 
              type="number"
              step="0.001"
              min="0.125"
              placeholder="1.0, 3.375, X.XXX ..."
              className="mt-2 w-full flex justify-between border border-gray-300 rounded-md p-2 hover:bg-gray-200 shadow transition-colors whitespace-nowrap focus:outline-gray-400"
              value={product.weight}
              onChange={(e) => setProduct({ ...product, weight: e.target.value.replace(",", ".") })}/>
          </div>
          <div className="flex flex-col w-full">
            <p>Quantity (in stock)</p>
            <input 
              type="number"
              step="1"
              min="0"
              placeholder="50, 90, 126, XXX ..."
              className="mt-2 w-full flex justify-between border border-gray-300 rounded-md p-2 hover:bg-gray-200 shadow transition-colors whitespace-nowrap focus:outline-gray-400"
              value={product.quantity}
              onChange={(e) => setProduct({ ...product, quantity: e.target.value })}/>
          </div>
        </div>

        {/* Description & Category */}
        <div className="flex flex-col sm:flex-row justify-between gap-6">
          <div className="flex flex-col w-full">
            <p>Description</p>
            <input 
              type="text"
              placeholder="1 pack of ..."
              className="mt-2 w-full flex justify-between border border-gray-300 rounded-md p-2 hover:bg-gray-200 shadow transition-colors whitespace-nowrap focus:outline-gray-400"
              value={product.description}
              onChange={(e) => setProduct({ ...product, description: e.target.value})}/>
          </div>
          <div className="flex flex-col w-full">
            <p>Category</p>
            <select
              name="category"
              value={product.category}
              onChange={handleChange}
              required
              className="mt-2 w-full h-full p-2 rounded-md bg-white border border-gray-300 shadow transition-colors focus:outline-gray-400"
            >
              <option value="" disabled>
                Select a Category
              </option>
              {categories.map((category) => (
                <option 
                  key={category} 
                  value={category}
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                  >
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
              
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex flex-col w-full">
            <p>Image</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-2 w-full h-full p-2 rounded-md bg-white border border-gray-300 shadow transition-colors focus:outline-gray-400"
            />
          </div>
        </div>

        <button
          type="submit"
          className="font-semibold px-4 py-2 border border-blue-300 rounded-full bg-blue-600 text-white hover:bg-blue-400 hover:scale-101 shadow transition-colors cursor-pointer whitespace-nowrap"
        >
          {isEditing ? "Save Changes": "Add Product"}
        </button>
        {isEditing && (
            <button
              type="button"
              onClick={handleDelete}
              className="font-semibold px-4 py-2 border border-red-600 rounded-full bg-red-600 text-white hover:bg-red-400 hover:scale-101 shadow transition-colors cursor-pointer whitespace-nowrap"
            >
              Delete Product
            </button>
          )}
      </form>
    </div>
  );
};

export default AddProduct;