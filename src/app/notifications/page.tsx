"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

interface Notification {
  id: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Assuming userId is stored in localStorage for user notifications
        const userJSON = localStorage.getItem("user");
        const user = userJSON ? JSON.parse(userJSON) : null;
        if (!user) {
          setNotifications([]);
          setLoading(false);
          return;
        }
        const response = await axios.get(`/api/notifications?userId=${user.id}`);
        if (response.data.success) {
          setNotifications(response.data.data);
        } else {
          setNotifications([]);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading) {
    return <div className="p-8">Loading notifications...</div>;
  }

  if (notifications.length === 0) {
    return <div className="p-8">No notifications found.</div>;
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>
      <ul className="space-y-4">
        {notifications.map((notification) => (
          <li
            key={notification.id}
            className={`p-4 border rounded ${
              notification.read ? "bg-gray-100" : "bg-white"
            }`}
          >
            <p>{notification.message}</p>
            <small className="text-gray-500">
              {new Date(notification.createdAt).toLocaleString()}
            </small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationsPage;
