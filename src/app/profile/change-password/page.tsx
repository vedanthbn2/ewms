"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { getUser, getUserID, handleLogout } from "../../sign-in/auth";

const ChangePasswordPage = () => {
  const user = getUser();
  const userId = getUserID();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) {
      setError("User not authenticated");
    }
  }, [userId]);

  if (!userId) {
    return <p>Loading...</p>;
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (newPassword !== confirmNewPassword) {
      setError("New password and confirm password do not match");
      return;
    }

    try {
      // Determine API endpoint based on user role
      const apiEndpoint = user?.role === "receiver" ? "/api/receivers/changePassword" : "/api/users/changePassword";

      const response = await axios.post(apiEndpoint, {
        id: userId,
        oldPassword,
        newPassword,
      });

        if (response.data.success) {
          setMessage("Password changed successfully.");
          setOldPassword("");
          setNewPassword("");
          setConfirmNewPassword("");
          // Do not logout or navigate away, stay on the page
          // handleLogout();
        } else {
          setError(response.data.error || "Failed to change password");
        }
    } catch (err) {
      setError("Error changing password");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-green-100 to-green-300 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold mb-8 text-center text-green-800">Change Password</h2>
        <form onSubmit={handleChangePassword} className="space-y-6">
          <div>
            <label htmlFor="oldPassword" className="block text-gray-700 font-semibold mb-2">
              Old Password
            </label>
            <input
              type="password"
              id="oldPassword"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-black"
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-gray-700 font-semibold mb-2">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-black"
            />
          </div>
          <div>
            <label htmlFor="confirmNewPassword" className="block text-gray-700 font-semibold mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmNewPassword"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-black"
            />
          </div>
          {message && (
            <p className="bg-green-100 text-green-800 p-3 rounded mb-4 text-center font-semibold">
              {message}
            </p>
          )}
          {error && (
            <p className="bg-red-100 text-red-800 p-3 rounded mb-4 text-center font-semibold">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition duration-300"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
