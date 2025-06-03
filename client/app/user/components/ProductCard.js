"use client";

import React from "react";

/**
 * Renders a single product card with image, name, description, price,
 * and an "Add to Cart" or "View Cart" button.
 *
 * Props:
 * - product: object with name, image, description, price, quantity
 * - isAdded: boolean, whether the item is already in the cart
 * - handleClick: function to handle adding the product to cart
 */
const ProductCard = ({ product, isAdded, handleClick }) => {
  return (
    <div className="flex flex-col items-center rounded-md bg-[#f1f0e9] p-3 text-sm shadow transition-transform duration-300 hover:scale-105 hover:shadow-lg">
      <div className="flex w-full justify-center rounded-md border-2 border-[#90b89b] bg-[#41644a] py-2">
        <h3 className="text-lg font-semibold text-[#f1f0e9] [text-shadow:_0_1px_3px_#73977b]">
          {product.name}
        </h3>
      </div>
      <img
        src={`data:image/jpeg;base64,${product.image}`}
        alt={product.name}
        className="aspect-1 mt-3 w-full rounded-md object-cover"
      />
      <div className="mt-3 flex flex-col items-center">
        <p className="text-[#41644a]">{product.description}</p>
        <p className="text-[#41644a]">${product.price}</p>
      </div>
      <button
        className={`mt-3 rounded-full px-3 py-1.5 text-sm font-medium whitespace-nowrap shadow transition ${
          product.quantity === 0
            ? "cursor-not-allowed border-2 border-red-200 bg-red-400 text-[#f1f0e9]"
            : isAdded
              ? "border-2 border-green-300 bg-green-600 text-white hover:scale-105 hover:bg-green-400"
              : "border-2 border-orange-300 bg-[#e9762b] text-[#f1f0e9] hover:scale-105 hover:bg-orange-400"
        } `}
        onClick={() => {
          if (product.quantity === 0) return;
          handleClick(product);
        }}
        disabled={product.quantity === 0}
      >
        {product.quantity === 0
          ? "Out of Stock"
          : isAdded
            ? "View Cart"
            : "Add to Cart"}
      </button>
    </div>
  );
};

export default ProductCard;
