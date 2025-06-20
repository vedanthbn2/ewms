"use client";

import React, { useState } from "react";
import axios from "axios";
import { getUser, handleLogout } from "../../sign-in/auth";

const ReceiverProfile = () => {
  const user = getUser();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  if (!user) {
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
      const response = await axios.post("/api/receivers/changePassword", {
        id: user.id,
        oldPassword,
        newPassword,
      });

      if (response.data.success) {
        setMessage("Password changed successfully. Please login again.");
        setOldPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        // Logout user after password change
        handleLogout();
      } else {
        setError(response.data.error || "Failed to change password");
      }
    } catch (err) {
      setError("Error changing password");
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-2xl font-semibold mb-6">Receiver Profile</h2>
      <form onSubmit={handleChangePassword} className="max-w-md mx-auto space-y-4">
        <div>
          <label htmlFor="oldPassword" className="block text-gray-700 font-medium mb-1">
            Old Password
          </label>
          <input
            type="password"
            id="oldPassword"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label htmlFor="newPassword" className="block text-gray-700 font-medium mb-1">
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label htmlFor="confirmNewPassword" className="block text-gray-700 font-medium mb-1">
            Confirm New Password
          </label>
          <input
            type="password"
            id="confirmNewPassword"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        {message && <p className="text-green-600">{message}</p>}
        {error && <p className="text-red-600">{error}</p>}
        <button
          type="submit"
          className="w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700"
        >
          Change Password
        </button>
      </form>
    </div>
  );
};

export default ReceiverProfile;
