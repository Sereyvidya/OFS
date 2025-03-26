"use client";

import React, { useState, useEffect } from "react";

const Profile = ({ onClose }) => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.log("No token found.");
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:5000/user/profile", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        } else {
          console.error("Failed to fetch profile");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchProfile();
  }, []);

  if (!profile) {
    return <div className="flex items-center justify-center h-screen text-xl">Loading...</div>;
  }

  return (
    <div className="flex flex-col w-100 h-auto m-auto bg-white p-4 rounded-lg shadow-lg">
      {/* Close button */}
      <div>
        <button className="text-lg font-bold text-gray-600 hover:text-black" onClick={onClose}>
          ×
        </button>
      </div>
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4">Profile</h2>
        <div className="flex flex-col space-y-2">
            <p><strong>First Name:</strong> {profile.firstName}</p>
            <p><strong>Last Name:</strong> {profile.lastName}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Phone:</strong> {profile.phone}</p>
            <p><strong>Address:</strong> {profile.addressLine1}, {profile.city}, {profile.state}, {profile.zipCode}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
