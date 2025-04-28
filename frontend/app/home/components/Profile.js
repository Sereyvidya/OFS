"use client";

import React, { useState, useEffect } from "react";

const Profile = ({ onClose, profile, API_URL, setIsLoggedIn, setProfile }) => {
  if (!profile) {
    return <div className="flex items-center justify-center h-screen text-xl">Loading...</div>;
  }

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

  const handleDelete = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.log("No token found.");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/user/delete`, {
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
    <div className="flex flex-col w-100 h-auto m-auto bg-[#f1f0e9] rounded-lg shadow">
      <div className="relative bg-[#41644a] border-2 border-[#90b89b4d] text-white flex justify-between items-center h-20 px-4 py-4 rounded-t-lg">
        <h1 className="absolute left-1/2 top-4 transform -translate-x-1/2 font-display text-4xl font-bold text-[#f1f0e9] [text-shadow:_0_1px_3px_#73977b]">Profile</h1>
        <button
          className="absolute right-4 top-4 bg-[#f1f0e9] border border-[#90b89b] text-[#41644a] px-2 rounded hover:bg-[#73977b] hover:scale-103 shadow transition-colors"
          onClick={onClose}
        >
          &times;
        </button>
      </div>

      <div className="border-2 border-gray-400 rounded-b-lg">
        <div className="flex flex-col space-y-4 px-4 pt-4 w-full">
          {[
            ["First Name", profile.firstName],
            ["Last Name", profile.lastName],
            ["Email", profile.email],
            ["Phone", profile.phone],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between items-center px-4 py-2 rounded-md shadow-sm">
              <span className="font-medium text-[#0d4715]">{label}:</span>
              <span className="text-[#41644a]">{value}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 px-4 pb-4 flex flex-row justify-between">
          <button
            className="bg-[#e9762b] border-2 border-orange-300 text-[#f1f0e9] hover:bg-orange-400 hover:scale-103 px-6 py-2 rounded-lg shadow transition-colors"
            onClick={logout}
          >
            Log Out
          </button>
          <button
            className="bg-red-600 border-2 border-red-300 text-[#f1f0e9] hover:bg-red-400 hover:scale-103 px-6 py-2 rounded-lg shadow transition-colors"
            onClick={() => setShowDeleteConfirm(true)}
          >
            Delete Account
          </button>
        </div>

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-md shadow-md space-y-4 max-w-sm w-full">
              <h2 className="text-xl font-semibold text-center">Confirm Deletion</h2>
              <p className="text-center">Are you sure you want to delete your account?</p>
              <div className="flex justify-around">
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-400 transition"
                >
                  Delete Account
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
