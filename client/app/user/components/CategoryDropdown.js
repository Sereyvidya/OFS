"use client";

import React, { useState, useEffect } from "react";
import { useUserContext } from "../context/UserContext";
import { FaFilter } from "react-icons/fa";

/**
 * Renders a dropdown menu for filtering products by their category.
 */
const CategoryDropdown = () => {
  const { dropdownRef, categories, selectedCategory, setSelectedCategory } =
    useUserContext();
  const [openDropdown, setOpenDropdown] = useState(false);

  // Removes dropdown menu if mouse clicks outside of the menu
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(false);
      }
    }
    if (openDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdown]);

  return (
    <div
      ref={dropdownRef}
      //className="relative inline-block w-37 text-left"
      className="relative w-full text-left"
    >
      <div
        onClick={() => setOpenDropdown(!openDropdown)}
        //className="flex cursor-pointer items-center justify-between rounded-full border-2 border-[#90b89b] px-4 py-2 font-semibold whitespace-nowrap text-black shadow transition-colors hover:scale-105 hover:bg-[#0d4715]"
        className="flex w-full cursor-pointer items-center justify-between rounded-full border-2 border-[#90b89b] px-4 py-2 font-semibold text-[#f1f0e9] shadow transition-colors hover:scale-105 hover:bg-[#0d4715]"
      >
        <span className="text-[#f1f0e9]">{selectedCategory}</span>
        <FaFilter className="ml-2 text-[#f1f0e9]" />
      </div>

      {openDropdown && (
        <div
          //className="absolute z-10 mt-2 max-h-60 w-full overflow-y-auto rounded-md border-2 border-gray-300 bg-[#f1f0e9] shadow-lg focus:outline-gray-400"
          className="absolute z-10 mt-2 max-h-60 w-full overflow-y-auto rounded-md border-2 border-gray-300 bg-[#f1f0e9] shadow-lg focus:outline-gray-400"
        >
          {categories.map((cat) => (
            <div
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setOpenDropdown(false);
              }}
              className="cursor-pointer px-4 py-2 text-[#41644a] hover:bg-[#90b89b]"
            >
              {cat}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;
