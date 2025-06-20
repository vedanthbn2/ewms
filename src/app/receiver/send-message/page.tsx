"use client";

import React, { useState } from "react";
import axios from "axios";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

const SendMessagePage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [message, setMessage] = useState("");
  const [showMessagePopup, setShowMessagePopup] = useState(false);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/users");
        if (response.data.success) {
          setUsers(response.data.data);
        } else {
          alert("Failed to fetch users");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        alert("Error fetching users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const openMessagePopup = (user: User) => {
    setSelectedUser(user);
    setMessage("");
    setShowMessagePopup(true);
  };

  const submitMessage = async () => {
    if (selectedUser && message.trim() !== "") {
      try {
        const res = await axios.post("/api/sendMessage", {
          userId: selectedUser.id,
          message,
        });
        if (res.data.success) {
          setShowMessagePopup(false);
          alert(`Message sent to ${selectedUser.name}`);
        } else {
          alert("Failed to send message: " + res.data.error);
        }
      } catch (error) {
        alert("Error sending message");
        console.error(error);
      }
    } else {
      alert("Please enter a message.");
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Users</h1>
      {loading ? (
        <div>Loading users...</div>
      ) : (
        <>
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Phone Number</th>
                <th className="py-3 px-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-100">
                  <td className="py-3 px-4">{user.name || "N/A"}</td>
                  <td className="py-3 px-4">{user.email || "N/A"}</td>
                  <td className="py-3 px-4">{user.phone || "N/A"}</td>
                  <td className="py-3 px-4">
                    <button
                      className="bg-blue-600 text-white py-1 px-3 rounded"
                      onClick={() => openMessagePopup(user)}
                    >
                      Send Message
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {showMessagePopup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded shadow-lg w-96">
                <h2 className="text-xl font-semibold mb-4">
                  Send Message to {selectedUser?.name}
                </h2>
                <textarea
                  className="w-full border rounded p-2 mb-4"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message here..."
                />
                <div className="flex justify-end space-x-4">
                  <button
                    className="bg-gray-400 text-white py-2 px-4 rounded"
                    onClick={() => setShowMessagePopup(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-blue-600 text-white py-2 px-4 rounded"
                    onClick={submitMessage}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SendMessagePage;
