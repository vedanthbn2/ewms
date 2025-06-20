"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface RecyclingRequest {
  id: string;
  userId: string;
  fullName: string;
  phone: number;
  category: string;
  status: string;
  receivedBy?: string;
}

interface User {
  _id: string;
  name: string;
  phone: number;
}

const categoryMap: { [key: string]: string } = {
  smartphone: "Smartphone",
  refrigerator: "Refrigerator",
  television: "Television",
  laptop: "Laptop",
  accessories: "Accessories",
  other: "Other",
};

const PickupRequestedPage: React.FC = () => {
  const [requests, setRequests] = useState<RecyclingRequest[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchRequestsAndUsers = async () => {
      try {
        const userJSON = localStorage.getItem("user");
        const user = userJSON ? JSON.parse(userJSON) : null;
        if (!user) {
          router.push("/sign-in");
          return;
        }
        const userIdStr = String(user.id);
        const userRoleStr = user.role ? String(user.role) : "user";

        const [requestsResponse, usersResponse] = await Promise.all([
          axios.get("/api/recyclingRequests", {
            headers: {
              "x-user-id": userIdStr,
              "x-user-role": userRoleStr,
            },
          }),
          axios.get("/api/users/listUsers"),
        ]);

        const usersData: User[] = usersResponse.data.data || [];
        setUsers(usersData);

        const requestsData = requestsResponse.data.data || [];
        console.log("Fetched requests:", requestsData);
        console.log("Fetched users:", usersData);

        setRequests(
          requestsData.map((req: any) => ({
            id: req._id || req.id || Math.random().toString(36).substr(2, 9),
            userId: req.userId || "",
            fullName: "",
            phone: 0,
            category: categoryMap[req.recycleItem?.toLowerCase()] || "Unknown",
            status: req.status || "pending",
            receivedBy: req.receivedBy || "",
          }))
        );
      } catch (error) {
        console.error("Error fetching pickup requests or users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequestsAndUsers();
  }, [router]);

  const getUserName = (userId: string) => {
    const user = users.find((u) => u._id === userId);
    return user ? user.name : "Unknown";
  };

  const getUserPhone = (userId: string) => {
    const user = users.find((u) => u._id === userId);
    return user ? user.phone : "";
  };

  const handleRowClick = (requestId: string) => {
    router.push(`/admin/pickup-requested/${requestId}`);
  };

  if (loading) {
    return <div className="p-8">Loading pickup requests...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Pickup Requested</h1>
      <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden cursor-pointer">
            <thead className="bg-gray-100">
              <tr>
                {/* Removed User ID column as per request */}
                {/* <th className="py-3 px-4 text-left">User ID</th> */}
                <th className="py-3 px-4 text-center">Name</th>
                <th className="py-3 px-4 text-center">Phone Number</th>
                <th className="py-3 px-4 text-center">Category</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-3 px-4 text-center text-gray-500">
                    No pickup requests found
                  </td>
                </tr>
              ) : (
                requests.map((request) => (
                  <tr
                    key={request.id}
                    onClick={() => handleRowClick(request.id)}
                    className="hover:bg-gray-100"
                  >
                    {/* Removed User ID cell */}
                    {/* <td className="py-3 px-4">{request.userId}</td> */}
                    <td className="py-3 px-4 text-center">{getUserName(request.userId)}</td>
                    <td className="py-3 px-4 text-center">{getUserPhone(request.userId)}</td>
                    <td className="py-3 px-4 text-center">{request.category}</td>
                    <td className="py-3 px-4 text-center">{request.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
      </div>
    </div>
  );
};

export default PickupRequestedPage;
