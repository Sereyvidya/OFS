"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAdminContext } from "../context/AdminContext";
import {
  postProduct,
  putProduct,
  deleteProduct,
} from "../../api/ProductRoutes";

/**
 * Renders a form to add a new product or edit a current one.
 */
const AddOrEditForm = () => {
  const {
    API_URL,
    dropdownRef,
    setShowAddForm,
    showEditForm,
    setShowEditForm,
    editingProduct,
    setEditingProduct,
    categories,
    fetchAllProducts,
  } = useAdminContext();

  const [formData, setFormData] = useState(
    editingProduct || {
      name: "",
      description: "",
      price: "",
      quantity: "",
      category: "",
      weight: "",
      image: "",
    },
  );

  const [errorMessage, setErrorMessage] = useState("");
  const [openDropdown, setOpenDropdown] = useState(false);
  const possibleCategories = categories.filter((cat) => cat != "All");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // For disabling the submit button while waiting for a response
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set a cooldown on the submit button after response is successful
  const [cooldown, setCooldown] = useState(false);

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

  const handleAddSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting || cooldown) return;

    setIsSubmitting(true);

    const { ok, data } = await postProduct(API_URL, formData);

    if (ok) {
      toast.success(`Product added successfully!`, {
        onClose: () => {
          setShowAddForm(false);
          fetchAllProducts();
        },
      });
      setCooldown(true);
      setTimeout(() => setCooldown(false), 5000);
    } else {
      setErrorMessage(
        data?.error || "Failed to add product. Please try again.",
      );
    }

    setIsSubmitting(false);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting || cooldown) return;

    setIsSubmitting(true);

    const { ok, data } = await putProduct(
      API_URL,
      editingProduct.productID,
      formData,
    );

    if (ok) {
      toast.success(`Product updated successfully!`, {
        onClose: () => {
          setShowEditForm(false);
          setShowDeleteConfirm(false);
          fetchAllProducts();
        },
      });
      setCooldown(true);
      setTimeout(() => setCooldown(false), 5000);
    } else {
      setErrorMessage(
        data?.error || "Failed to update product. Please try again.",
      );
    }

    setIsSubmitting(false);
  };

  const handleDeleteSubmit = async (e) => {
    if (isSubmitting || cooldown) return;

    setIsSubmitting(true);

    const { ok, data } = await deleteProduct(API_URL, editingProduct.productID);

    if (ok) {
      toast.success(`Product deleted successfully!`, {
        onClose: () => {
          setShowEditForm(false);
          setShowDeleteConfirm(false);
          fetchAllProducts();
        },
      });
      setCooldown(true);
      setTimeout(() => setCooldown(false), 5000);
    } else {
      setErrorMessage(
        data?.error || "Failed to delete product. Please try again.",
      );
    }

    setIsSubmitting(false);
  };

  return (
    <div className="m-auto flex h-auto w-150 flex-col rounded-lg bg-[#f1f0e9]">
      <div className="relative flex h-20 items-center justify-between rounded-t-lg border-2 border-[#90b89b4d] bg-[#41644a] px-4 py-4 text-[#f1f0e9]">
        <h1 className="font-display absolute top-4 left-1/2 -translate-x-1/2 transform text-4xl font-bold text-[#f1f0e9] [text-shadow:_0_1px_3px_#73977b]">
          {showEditForm ? "Edit Product" : "Add Product"}
        </h1>
        <button
          className="absolute top-4 right-4 rounded border border-[#90b89b] bg-[#f1f0e9] px-2 text-[#41644a] shadow transition-colors hover:scale-103 hover:bg-[#73977b]"
          onClick={() => {
            setShowAddForm(false);
            setShowEditForm(false);
            setShowDeleteConfirm(false);
            setEditingProduct(null);
          }}
        >
          &times;
        </button>
      </div>

      <div className="flex flex-row justify-between rounded-b-lg border-2 border-gray-400">
        <form
          onSubmit={showEditForm ? handleEditSubmit : handleAddSubmit}
          className="flex w-full flex-col space-y-4 p-4"
        >
          {errorMessage && (
            <p className="text-center text-red-500">{errorMessage}</p>
          )}

          <div className="flex flex-row">
            {/* Image column */}
            <div className="flex w-37 flex-col space-y-4 pr-4">
              <div className="flex flex-col">
                <p className="text-[#0d4715]">Preview</p>
                <div className="relative mt-2 w-full overflow-hidden rounded-md pt-[100%]">
                  <img
                    src={formData.image || "/favicon.png"}
                    alt="Product"
                    className="absolute inset-0 h-full w-full object-cover object-center"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <p className="text-[#0d4715]">Upload Image</p>
                <input
                  type="file"
                  accept="image/*"
                  required={!showEditForm}
                  className="mt-2 w-full rounded-md border-2 border-orange-300 bg-[#e9762b] p-2 placeholder-[#73977b] shadow transition-colors hover:bg-orange-400 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setFormData({ ...formData, image: reader.result });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </div>
            </div>

            {/* Inputs */}
            <div className="flex-1 flex-col space-y-4">
              {/* Name & Price */}
              <div className="flex flex-row justify-between gap-4">
                <div className="flex w-2/3 flex-col sm:w-3/4">
                  <p className="text-[#0d4715]">Name</p>
                  <input
                    type="text"
                    placeholder="Carrot"
                    className="[#f1f0e9]space-nowrap mt-2 w-full rounded-md border border-gray-300 p-2 text-[#0d4715] placeholder-[#73977b] shadow transition-colors hover:bg-[#90b89b] focus:outline-[#0d4715]"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="flex w-1/3 flex-col sm:w-1/4">
                  <p className="text-[#0d4715]">Price ($)</p>
                  <input
                    type="number"
                    step="0.01"
                    min="0.10"
                    max="999.99"
                    placeholder="2.99"
                    className="[#f1f0e9]space-nowrap mt-2 w-full rounded-md border border-gray-300 p-2 text-[#0d4715] placeholder-[#73977b] shadow transition-colors hover:bg-[#90b89b] focus:outline-[#0d4715]"
                    required
                    value={formData.price}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      if (value > 999.99 || value < 0.1) {
                        setErrorMessage(
                          "Price must be between $0.10 and $999.99.",
                        );
                      } else {
                        setErrorMessage("");
                        setFormData({ ...formData, price: value });
                      }
                    }}
                  />
                </div>
              </div>

              {/* Description & weight */}
              <div className="flex flex-row justify-between gap-4">
                <div className="flex w-2/3 flex-col sm:w-3/4">
                  <p className="text-[#0d4715]">Description</p>
                  <input
                    type="text"
                    placeholder="per 2 lb bag"
                    className="[#f1f0e9]space-nowrap mt-2 w-full rounded-md border border-gray-300 p-2 text-[#0d4715] placeholder-[#73977b] shadow transition-colors hover:bg-[#90b89b] focus:outline-[#0d4715]"
                    required
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>
                <div className="flex w-1/3 flex-col sm:w-1/4">
                  <p className="text-[#0d4715]">Weight (lbs)</p>
                  <input
                    type="number"
                    step="0.125"
                    min="0.125"
                    max="99.875"
                    placeholder="2"
                    className="[#f1f0e9]space-nowrap mt-2 w-full rounded-md border border-gray-300 p-2 text-[#0d4715] placeholder-[#73977b] shadow transition-colors hover:bg-[#90b89b] focus:outline-[#0d4715]"
                    required
                    value={formData.weight}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      if (value > 99.875 || value < 0.125) {
                        setErrorMessage(
                          "Weight must be between 0.125 lbs (2 oz) and 99.875 lbs.",
                        );
                      } else {
                        setErrorMessage("");
                        setFormData({ ...formData, weight: value });
                      }
                    }}
                  />
                </div>
              </div>

              {/* Category & Quantity */}
              <div
                ref={dropdownRef}
                className="flex flex-row justify-between gap-4"
              >
                <div
                  ref={dropdownRef}
                  className="relative flex w-2/3 flex-col sm:w-3/4"
                >
                  <div
                    className="cursor-pointer text-[#0d4715]"
                    onClick={() => setOpenDropdown((o) => !o)}
                  >
                    <p>Category</p>
                    <div
                      className={`[#f1f0e9]space-nowrap mt-2 w-full rounded-md border border-gray-300 p-2 shadow transition-colors ${
                        !formData.category
                          ? "text-[#73977b] hover:bg-[#90b89b]"
                          : "text-[#0d4715] hover:bg-[#90b89b]"
                      } `}
                    >
                      {formData.category || "Scroll to select a category"}
                    </div>
                  </div>

                  {openDropdown && (
                    <div className="absolute z-10 mt-22 max-h-40 w-full overflow-y-auto rounded-md border-2 border-gray-300 bg-[#f1f0e9] shadow-lg">
                      {possibleCategories.map((cat) => (
                        <div
                          key={cat}
                          onClick={() => {
                            setFormData({ ...formData, category: cat });
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
                <div className="flex w-1/3 flex-col sm:w-1/4">
                  <p className="text-[#0d4715]">Quantity</p>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    max="999"
                    placeholder="50"
                    className="[#f1f0e9]space-nowrap mt-2 w-full rounded-md border border-gray-300 p-2 text-[#0d4715] placeholder-[#73977b] shadow transition-colors hover:bg-[#90b89b] focus:outline-[#0d4715]"
                    required
                    value={formData.quantity}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      if (value > 999 || value < 0) {
                        setErrorMessage("Quantity must be between 0 and 999.");
                      } else {
                        setErrorMessage("");
                        setFormData({ ...formData, quantity: value });
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-row gap-4">
            <button
              type="submit"
              className={`[#f1f0e9]space-nowrap mt-2 w-full cursor-pointer rounded-md border-2 border-green-300 bg-green-600 px-4 py-2 font-semibold text-[#f1f0e9] shadow transition-colors hover:scale-102 hover:bg-green-400 focus:ring-2 focus:ring-green-500 focus:outline-none ${
                isSubmitting ? "cursor-not-allowed opacity-50" : ""
              }`}
              disabled={isSubmitting || cooldown}
            >
              {showEditForm
                ? "Save Changes"
                : isSubmitting
                  ? "Submitting..."
                  : "Add Product"}
            </button>
            {showEditForm && (
              <button
                type="button"
                onClick={() => {
                  if (showDeleteConfirm) {
                    handleDeleteSubmit();
                  } else {
                    setShowDeleteConfirm(true);
                  }
                }}
                className="[#f1f0e9]space-nowrap mt-2 w-full cursor-pointer rounded-md border-2 border-red-300 bg-red-600 px-4 py-2 font-semibold text-[#f1f0e9] shadow transition-colors hover:scale-102 hover:bg-red-400 focus:ring-2 focus:ring-red-500 focus:outline-none"
              >
                {showDeleteConfirm ? "Click Again to Delete" : "Delete Product"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOrEditForm;
