import { createContext, useContext, useState, useRef } from "react";
import { getAllItemsFromCart } from "../api/CartItemRoutes";

const UserContext = createContext();

export function UserProvider({ children }) {
  // States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const dropdownRef = useRef(null);

  const API_URL = "http://127.0.0.1:5000";

  const fetchCart = async () => {
    if (isLoggedIn) {
      const { ok, data } = await getAllItemsFromCart(API_URL);
      if (ok) {
        setCartItems(data);
      } else {
        toast.error("Failed to get items from cart.");
      }
    }
  };

  const contextValue = {
    API_URL,
    dropdownRef,

    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,

    showLogin,
    setShowLogin,
    showSignup,
    setShowSignup,
    showCart,
    setShowCart,

    isLoggedIn,
    setIsLoggedIn,
    cartItems,
    setCartItems,

    fetchCart,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}

export function useUserContext() {
  return useContext(UserContext);
}
