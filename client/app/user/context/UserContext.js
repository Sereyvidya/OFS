import { createContext, useContext, useState, useRef, useEffect } from "react";
import { getAllItemsFromCart } from "../api/CartItemRoutes";
import { getAllProducts } from "../api/ProductRoutes";
import { getUser } from "../api/UserRoutes";
import { loadStripe } from "@stripe/stripe-js";

const UserContext = createContext();

export function UserProvider({ children }) {
  // States for rendering components
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showDeliveryAddress, setShowDeliveryAddress] = useState(false);
  const [showOrderSummary, setShowOrderSummary] = useState(false);

  // States for filter products
  const [searchQuery, setSearchQuery] = useState("");
  const categories = [
    "All",
    "Fruits",
    "Vegetables",
    "Meat",
    "Seafood",
    "Dairy",
    "Pantry",
    "Beverages",
    "Bakery",
    "Spices",
    "Vegetarian",
  ];
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Other states
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [products, setProducts] = useState([]);
  const [profile, setProfile] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const dropdownRef = useRef(null);
  const API_URL = "http://localhost:5000";
  const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const STRIPE_PROMISE = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  );

  const fetchProfile = async () => {
    const { ok, data } = await getUser(API_URL);
    if (ok) {
      setProfile(data);
    } else {
      console.error("Failed to fetch profile.");
      // toast?
    }
  };

  const fetchCart = async () => {
    if (isLoggedIn) {
      const { ok, data } = await getAllItemsFromCart(API_URL);
      if (ok) {
        setCartItems(data);
      } else {
        console.error("Failed to get items from cart.");
      }
    }
  };

  const fetchAllProducts = async () => {
    const { ok, data } = await getAllProducts(API_URL);
    if (ok) {
      setProducts(data);
    } else {
      toast.error("Failed to fetch products.");
    }
  };

  const restoreSession = async () => {
    const token = sessionStorage.getItem("authToken");
    if (token) {
      const { ok, data } = await getUser(API_URL);
      if (ok) {
        setIsLoggedIn(true);
      } else {
        sessionStorage.removeItem("authToken");
      }
    }
  };

  // Runs when user clicks refresh
  useEffect(() => {
    restoreSession();
  }, []);

  // Runs as soon as user is logged in
  useEffect(() => {
    fetchAllProducts();
    if (isLoggedIn) {
      setTimeout(() => {
        fetchProfile();
        fetchCart();
      }, 100); // Allow time for JWT token to be set
    }
  }, [isLoggedIn]);

  const contextValue = {
    API_URL,
    MAPBOX_ACCESS_TOKEN,
    STRIPE_PROMISE,

    dropdownRef,

    searchQuery,
    setSearchQuery,
    categories,
    selectedCategory,
    setSelectedCategory,

    showLogin,
    setShowLogin,
    showSignup,
    setShowSignup,
    showProfile,
    setShowProfile,
    showDeleteConfirm,
    setShowDeleteConfirm,
    showCart,
    setShowCart,
    showDeliveryAddress,
    setShowDeliveryAddress,
    showOrderSummary,
    setShowOrderSummary,

    isLoggedIn,
    setIsLoggedIn,
    products,
    cartItems,
    setCartItems,
    profile,
    setProfile,
    address,
    setAddress,

    fetchCart,
    fetchAllProducts,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}

export function useUserContext() {
  return useContext(UserContext);
}
