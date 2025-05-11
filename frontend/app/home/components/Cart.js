"use client";

import React, { useState, useEffect } from "react";

const Cart = ({ onClose, cartItems, setCartItems, setShowCart, setShowDeliveryAddress, API_URL }) => {
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  const fetchCartItems = async () => {
    const token = sessionStorage.getItem("authToken");

    if (!token) {
      console.log("No token found.");
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/cartItem/get`, {
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
    setErrors(prev => ({ ...prev, [cartItemID]: "" }));
    const token = sessionStorage.getItem("authToken");
  
    try {
      const res = await fetch(`${API_URL}/cartItem/update/${cartItemID}`,{
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });
      const data = await res.json();
  
      if (res.ok) {
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.cartItemID === cartItemID
              ? { ...item, quantity: newQuantity }
              : item
          )
        );
        console.log(data.message);
      } else {
        setErrors(prev => ({ ...prev, [cartItemID]: data.error }));
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, [cartItemID]: "Error updating qauntity." }));
    }
  };
  
  const handleRemoveFromCart = async (cartItemID) => {
    const token = sessionStorage.getItem("authToken");

    if (!token) {
      console.log("No token found.");
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/cartItem/remove/${cartItemID}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

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
    <div className="flex flex-col w-100 h-auto m-auto bg-[#f1f0e9] rounded-lg">
      <div className="relative bg-[#41644a] border-2 border-[#90b89b4d] text-[#f1f0e9] flex justify-between items-center h-20 px-4 py-4 rounded-t-lg">
        <h1 className="absolute left-1/2 top-4 transform -translate-x-1/2 font-display text-4xl font-bold text-[#f1f0e9] [text-shadow:_0_1px_3px_#73977b]">Your Cart</h1>
        <button
          className="absolute right-4 top-4 bg-[#f1f0e9] border border-[#90b89b] text-[#41644a] px-2 rounded hover:bg-[#73977b] hover:scale-103 shadow transition-colors"
          onClick={onClose}
        >
          &times;
        </button>
      </div>

      <div className="border-2 border-gray-400 rounded-b-lg">
        <div className="space-y-4 overflow-y-auto max-h-88 px-4 py-4">
          {cartItems.length === 0 ? 
            (<p className="text-center text-gray-500 italic">Your cart is empty.</p>) 
            : 
            (cartItems.map(
                  (item) => (
                    <li key={item.cartItemID} className="flex flex-col gap-2 p-3 bg-[#f1f0e9] rounded-lg shadow">
                      {errors[item.cartItemID] && (
                        <p className="text-red-500 text-sm">
                          {errors[item.cartItemID]}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4">
                        <img
                          src={`data:image/jpeg;base64,${item.product.image}`}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded shadow"
                        />
                        <div className="flex-1">
                          <h4 className="text-xl font-medium text-[#41644a]">{item.product.name}</h4>
                          <p className="text-sm text-[#41644a]">Price: ${item.product.price}</p>
                          <div className="flex items-center gap-2">
                            <span>
                              <p className="text-sm text-[#41644a]">Quantity: {item.quantity}</p>
                            </span>
                            <button
                              className="border border-[#73977b] bg-[#41644a] text-[#f1f0e9] px-2 rounded hover:bg-[#90b89b] hover:scale-103 shadow transition-colors"
                              onClick={() => updateQuantity(item.cartItemID, item.quantity - 1)}
                            >
                              −
                            </button>
                            <button
                              className="border border-[#73977b] bg-[#41644a] text-[#f1f0e9] px-2 rounded hover:bg-[#90b89b] hover:scale-103 shadow transition-colors"
                              onClick={() => updateQuantity(item.cartItemID, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveFromCart(item.cartItemID)}
                          className="border border-red-600 bg-red-600 text-white hover:bg-red-400 px-3 py-1 rounded-lg text-sm hover:scale-103 shadow transition-colors cursor-pointer whitespace-nowrap"
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  )
              )
            )
          }
        </div>

        <div className="flex flex-row justify-between px-4 pb-4">
          <p className="rounded-md shadow py-2 px-4 text-lg mt-4 text-lg font-medium text-[#0d4715]">
            Total: ${totalPrice.toFixed(2)}
          </p>
          <button 
            className="border border-green-300 bg-green-600 text-[#f1f0e9] hover:bg-green-400 hover:scale-103 shadow transition-colors cursor-pointer whitespace-nowrap py-2 px-4 rounded-lg shadow-md text-lg mt-4"
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
    </div>
  );
};

export default Cart;
