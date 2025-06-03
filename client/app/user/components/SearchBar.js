"use client";

import React from "react";
import { useUserContext } from "../context/UserContext";
import { FaSearch } from "react-icons/fa";

/**
 * Renders a search bar for looking up products.
 */
const SearchBar = () => {
  const { searchQuery, setSearchQuery } = useUserContext();

  return (
    <div className="relative w-full max-w-150 min-w-40 flex-1">
      <input
        type="text"
        placeholder="Search products"
        className="w-full rounded-full border-2 border-[#90b89b] px-4 py-2 pr-10 whitespace-nowrap text-[#f1f0e9] shadow transition-colors hover:scale-102 hover:bg-[#0d4715] focus:ring-2 focus:ring-[#0d4715] focus:outline-none"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <FaSearch className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-[#f1f0e9]" />
    </div>
  );
};

export default SearchBar;
