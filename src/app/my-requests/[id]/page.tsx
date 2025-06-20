"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

interface RequestDetail {
  id: string;
  userId: string;
  userEmail?: string;
  recycleItem: string;
  recycleItemPrice?: number;
  pickupDate: string;
  pickupTime: string;
  fullName: string;
  address: string;
  phone: number;
  status: string;
  createdAt: string;
  assignedReceiver?: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  deviceCondition?: string;
  accessories?: string[];
  preferredContactNumber?: string;
  alternateContactNumber?: string;
  specialInstructions?: string;
  declarationChecked?: boolean;
  deviceImageUrl?: string;
  category?: string;
  model?: string;
}

interface UserDetail {
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

const MyRequestDetailPage: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const [request, setRequest] = useState<RequestDetail | null>(null);
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequestAndUser = async () => {
      try {
        const response = await fetch(`/api/recyclingRequests/${id}`);
        const data = await response.json();
        if (data.success && data.data) {
          const found = data.data;
          setRequest({
            id: found._id || found.id,
            userId: found.userId || "",
            userEmail: found.userEmail || "",
            recycleItem: found.recycleItem || "",
            recycleItemPrice: found.recycleItemPrice,
            pickupDate: found.pickupDate || "",
            pickupTime: found.pickupTime || "",
            fullName: found.fullName || "",
            address: found.address || "",
            phone: found.phone || 0,
            status: found.status || "pending",
            createdAt: found.createdAt || new Date().toISOString(),
            assignedReceiver: found.assignedReceiver,
            deviceCondition: found.deviceCondition,
            accessories: found.accessories,
            preferredContactNumber: found.preferredContactNumber,
            alternateContactNumber: found.alternateContactNumber,
            specialInstructions: found.specialInstructions,
            declarationChecked: found.declarationChecked,
            deviceImageUrl: found.deviceImageUrl || null,
            category: found.category || "",
            model: found.model || "",
          });

          if (found.userId) {
            const userResponse = await fetch(`/api/users/${found.userId}`);
            const userData = await userResponse.json();
            if (userData.success && userData.data) {
              setUser(userData.data);
            }
          }
        } else {
          setRequest(null);
        }
      } catch (error) {
        setRequest(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRequestAndUser();
  }, [id]);

  if (loading) {
    return <div className="p-8">Loading request details...</div>;
  }

  if (!request) {
    return (
      <div className="p-8">
        <h2 className="text-xl font-semibold mb-4">Request not found</h2>
        <button
          className="bg-blue-600 text-white py-2 px-4 rounded"
          onClick={() => router.back()}
        >
          Go Back
        </button>
      </div>
    );
  }

  const renderTrackOrderStatus = () => {
    switch (request.status) {
      case "pending":
      case "submitted":
        return <p className="text-blue-600 font-semibold">Your request has been successfully submitted.</p>;
      case "approved":
        return <p className="text-green-600 font-semibold">Your request has been approved. Our partner will reach out to you as soon as possible.</p>;
      case "collected":
      case "picked_up":
        return <p className="text-yellow-600 font-semibold">Your e-waste has been collected by our partner.</p>;
      case "received":
      case "delivered":
        return <p className="text-green-700 font-semibold">Your e-waste has been received by the recycler.</p>;
      default:
        return <p className="text-red-600 font-semibold">Request not accepted yet</p>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Request Details</h1>
      <div className="space-y-4 text-gray-800">
        <div>
          <span className="font-semibold">Full Name:</span> {user ? user.name : "N/A"}
        </div>
        <div>
          <span className="font-semibold">Category:</span> {request.category ? request.category.charAt(0).toUpperCase() + request.category.slice(1) : ""}
        </div>
        <div>
          <span className="font-semibold">Model:</span> {request.model && request.model.trim() !== "" ? request.model : "N/A"}
        </div>
        <div>
          <span className="font-semibold">Device Condition:</span> {request.deviceCondition || "N/A"}
        </div>
        {/* Removed Accessories Included field as per user request */}
        <div>
          <span className="font-semibold">Image Uploaded:</span>{" "}
          {request.deviceImageUrl ? (
            <Image src={request.deviceImageUrl} alt="Device" className="max-w-xs" width={400} height={300} />
          ) : (
            "No image uploaded"
          )}
        </div>
        <div>
          <span className="font-semibold">Pickup Date:</span> {request.pickupDate}
        </div>
        <div>
          <span className="font-semibold">Pickup Time:</span> {request.pickupTime}
        </div>
        <div>
          <span className="font-semibold">Pickup Address:</span> {request.address}
        </div>
        <div>
          <span className="font-semibold">Preferred Contact Number:</span> {request.preferredContactNumber || "N/A"}
        </div>
        <div>
          <span className="font-semibold">Alternate Contact Number:</span> {request.alternateContactNumber || "N/A"}
        </div>
        <div>
          <span className="font-semibold">Special Pickup Instructions:</span> {request.specialInstructions && request.specialInstructions.toLowerCase() === "none" ? "None" : (request.specialInstructions || "None")}
        </div>
        <div>
          <span className="font-semibold">Status:</span> {request.status}
        </div>
        <div>
          <span className="font-semibold">Created At:</span> {new Date(request.createdAt).toLocaleString()}
        </div>
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h2 className="font-semibold mb-2">Track Order:</h2>
          {renderTrackOrderStatus()}
        </div>
        <button
          className="mt-6 w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
          onClick={() => router.back()}
        >
          Back to My Requests
        </button>
      </div>
    </div>
  );
};

export default MyRequestDetailPage;
