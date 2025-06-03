"use client";

import React from "react";

/**
 * Renders a single cart item card with image, name, price,
 * quantity, edit quantity buttons and a a remove item button.
 *
 * Props:
 * - item: object with a product that is in cart
 * - error: the item's error
 * - handleUpdateItemQuantity: function to handle updating a cart item's quantity
 * - handleRemoveItemFromCart: function to handle removing a cart item
 */

const CartItemCard = ({
  item,
  error,
  handleUpdateItemQuantity,
  handleRemoveItemFromCart,
}) => {
  return (
    <div
      key={item.cartItemID}
      className="flex flex-col gap-2 rounded-lg bg-[#f1f0e9] p-3 shadow"
    >
      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex items-center gap-4">
        <img
          src={`data:image/jpeg;base64,${item.product.image}`}
          alt={item.product.name}
          className="h-16 w-16 rounded object-cover shadow"
        />
        <div className="flex-1">
          <h4 className="text-xl font-medium text-[#41644a]">
            {item.product.name}
          </h4>
          <p className="text-sm text-[#41644a]">Price: ${item.product.price}</p>
          <div className="flex items-center gap-2">
            <span>
              <p className="text-sm text-[#41644a]">
                Quantity: {item.quantity}
              </p>
            </span>
            <button
              className="rounded border border-[#73977b] bg-[#41644a] px-2 text-[#f1f0e9] shadow transition-colors hover:scale-103 hover:bg-[#90b89b]"
              onClick={() =>
                handleUpdateItemQuantity(item.cartItemID, item.quantity - 1)
              }
            >
              −
            </button>
            <button
              className="rounded border border-[#73977b] bg-[#41644a] px-2 text-[#f1f0e9] shadow transition-colors hover:scale-103 hover:bg-[#90b89b]"
              onClick={() =>
                handleUpdateItemQuantity(item.cartItemID, item.quantity + 1)
              }
            >
              +
            </button>
          </div>
        </div>
        <button
          onClick={() => handleRemoveItemFromCart(item.cartItemID)}
          className="cursor-pointer rounded-lg border border-red-600 bg-red-600 px-3 py-1 text-sm whitespace-nowrap text-white shadow transition-colors hover:scale-103 hover:bg-red-400"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItemCard;
