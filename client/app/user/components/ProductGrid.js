"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useUserContext } from "../context/UserContext";
import { fetchProducts } from "../api/ProductRoutes";
import { postItemToCart } from "../api/CartItemRoutes";
import ProductCard from "./ProductCard";

/**
 * Renders a grid that displays products.
 */
const ProductGrid = () => {
  const {
    API_URL,
    isLoggedIn,
    searchQuery,
    selectedCategory,
    setShowLogin,
    cartItems,
    setShowCart,
    setCartItems,
    fetchCart,
  } = useUserContext();

  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts(API_URL, setProducts);
    if (isLoggedIn) {
      fetchCart();
    }
  }, [isLoggedIn]);

  const filteredProducts = products
    .filter((product) => product.quantity !== -1) // "Deleted" products have quantity = -1
    .filter((product) => {
      const matchesSearchQuery = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesSelectedCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      return matchesSearchQuery && matchesSelectedCategory;
    });

  const isInCart = (id) => {
    return cartItems.some((item) => item.product.productID === id);
  };

  const handleClick = async (product) => {
    if (!isLoggedIn) {
      setShowLogin(true);
      return;
    }
    if (isInCart(product.productID)) {
      setShowCart(true);
      return;
    }
    const { ok } = await postItemToCart(API_URL, product);
    if (ok) {
      fetchCart();
    } else {
      toast.error("Failed to add item to cart.");
    }
  };

  if (!products.length) {
    return (
      <div className="flex h-screen items-center justify-center text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="mx-auto grid w-full grid-cols-3 gap-4 px-6 py-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {filteredProducts.length > 0 ? (
        filteredProducts.map((product) => (
          <ProductCard
            key={product.productID}
            product={product}
            isAdded={isInCart(product.productID)}
            handleClick={handleClick}
          />
        ))
      ) : (
        <p className="col-span-full text-center text-gray-500">
          No products found.
        </p>
      )}
    </div>
  );
};

export default ProductGrid;
