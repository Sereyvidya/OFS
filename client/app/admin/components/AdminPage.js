"use client";

import React from "react";
import { useAdminContext } from "../context/AdminContext";
import Login from "./Login";
import NavBar from "./NavBar";
import ProductGrid from "./ProductGrid";
import AddOrEditForm from "./AddOrEditForm";
import DeliveryDashboard from "./DeliveryDashboard";

export default function AdminPage() {
  const { isLoggedIn, showAddForm, showEditForm, showDeliveryDashboard } =
    useAdminContext();

  return !isLoggedIn ? (
    <div className="min-h-screen bg-[#f1f0e9]">
      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm backdrop-brightness-50">
        <Login />
      </div>
    </div>
  ) : (
    <div className="min-h-screen bg-[#f1f0e9]">
      <NavBar />

      <ProductGrid />

      {(showAddForm || showEditForm) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm backdrop-brightness-50">
          <AddOrEditForm />
        </div>
      )}

      {showDeliveryDashboard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm backdrop-brightness-50">
          <DeliveryDashboard />
        </div>
      )}
    </div>
  );
}
