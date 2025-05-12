"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";

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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Prevent multiple submits

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

    if (isSubmitting) return; // Prevent resubmission
    setIsSubmitting(true);

    if (!product.price) {
      setErrorMessage("Please enter the product price.");
      setIsSubmitting(false);
      return;
    }

    // Validate image type
    if (image) {
      const allowedTypes = [
        "image/jpeg",
        "image/png"
      ];
      if (!allowedTypes.includes(image.type)) {
        setErrorMessage("Only image files (jpg, png, gif, webp, bmp, svg, tiff, heic, heif) are allowed.");
        setIsSubmitting(false);
        return;
      }
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
          toast.success("Product edited successfully!");
        } else {
          toast.success("Product added successfully!");
        }
        setProduct({ name: "", price: "", description: "", category: "", weight: "", quantity: "" });
        setImage(null); // Reset the image state
        setRerenderProductGrid(prev => prev + 1);
        onClose();
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || "Failed to add product.");
        setIsSubmitting(false);
        return;
      }
    } catch (error) {
      console.error("Error adding product:", error);
      setErrorMessage("An error occurred while adding the product.");
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!isEditing) setShowDeleteConfirm(false);

    const response = await fetch(`http://127.0.0.1:5000/product/delete/${editingProduct.productID}`, {
      method: "DELETE",
    });

    if (response.ok) {
      toast.success("Product deleted successfully!");
      setRerenderProductGrid((prev) => prev + 1);
      setShowDeleteConfirm(false)
      onClose();
    } else {
      const errorData = await response.json();
      toast.error(errorData.error || "Failed to delete product.");
    }
  };

  return (
    <div className="flex flex-col w-150 h-auto m-auto bg-[#f1f0e9] rounded-lg">
      {/* Close button */}
      <div className="relative bg-[#41644a] border-2 border-[#90b89b4d] text-white flex justify-between items-center h-20 px-4 py-4 rounded-t-lg">
        <h1 className="absolute left-1/2 top-4 transform -translate-x-1/2 font-display text-4xl font-bold text-[#f1f0e9] [text-shadow:_0_1px_3px_#73977b]">
          {isEditing ? "Edit Product": "Add Product"}
        </h1>
        <button
          className="absolute right-4 top-4 bg-[#f1f0e9] border border-[#90b89b] text-[#41644a] px-2 rounded hover:bg-[#73977b] hover:scale-103 shadow transition-colors"
          onClick={() => {
            onClose()
            setEditingProduct(null);
          }}
        >
          &times;
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4 p-4 border-2 border-gray-400 rounded-b-lg">

        {errorMessage && (
          <p className="text-red-500 text-center">{errorMessage}</p>
        )}

        {/* Product Name & Price */}
        <div className="flex flex-col sm:flex-row justify-between gap-6">
          <div className="flex flex-col w-full">
            <p className="text-[#0d4715]">Product Name</p>
            <input 
              type="text"
              placeholder="Apple, Beef, Cheese..."
              className="mt-2 w-full border border-gray-300 text-[#0d4715] placeholder-[#73977b] hover:bg-[#90b89b] rounded-md p-2 shadow transition-colors whitespace-nowrap focus:outline-[#0d4715]"
              required
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}/>
          </div>
          <div className="flex flex-col w-full">
            <p className="text-[#0d4715]">Price ($)</p>
            <input 
              type="number"
              step="0.01"
              min="0.10"
              placeholder="$5.99, $10.00, $X.XX ..."
              className="mt-2 w-full border border-gray-300 text-[#0d4715] placeholder-[#73977b] hover:bg-[#90b89b] rounded-md p-2 shadow transition-colors whitespace-nowrap focus:outline-[#0d4715]"
              required
              value={product.price}
              onChange={(e) => setProduct({ ...product, price: e.target.value.replace(",", ".") })}/>
          </div>
        </div>

        {/* Weight & Quantity */}
        <div className="flex flex-col sm:flex-row justify-between gap-6">
          <div className="flex flex-col w-full">
            <p className="text-[#0d4715]">Weight (lbs)</p>
            <input 
              type="number"
              step="0.001"
              min="0.125"
              placeholder="1.0, 3.375, X.XXX ..."
              className="mt-2 w-full border border-gray-300 text-[#0d4715] placeholder-[#73977b] hover:bg-[#90b89b] rounded-md p-2 shadow transition-colors whitespace-nowrap focus:outline-[#0d4715]"
              required
              value={product.weight}
              onChange={(e) => setProduct({ ...product, weight: e.target.value.replace(",", ".") })}/>
          </div>
          <div className="flex flex-col w-full">
            <p className="text-[#0d4715]">Quantity (in stock)</p>
            <input 
              type="number"
              step="1"
              min="0"
              placeholder="50, 90, 126, XXX ..."
              className="mt-2 w-full border border-gray-300 text-[#0d4715] placeholder-[#73977b] hover:bg-[#90b89b] rounded-md p-2 shadow transition-colors whitespace-nowrap focus:outline-[#0d4715]"
              required
              value={product.quantity}
              onChange={(e) => setProduct({ ...product, quantity: e.target.value })}/>
          </div>
        </div>

        {/* Description & Category */}
        <div className="flex flex-col sm:flex-row justify-between gap-6">
          <div className="flex flex-col w-full">
            <p className="text-[#0d4715]">Description</p>
            <input 
              type="text"
              placeholder="1 pack of ..."
              className="mt-2 w-full border border-gray-300 text-[#0d4715] placeholder-[#73977b] hover:bg-[#90b89b] rounded-md p-2 shadow transition-colors whitespace-nowrap focus:outline-[#0d4715]"
              required
              value={product.description}
              onChange={(e) => setProduct({ ...product, description: e.target.value})}/>
          </div>
          <div className="flex flex-col w-full relative">
            <div 
              className="text-[#0d4715] cursor-pointer"
              onClick={() => setIsOpen(o => !o)}
            >
              <p>Category</p>
              <div
                className={`
                  mt-2 w-full border border-gray-300 rounded-md p-2 shadow transition-colors whitespace-nowrap
                  ${!product.category 
                    ? "text-gray-400 italic hover:bg-[#90b89b]"   
                    : "text-[#0d4715] hover:bg-[#90b89b]"
                  }
                `}
              >
                {product.category || "Select a category"}
              </div>
            </div>

            {isOpen && (
              <div className="absolute z-10 mt-22 w-full max-h-60 overflow-y-auto rounded-md bg-[#f1f0e9] border-2 border-gray-300 shadow-lg">
                {categories.map(cat => (
                  <div
                    key={cat}
                    onClick={() => {
                      setProduct(prev => ({ ...prev, category: cat }));
                      setIsOpen(false);
                    }}
                    className="px-4 py-2 text-[#41644a] hover:bg-[#90b89b] cursor-pointer"
                  >
                    {cat}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
              
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex flex-col w-full">
            <p className="text-[#0d4715]">Image</p>
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
          className={`mt-2 font-semibold px-4 py-2 bg-[#e9762b] border-2 border-orange-300 text-[#f1f0e9] hover:bg-orange-400 rounded-full hover:scale-102 shadow transition-colors cursor-pointer whitespace-nowrap ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isSubmitting}
        >
          {isEditing ? "Save Changes": isSubmitting ? "Submitting..." : "Add Product"}
        </button>
        {isEditing && (
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="mt-2 font-semibold px-4 py-2 bg-red-600 border-2 border-red-300 text-[#f1f0e9] hover:bg-red-400 rounded-full hover:scale-102 shadow transition-colors cursor-pointer whitespace-nowrap"
          >
            Delete Product
          </button>
        )}
      </form>

      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm backdrop-brightness-80">
          <div className="flex flex-col w-100 h-auto m-auto bg-[#f1f0e9] rounded-lg shadow">
            <div className="relative bg-[#41644a] border-2 border-[#90b89b4d] text-white flex justify-between items-center h-20 px-4 py-4 rounded-t-lg">
              <h1 className="absolute left-1/2 top-4 transform -translate-x-1/2 font-display text-3xl font-bold text-[#f1f0e9] [text-shadow:_0_1px_3px_#73977b] whitespace-nowrap">Confirm Deletion</h1>
            </div>

            <div className="flex flex-col border-2 border-gray-400 rounded-b-lg pt-4 pb-6 gap-4">
              <p className="text-center text-[#0d4715]">Are you sure you want to delete <strong>{product.name}</strong>?</p>
              <div className="flex justify-around">
                <button
                  onClick={handleDelete}
                  className="bg-red-600 border-2 border-red-300 text-[#f1f0e9] hover:bg-red-400 hover:scale-103 px-6 py-2 rounded-lg shadow transition-colors"
                >
                  Delete Product
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="bg-gray-600 border-2 border-gray-300 text-[#f1f0e9] hover:bg-gray-400 hover:scale-103 px-6 py-2 rounded-lg shadow transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProduct;