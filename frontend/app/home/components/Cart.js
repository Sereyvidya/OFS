"use client";

import React, { useState, useEffect } from "react";

const Cart = ({ onClose, cartItems, setCartItems, setShowCart, setShowDeliveryAddress, apiUrl }) => {
  const [loading, setLoading] = useState(true);

  const fetchCartItems = async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.log("No token found.");
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch(`${apiUrl}/cartItem/get`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCartItems(data);
      } else {
        console.error("Failed to fetch cart items");
      }
    } catch (error) {
      console.error("Error fetching cart items", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const updateQuantity = async (cartItemID, newQuantity) => {
    if (newQuantity < 1) return; // disallow less than 1
  
    const token = localStorage.getItem("authToken");
  
    try {
      const response = await fetch(`${apiUrl}/cartItem/update/${cartItemID}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quantity: newQuantity }),
        }
      );
  
      if (response.ok) {
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.cartItemID === cartItemID
              ? { ...item, quantity: newQuantity }
              : item
          )
        );
      } else {
        console.error("Failed to update quantity");
      }
    } catch (error) {
      console.error("Error updating quantity", error);
    }
  };
  

  const handleRemoveFromCart = async (cartItemID) => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.log("No token found.");
      return;
    }

    console.log(token)

    try {
      const response = await fetch(`${apiUrl}/cartItem/remove/${cartItemID}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setCartItems(cartItems.filter((item) => item.cartItemID !== cartItemID));
        fetchCartItems();
      } else {
        console.error("Failed to remove item from cart");
      }
    } catch (error) {
      console.error("Error removing item from cart", error);
    }
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  return (
    <div className="flex flex-col w-100 h-auto m-auto bg-white p-4 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-sky-950 [text-shadow:_0_1px_0_rgb(107_114_128_/_30%)]">
          Your Cart
        </h2>
        <button
          className="bg-gray-300 px-2 rounded hover:bg-gray-400 hover:scale-103 shadow transition-colors"
          onClick={onClose}
        >
          &times;
        </button>
      </div>
      <div className="space-y-4 overflow-y-auto max-h-80">
        {cartItems.length === 0 ? 
          (<p className="text-center text-gray-500 italic">Your cart is empty.</p>) 
          : 
          (cartItems.map(
                (item) => (
                  <li key={item.cartItemID} className="flex items-center gap-4 p-3 bg-gray-100 rounded-lg shadow">
                    <img
                      src={`data:image/jpeg;base64,${item.product.image}`}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded shadow"
                    />
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-gray-700 [text-shadow:_0_1px_0_rgb(107_114_128_/_30%)]">{item.product.name}</h4>
                      <p className="text-sm text-gray-600 [text-shadow:_0_1px_0_rgb(107_114_128_/_30%)]">Price: ${item.product.price}</p>
                      <div className="flex items-center gap-2">
                        <span>
                          <p className="text-sm text-gray-600 [text-shadow:_0_1px_0_rgb(107_114_128_/_30%)]">Quantity: {item.quantity}</p>
                        </span>
                        <button
                          className="bg-gray-300 px-2 rounded hover:bg-gray-400 hover:scale-103 shadow transition-colors"
                          onClick={() => updateQuantity(item.cartItemID, item.quantity - 1)}
                        >
                          −
                        </button>
                        <button
                          className="bg-gray-300 px-2 rounded hover:bg-gray-400 hover:scale-103 shadow transition-colors"
                          onClick={() => updateQuantity(item.cartItemID, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveFromCart(item.cartItemID)}
                      className="border border-red-300 bg-red-600 text-white hover:bg-red-400 px-3 py-1 rounded-lg text-sm hover:scale-103 shadow transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Remove
                    </button>
                  </li>
                )
            )
          )
        }
      </div>

      <div className="flex flex-row justify-between">
        <p className="bg-gray-100 rounded-md shadow py-2 px-4 text-lg mt-4 text-lg font-medium text-gray-700 [text-shadow:_0_1px_0_rgb(107_114_128_/_30%)]">
          Total: ${totalPrice.toFixed(2)}
        </p>
        <button 
          className="border border-green-300 bg-green-600 text-white hover:bg-green-400 hover:scale-103 shadow transition-colors cursor-pointer whitespace-nowrap py-2 px-4 rounded-lg shadow-md text-lg mt-4"
          disabled={cartItems.length === 0}
          onClick={() => {
            setShowCart(false)
            setShowDeliveryAddress(true)
            onClose()
          }}>
          Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
