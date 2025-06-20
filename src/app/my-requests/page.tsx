"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Request {
  id: string;
  _id?: string;
  createdAt: string;
  status: string;
  recycleItem: string;
  pickupDate: string;
  pickupTime: string;
  userId?: string | number;
  assignedReceiver?: { id: string } | string;
  receivedBy?: string;
}

const MyRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchRequests = async () => {
      const userJSON = localStorage.getItem("user");
      const user = userJSON ? JSON.parse(userJSON) : null;
      console.log("Logged in user object:", user);
      if (!user) {
        router.push("/sign-in?message=signin to view your requests");
        return;
      }
      const userIdStr = String(user.id);
      const userRoleStr = user.role ? String(user.role) : "user";
      try {
        const response = await fetch("/api/recyclingRequests", {
          headers: {
            "x-user-id": userIdStr,
            "x-user-role": userRoleStr,
          },
        });
        const data = await response.json();
        console.log("Logged in user:", user);
        console.log("API response data:", data);
        // The API already filters requests by user, so no need to filter again
        if (data.success && Array.isArray(data.data)) {
          setRequests(data.data);
        } else {
          setRequests([]);
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [router]);

  if (loading) {
    return <div className="p-8">Loading your requests...</div>;
  }

  if (requests.length === 0) {
    return <div className="p-8">You have no requests.</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">My Requests</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left">S.No</th>
              <th className="py-3 px-4 text-left">E-waste Item</th>
              <th className="py-3 px-4 text-left">Pickup Date</th>
              <th className="py-3 px-4 text-left">Pickup Time</th>
              <th className="py-3 px-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {requests.map((req, index) => (
              <tr
                key={req._id || req.id}
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => router.push(`/my-requests/${req._id || req.id}`)}
              >
                <td className="py-3 px-4">{index + 1}</td>
                <td className="py-3 px-4">{req.recycleItem}</td>
                <td className="py-3 px-4">{req.pickupDate}</td>
                <td className="py-3 px-4">{req.pickupTime}</td>
                <td className="py-3 px-4 capitalize">{req.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyRequestsPage;
