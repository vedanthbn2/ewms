"use client";

import React, { useEffect, useState } from "react";
import { getToken, getUser } from "../../sign-in/auth";

interface AdminMessage {
  id: string;
  message: string;
  createdAt: string;
}

const ReceiverMessagesPage: React.FC = () => {
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = getToken();
        const user = getUser();
        if (!token || !user) {
          window.location.href = "/sign-in";
          return;
        }
        const response = await fetch("/api/receiver/messages", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await response.json();
        if (result.success) {
          setMessages(result.data);
        } else {
          setError(result.message || "Failed to fetch messages");
        }
      } catch (err) {
        setError("Failed to fetch messages");
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  if (loading) {
    return <div className="p-8">Loading messages...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-600">Error: {error}</div>;
  }

  if (messages.length === 0) {
    return <div className="p-8">No messages from admin.</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Messages from Admin</h1>
      <ul className="border rounded p-4 max-h-[600px] overflow-auto space-y-4">
        {messages.map((msg) => (
          <li key={msg.id} className="border-b pb-2">
            <p className="whitespace-pre-wrap">{msg.message}</p>
            <p className="text-sm text-gray-500 mt-1">{new Date(msg.createdAt).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReceiverMessagesPage;
