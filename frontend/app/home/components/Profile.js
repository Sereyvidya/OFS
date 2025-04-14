"use client";

import React, { useState, useEffect } from "react";

const Profile = ({ onClose, profile }) => {
  if (!profile) {
    return <div className="flex items-center justify-center h-screen text-xl">Loading...</div>;
  }

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
    </div>
  );
};

export default Profile;
