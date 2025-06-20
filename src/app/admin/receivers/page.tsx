"use client";

import React, { useEffect, useState } from "react";

interface Receiver {
  id: string;
  name: string;
  email: string;
  phone: string;
  approved: boolean;
  createdAt: string;
}

const ReceiversPage: React.FC = () => {
  const [receivers, setReceivers] = useState<Receiver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReceivers = async () => {
    try {
      const response = await fetch("/api/receivers");
      const result = await response.json();
      if (result.success) {
        setReceivers(result.data);
      } else {
        setError(result.message || "Failed to fetch receivers");
      }
    } catch (err) {
      setError("Failed to fetch receivers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceivers();
  }, []);

  const toggleApproval = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch("/api/receivers", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          updates: { approved: !currentStatus },
        }),
      });
      const result = await response.json();
      if (result.success) {
        setReceivers((prev) =>
          prev.map((r) => (r.id === id ? result.data : r))
        );
      } else {
        alert("Failed to update approval status: " + (result.error || ""));
      }
    } catch (error) {
      alert("Failed to update approval status: " + error);
    }
  };

  if (loading) {
    return <div className="p-8">Loading receivers...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-600">Error: {error}</div>;
  }

  if (receivers.length === 0) {
    return <div className="p-8">No receivers found.</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Receivers</h1>
      <ul className="border rounded p-4 max-h-[600px] overflow-auto">
        {receivers.map((receiver) => (
          <li key={receiver.id} className="py-2 border-b flex justify-between items-center">
            <div>
              <p><strong>Name:</strong> {receiver.name}</p>
              <p><strong>Email:</strong> {receiver.email}</p>
              <p><strong>Phone:</strong> {receiver.phone}</p>
              <p><strong>Approved:</strong> {receiver.approved ? "Yes" : "No"}</p>
              <p><strong>Created At:</strong> {new Date(receiver.createdAt).toLocaleString()}</p>
            </div>
            <button
              className={`px-4 py-2 rounded text-white ${receiver.approved ? "bg-red-600" : "bg-green-600"}`}
              onClick={() => toggleApproval(receiver.id, receiver.approved)}
            >
              {receiver.approved ? "Unapprove" : "Approve"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReceiversPage;
