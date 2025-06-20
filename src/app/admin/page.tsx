"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken, getUser } from "../sign-in/auth";

interface Location {
  lat: number;
  lng: number;
  address: string;
}

interface RecyclingRequest {
  id: string;
  category: string;
  deviceType: string;
  condition: string;
  quantity: number;
  userEmail: string;
  status: string;
  createdAt: string;
  location?: Location;
  address: string;
}

interface User {
  role?: string;
}

const AdminDashboard: React.FC = () => {
  const [requests, setRequests] = useState<RecyclingRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchRequests = async () => {
      try {
        const token = getToken();
        const user = getUser() as User;
        
        if (!token || !user || user.role !== "admin") {
          window.location.href = "/sign-in";
          return;
        }

        const response = await axios.get("/api/recycling-requests");
        setRequests(response.data.map((req: any) => ({
          id: req._id || Math.random().toString(36).substr(2, 9),
          category: req.category || "smartphone",
          deviceType: req.deviceType || "",
          condition: req.condition || "used",
          quantity: req.quantity || 1,
          userEmail: req.userEmail || "",
          status: req.status || "pending",
          createdAt: req.createdAt || new Date().toISOString()
        })));
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  if (!mounted || loading) {
    return <div className="p-8">Loading requests...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Recycling Requests</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">Category</th>
              <th className="py-3 px-4 text-left">Device Type</th>
              <th className="py-3 px-4 text-left">Condition</th>
              <th className="py-3 px-4 text-left">Quantity</th>
              <th className="py-3 px-4 text-left">User Email</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Date</th>
              <th className="py-3 px-4 text-left">Location</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {requests.map((request: RecyclingRequest) => (
              <tr key={request.id}>
                <td className="py-3 px-4">{request.id}</td>
                <td className="py-3 px-4">{request.category}</td>
                <td className="py-3 px-4">{request.deviceType}</td>
                <td className="py-3 px-4">{request.condition}</td>
                <td className="py-3 px-4">{request.quantity}</td>
                <td className="py-3 px-4">{request.userEmail}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    request.status === "pending" 
                      ? "bg-yellow-100 text-yellow-800" 
                      : request.status === "approved" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                  }`}>
                    {request.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  {new Date(request.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 px-4">
                  {request.location ? (
                    <a 
                      href={`https://www.google.com/maps?q=${request.location.lat},${request.location.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {request.location.address || `${request.location.lat.toFixed(4)}, ${request.location.lng.toFixed(4)}`}
                    </a>
                  ) : (
                    <span className="text-gray-400">No location</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
