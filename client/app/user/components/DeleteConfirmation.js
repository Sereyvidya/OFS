"use client";

import React from "react";
import { toast } from "react-toastify";
import { useUserContext } from "../context/UserContext";
import { deleteUser } from "../api/UserRoutes";

/**
 * Renders a form asking the user to confirm deleting their account.
 */
const DeleteConfirmation = () => {
  const {
    API_URL,
    setProfile,
    setIsLoggedIn,
    setShowProfile,
    setShowDeleteConfirm,
  } = useUserContext();

  const handleDelete = async () => {
    const { ok } = await deleteUser(API_URL);
    if (ok) {
      toast.success("Account deleted successfully!", {
        onClose: () => {
          sessionStorage.removeItem("authToken");
          setProfile(null);
          setIsLoggedIn(false);
          setShowDeleteConfirm(false);
        },
      });
    } else {
      toast.error("Failed to delete account, please try again later.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm backdrop-brightness-80">
      <div className="m-auto flex h-auto w-100 flex-col rounded-lg bg-[#f1f0e9] shadow">
        <div className="relative flex h-20 items-center justify-between rounded-t-lg border-2 border-[#90b89b4d] bg-[#41644a] px-4 py-4 text-white">
          <h1 className="font-display absolute top-4 left-1/2 -translate-x-1/2 transform text-3xl font-bold whitespace-nowrap text-[#f1f0e9] [text-shadow:_0_1px_3px_#73977b]">
            Confirm Deletion
          </h1>
        </div>

        <div className="flex flex-col gap-4 rounded-b-lg border-2 border-gray-400 pt-4 pb-6">
          <p className="text-center text-[#41644a]">
            Are you sure you want to delete your account?
          </p>
          <div className="flex justify-around">
            <button
              onClick={handleDelete}
              className="rounded-lg border-2 border-red-300 bg-red-600 px-6 py-2 text-[#f1f0e9] shadow transition-colors hover:scale-103 hover:bg-red-400 focus:ring-2 focus:ring-red-500 focus:outline-none"
            >
              Delete Account
            </button>
            <button
              onClick={() => {
                setShowDeleteConfirm(false);
                setShowProfile(true);
              }}
              className="rounded-lg border-2 border-gray-300 bg-gray-600 px-6 py-2 text-[#f1f0e9] shadow transition-colors hover:scale-103 hover:bg-gray-400 focus:ring-2 focus:ring-gray-500 focus:outline-none"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
