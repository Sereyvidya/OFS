import { createContext, useContext, useState, useRef, useEffect } from "react";
import { refresh } from "../../api/AuthRoutes";
import { getAllProducts } from "../../api/ProductRoutes";
import { getUser } from "../../api/UserRoutes";

const AdminContext = createContext();

export function AdminProvider({ children }) {
  // States for rendering components
  const [showProfile, setShowProfile] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeliveryDashboard, setShowDeliveryDashboard] = useState(false);

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [profile, setProfile] = useState(null);
  const [awaitingOrders, setAwaitingOrders] = useState([]);
  const dropdownRef = useRef(null);
  const API_URL = "http://localhost:5000";
  const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  const fetchProfile = async () => {
    const { ok, data } = await getUser(API_URL);
    if (ok) {
      setProfile(data);
    } else {
      console.error("Failed to fetch profile.");
    }
  };

  const fetchAllProducts = async () => {
    const { ok, data } = await getAllProducts(API_URL);
    if (ok) {
      setProducts(data);
    } else {
      console.error("Failed to fetch products.");
    }
  };

  const restoreSession = async () => {
    try {
      const { ok, data } = await getUser(API_URL);
      if (ok && data.isAdmin) {
        setIsLoggedIn(true);
      } else {
        console.warn("Refresh token failed or expired.");
        setIsLoggedIn(false);
        setProfile(null);
      }
    } catch (error) {
      console.error("Failed to restore session:", error);
      setIsLoggedIn(false);
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
      fetchProfile();
    }
  }, [isLoggedIn]);

  // Runs every 5 minutes to refresh the tokens
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const { ok, data } = await refresh(API_URL);
        if (ok && data.isAdmin) {
          setIsLoggedIn(true);
        } else {
          console.warn("Refresh token failed or expired.");
          setIsLoggedIn(false);
          setProfile(null);
        }
      } catch (err) {
        console.error("Error refreshing token:", err);
      }
    }, 30 * 1000); // every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const contextValue = {
    API_URL,
    MAPBOX_ACCESS_TOKEN,
    dropdownRef,

    searchQuery,
    setSearchQuery,
    categories,
    selectedCategory,
    setSelectedCategory,

    showProfile,
    setShowProfile,
    showAddForm,
    setShowAddForm,
    showEditForm,
    setShowEditForm,
    showDeliveryDashboard,
    setShowDeliveryDashboard,

    isLoggedIn,
    setIsLoggedIn,
    editingProduct,
    setEditingProduct,
    products,
    profile,
    setProfile,
    awaitingOrders,
    setAwaitingOrders,

    fetchAllProducts,
  };

  return (
    <AdminContext.Provider value={contextValue}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdminContext() {
  return useContext(AdminContext);
}
