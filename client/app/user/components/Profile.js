"use client";

import React from "react";
import { useUserContext } from "../context/UserContext";

const Profile = () => {
  const {
    API_URL,
    setShowProfile,
    setShowDeleteConfirm,
    isLoggedIn,
    setIsLoggedIn,
    profile,
    setProfile,
  } = useUserContext();

  const logout = async () => {
    sessionStorage.removeItem("authToken");
    setProfile(null);
    setIsLoggedIn(false);
    setShowProfile(false);
    window.location.reload();
  };

  return (
    <div className="m-auto flex h-auto w-100 flex-col rounded-lg bg-[#f1f0e9] shadow">
      <div className="relative flex h-20 items-center justify-between rounded-t-lg border-2 border-[#90b89b4d] bg-[#41644a] px-4 py-4 text-white">
        <h1 className="font-display absolute top-4 left-1/2 -translate-x-1/2 transform text-4xl font-bold text-[#f1f0e9] [text-shadow:_0_1px_3px_#73977b]">
          Profile
        </h1>
        <button
          className="absolute top-4 right-4 rounded border border-[#90b89b] bg-[#f1f0e9] px-2 text-[#41644a] shadow transition-colors hover:scale-103 hover:bg-[#73977b] focus:ring-2 focus:ring-[#73977b] focus:outline-none"
          onClick={() => setShowProfile(false)}
        >
          &times;
        </button>
      </div>

      <div className="rounded-b-lg border-2 border-gray-400">
        {!profile ? (
          <p className="mt-4 text-center text-gray-500 italic">
            No profile found.
          </p>
        ) : (
          <div className="flex w-full flex-col space-y-4 px-4 pt-4">
            {[
              ["First Name", profile.firstName],
              ["Last Name", profile.lastName],
              ["Email", profile.email],
              ["Phone", profile.phone],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-md px-4 py-2 shadow-sm"
              >
                <span className="font-medium text-[#0d4715]">{label}:</span>
                <span className="text-[#41644a]">{value}</span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 flex flex-row justify-between px-4 pb-4">
          <button
            className="rounded-lg border-2 border-orange-300 bg-[#e9762b] px-6 py-2 text-[#f1f0e9] shadow transition-colors hover:scale-103 hover:bg-orange-400 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            onClick={logout}
          >
            Log Out
          </button>
          <button
            className="rounded-lg border-2 border-red-300 bg-red-600 px-6 py-2 text-[#f1f0e9] shadow transition-colors hover:scale-103 hover:bg-red-400 focus:ring-2 focus:ring-red-500 focus:outline-none"
            onClick={() => {
              setShowProfile(false);
              setShowDeleteConfirm(true);
            }}
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
