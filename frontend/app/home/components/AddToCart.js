"use client";

import React from 'react';

const AddToCart = ({ product, onClose, onAddToCart }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
      <div className="flex flex-col w-96 bg-white p-6 rounded-lg shadow-lg">
        {/* Product details */}
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-4">Add Product to Cart</h2>
          <div className="flex flex-col space-y-2">
            <p><strong>Item:</strong> {product.name}</p>
            <p><strong>Price Per Unit:</strong> ${product.price}</p>
            <p>{product.productDesc}</p>
            {/* <p><strong>Organic? </strong> {product.organic ? 'Yes' : 'No'}</p> */}
            <p><strong>In Stock:</strong> {product.quantity}</p>
            <img
              src={`data:image/jpeg;base64,${product.image}`}
              alt={product.name}
              className="product-image w-64 h-64 object-cover rounded-md"
            />
          </div>

          {/* Action buttons */}
          <div className="mt-4 flex justify-between w-full">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
              onClick={() => onAddToCart(product)}
            >
              Add to Cart
            </button>
            <button
              className="px-4 py-2 bg-gray-300 text-black rounded-full hover:bg-gray-400 transition-colors"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddToCart;

