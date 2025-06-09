"use client";

import React, { useRef } from "react";
import { useAdminContext } from "../context/AdminContext";
import ProductCard from "./ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Renders scrollable products.
 */
const ProductGrid = () => {
  const { searchQuery, selectedCategory, categories, products } =
    useAdminContext();

  const scrollRefs = useRef({});

  const handleClick = async (product) => {
    // Open edit product form
  };

  if (!products.length) {
    return (
      <div className="flex h-screen items-center justify-center text-xl text-gray-500">
        Loading...
      </div>
    );
  }

  const categoriesToRender =
    selectedCategory === "All"
      ? categories.filter((cat) => cat !== "All")
      : [selectedCategory];

  const allMatchedProducts = categoriesToRender.flatMap((category) =>
    products.filter(
      (p) =>
        p.category === category &&
        p.name.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  );

  return (
    <div className="space-y-8 px-6 py-6">
      {allMatchedProducts.length === 0 ? (
        <p className="text-center text-lg text-gray-500">No products found.</p>
      ) : (
        categoriesToRender.map((category) => {
          const categoryProducts = allMatchedProducts.filter(
            (p) => p.category === category,
          );
          if (categoryProducts.length === 0) return null;

          return (
            <div key={category}>
              <h2 className="mb-2 text-xl font-semibold text-[#41644a]">
                {category}
              </h2>
              <div className="relative">
                {/* Left Arrow */}
                <button
                  onClick={() =>
                    scrollRefs.current[category]?.scrollBy({
                      left: -300,
                      behavior: "smooth",
                    })
                  }
                  className="absolute top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 transform items-center justify-center rounded-full bg-white/70 text-[#41644a] shadow-md backdrop-blur-sm transition-opacity duration-300 hover:bg-white md:flex"
                  aria-label="Scroll Left"
                >
                  <ChevronLeft size={20} />
                </button>

                {/* Scrollable Product Row */}
                <div
                  ref={(el) => (scrollRefs.current[category] = el)}
                  className="hide-scrollbar flex snap-x snap-mandatory overflow-x-auto scroll-smooth"
                >
                  {categoryProducts.map((product) => (
                    <div
                      key={product.productID}
                      className="card-fit flex-shrink-0 snap-start px-2 pb-2"
                    >
                      <ProductCard
                        product={product}
                        handleClick={handleClick}
                      />
                    </div>
                  ))}
                </div>

                {/* Right Arrow */}
                <button
                  onClick={() =>
                    scrollRefs.current[category]?.scrollBy({
                      left: 300,
                      behavior: "smooth",
                    })
                  }
                  className="absolute top-1/2 right-0 z-10 hidden h-8 w-8 -translate-y-1/2 transform items-center justify-center rounded-full bg-white/70 text-[#41644a] shadow-md backdrop-blur-sm transition-opacity duration-300 hover:bg-white md:flex"
                  aria-label="Scroll Right"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default ProductGrid;
