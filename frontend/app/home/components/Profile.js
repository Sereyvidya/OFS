"use client";

import React, { useState, useEffect } from "react";

const Profile = ({ onClose, profile, apiUrl, setIsLoggedIn, setProfile }) => {
  if (!profile) {
    return <div className="flex items-center justify-center h-screen text-xl">Loading...</div>;
  }

  const logout = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.log("No token found.");
      return;
    }
    else{
      localStorage.removeItem("authToken");
      setProfile(null);
      setIsLoggedIn(false);
      onClose();
      window.location.reload();
    }
  };

  const deleteAcc = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.log("No token found.");
      return;
    }
    try {
      const response = await fetch(`${apiUrl}/user/delete`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        console.log("Account deleted.");
        localStorage.removeItem("authToken");
        setProfile(null);
        setIsLoggedIn(false);
        onClose();
      } else {
        console.error("Failed to delete account");
      }
    } catch (error) {
      console.error("Error deleting account", error);
    }
  };

  return (
    <div className="flex flex-col w-100 h-auto m-auto bg-white p-4 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Profile</h2>
        <button
          className="bg-gray-300 px-2 rounded hover:bg-gray-400 hover:scale-103 shadow transition-colors"
          onClick={onClose}
        >
          &times;
        </button>
      </div>
      <div className="flex flex-col space-y-4 w-full">
        {[
          ["First Name", profile.firstName],
          ["Last Name", profile.lastName],
          ["Email", profile.email],
          ["Phone", profile.phone],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded-md shadow-sm">
            <span className="font-medium text-gray-600">{label}:</span>
            <span className="text-gray-800">{value}</span>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-center">
        <button
          className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 shadow transition-colors"
          onClick={logout}
        >
          Log Out
        </button>
      </div>
      <div className="mt-6 flex justify-center">
        <button
          className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 shadow transition-colors"
          onClick={deleteAcc}
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default Profile;
