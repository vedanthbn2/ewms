"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

interface Location {
  lat: number;
  lng: number;
  address: string;
}

interface Receiver {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  phone: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface RecyclingRequestDetail {
  id: string;
  userId: string;
  userEmail: string;
  recycleItem: string;
  recycleItemPrice?: number;
  pickupDate: string;
  pickupTime: string;
  fullName: string;
  address: string;
  phone: number;
  location?: Location;
  deviceCondition?: string;
  accessories?: string[];
  preferredContactNumber?: string;
  alternateContactNumber?: string;
  specialInstructions?: string;
  declarationChecked?: boolean;
  status: string;
  createdAt: string;
  deviceImageUrl?: string;
  category?: string;
  model?: string;
  collectionNotes?: string;
  collectionProof?: string;
  receivedBy?: string;
  assignedReceiver?: Receiver | null | string;
  receiverName?: string;
  receiverEmail?: string;
}

const PickupRequestDetailPage: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const [request, setRequest] = useState<any | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [receivers, setReceivers] = useState<Receiver[]>([]);
  const [selectedReceiverId, setSelectedReceiverId] = useState<string>("");

  useEffect(() => {
    const fetchRequestAndUser = async () => {
      try {
        const userJSON = localStorage.getItem("user");
        const userLocal = userJSON ? JSON.parse(userJSON) : null;
        if (!userLocal) {
          router.push("/sign-in");
          return;
        }
        const userIdStr = String(userLocal.id);
        const userRoleStr = userLocal.role ? String(userLocal.role) : "user";

        const response = await axios.get(`/api/recyclingRequests/${id}`, {
          headers: {
            "x-user-id": userIdStr,
            "x-user-role": userRoleStr,
          },
        });

        if (response.data.success && response.data.data) {
          const found = response.data.data;
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
            location: found.location,
            deviceCondition: found.deviceCondition,
            accessories: found.accessories,
            preferredContactNumber: found.preferredContactNumber,
            alternateContactNumber: found.alternateContactNumber,
            specialInstructions: found.specialInstructions,
            declarationChecked: found.declarationChecked,
            status: found.status || "pending",
            createdAt: found.createdAt || new Date().toISOString(),
            deviceImageUrl: found.deviceImageUrl || null,
            category: found.category || "",
            model: found.model || "",
            collectionNotes: found.collectionNotes || "",
            collectionProof: found.collectionProof || "",
            receivedBy: found.receivedBy || "",
            assignedReceiver: found.assignedReceiver || null,
          });

          if (found.userId) {
            try {
              const userResponse = await axios.get(`/api/users/${found.userId}`);
              if (userResponse.data.success && userResponse.data.data) {
                setUser(userResponse.data.data);
              } else {
                setUser(null);
              }
            } catch (error) {
              console.error("Error fetching user data:", error);
              setUser(null);
            }
          } else {
            setUser(null);
          }
        } else {
          setRequest(null);
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching request detail:", error);
        setRequest(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    const fetchReceivers = async () => {
      try {
        const response = await axios.get("/api/receivers");
        if (response.data.success) {
          setReceivers(response.data.data);
        } else {
          setReceivers([]);
        }
      } catch (error) {
        console.error("Error fetching receivers:", error);
        setReceivers([]);
      }
    };

    fetchRequestAndUser();
    fetchReceivers();
  }, [id, router]);

  const approvePickup = async () => {
    if (!selectedReceiverId) {
      alert("Please select a receiver before approving.");
      return;
    }

    try {
      const assignedReceiver = receivers.find(
        (r) => r.id === selectedReceiverId || r._id === selectedReceiverId
      );
      if (!assignedReceiver) {
        alert("Selected receiver not found.");
        return;
      }

      const assignedReceiverId =
        typeof assignedReceiver === "string"
          ? assignedReceiver
          : assignedReceiver._id || assignedReceiver.id || selectedReceiverId;

      const updates = {
        status: "approved",
        assignedReceiver: assignedReceiverId,
      };

      const userJSON = localStorage.getItem("user");
      const userLocal = userJSON ? JSON.parse(userJSON) : null;
      const userIdStr = userLocal ? String(userLocal.id) : "";
      const userRoleStr = userLocal && userLocal.role ? String(userLocal.role) : "user";

      const response = await fetch("/api/recyclingRequests", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userIdStr,
          "x-user-role": userRoleStr,
        },
        body: JSON.stringify({ id: request?.id, updates }),
      });

      const result = await response.json();
      if (result.success) {
        alert("Pickup request approved and assigned to receiver: " + assignedReceiver.name);

        try {
          await fetch("/api/notifications", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: request?.userId,
              message:
                "Your request has been approved. Our partner will reach out to you as soon as possible.",
            }),
          });
        } catch (error) {
          console.error("Error creating approval notification:", error);
        }

        // Update assignedReceiver state to selected receiver object to reflect immediately in UI
        setRequest((prev) =>
          prev
            ? {
                ...prev,
                assignedReceiver: assignedReceiver,
                status: "approved",
              }
            : prev
        );

        // Optionally update selectedReceiverId to clear selection
        setSelectedReceiverId("");

        // Do not reload the page to keep UI state
        // window.location.reload();
      } else {
        alert("Failed to approve pickup: " + result.error);
      }
    } catch (error) {
      alert("Error approving pickup: " + error);
    }
  };

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
    // Remove messages for pending and approved in admin view as per user request
    return null;
  };

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6">Pickup Request Details</h1>
      <div className="space-y-4 text-gray-800">
        <div>
          <span className="font-semibold">Name:</span> {user?.name || "N/A"}
        </div>
        <div>
          <span className="font-semibold">Phone:</span>{" "}
          {request.preferredContactNumber || request.phone || "N/A"}
        </div>
        <div>
          <span className="font-semibold">Category:</span>{" "}
          {request.category
            ? request.category.charAt(0).toUpperCase() + request.category.slice(1)
            : "N/A"}
        </div>
        <div>
          <span className="font-semibold">Model:</span>{" "}
          {request.model || request.recycleItem || "N/A"}
        </div>
        <div>
          <span className="font-semibold">Device Condition:</span>{" "}
          {request.deviceCondition || "N/A"}
        </div>
        <div>
          <span className="font-semibold">Image Uploaded:</span>{" "}
          {request.deviceImageUrl ? (
            <Image
              src={request.deviceImageUrl}
              alt="Device"
              className="max-w-xs"
              width={400}
              height={300}
            />
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
          <span className="font-semibold">Preferred Contact Number:</span>{" "}
          {request.preferredContactNumber || "N/A"}
        </div>
        <div>
          <span className="font-semibold">Alternate Contact Number:</span>{" "}
          {request.alternateContactNumber || "N/A"}
        </div>
        <div>
          <span className="font-semibold">Special Pickup Instructions:</span>{" "}
          {request.specialInstructions && request.specialInstructions.toLowerCase() === "none"
            ? "None"
            : request.specialInstructions || "None"}
        </div>
        {/* Removed Declaration Checked display as per user request */}
        {/* {(request.status !== "pending") && (
          <div>
            <span className="font-semibold">Declaration Checked:</span>{" "}
            {request.declarationChecked ? "Yes" : "No"}
          </div>
        )} */}
        {/* Removed Status display after Special Pickup Instructions as per user request */}
        {/* {(request.status !== "pending") && (
          <div>
            <span className="font-semibold">Status:</span> {request.status || "N/A"}
          </div>
        )} */}
        <div>
          <span className="font-semibold">Created At:</span>{" "}
          {new Date(request.createdAt).toLocaleString()}
        </div>
        {(request.status !== "pending") && (
          <div className="mt-6 p-4 bg-gray-100 rounded">{renderTrackOrderStatus()}</div>
        )}
        {(request.status === "received" || request.status === "collected") && (
          <div>
            <span className="font-semibold">Collection Notes:</span>{" "}
            {request.collectionNotes || "None"}
          </div>
        )}
        {(request.status === "received" || request.status === "collected") && (
          <div>
            <span className="font-semibold">Collection Proof:</span>{" "}
            {request.collectionProof ? (
              <Image
                src={request.collectionProof}
                alt="Collection Proof"
                className="max-w-xs max-h-48"
                width={400}
                height={300}
              />
            ) : (
              "No proof uploaded"
            )}
          </div>
        )}
        {(request.status === "received" || request.status === "collected") && request.receivedBy && (
          <div>
            <span className="font-semibold">Received By:</span>{" "}
            {request.receivedBy}
          </div>
        )}

      {request.status === "pending" ? (
        <>
          {!request.assignedReceiver ||
          Object.keys(request.assignedReceiver).length === 0 ||
          request.assignedReceiver === "" ||
          request.assignedReceiver === "not-assigned" ? (
            <div className="mb-4">
              <label htmlFor="receiverSelect" className="block mb-2 font-semibold">
                Select Receiver to Assign:
              </label>
              <select
                id="receiverSelect"
                value={selectedReceiverId}
                onChange={(e) => setSelectedReceiverId(e.target.value)}
                className="border p-2 rounded w-full max-w-xs"
              >
                <option value="">-- Select Receiver --</option>
                {receivers.map((receiver) => (
                  <option key={receiver.id || receiver._id} value={receiver.id || receiver._id}>
                    {receiver.name} ({receiver.email})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="mb-4">
          <strong>Assigned to:</strong>{" "}
          {(() => {
            if (typeof request.assignedReceiver === "string") {
              const receiver = receivers.find(
                (r) => r.id === request.assignedReceiver || r._id === request.assignedReceiver
              );
              return receiver ? `${receiver.name} (${receiver.email})` : "Unknown Receiver";
            }
            if (request.assignedReceiver?.name && request.assignedReceiver?.email) {
              return `${request.assignedReceiver.name} (${request.assignedReceiver.email})`;
            }
            return request.assignedReceiver?.name || "N/A";
          })()}
            </div>
          )}
          {!request.assignedReceiver ||
          Object.keys(request.assignedReceiver).length === 0 ||
          request.assignedReceiver === "" ||
          request.assignedReceiver === "not-assigned" ? (
            <button
              className="bg-green-600 text-white py-2 px-4 rounded mr-4"
              onClick={approvePickup}
            >
              Approve Pickup
            </button>
          ) : null}
          {request.status === "received" && (
            <button
              className="bg-blue-600 text-white py-2 px-4 rounded mr-4"
              onClick={async () => {
                try {
                  const userJSON = localStorage.getItem("user");
                  const userLocal = userJSON ? JSON.parse(userJSON) : null;
                  const userIdStr = userLocal ? String(userLocal.id) : "";
                  const userRoleStr = userLocal && userLocal.role ? String(userLocal.role) : "user";

                  const updates = {
                    status: "received by receiver",
                  };

                  const response = await fetch("/api/recyclingRequests", {
                    method: "PATCH",
                    headers: {
                      "Content-Type": "application/json",
                      "x-user-id": userIdStr,
                      "x-user-role": userRoleStr,
                    },
                    body: JSON.stringify({ id: request.id, updates }),
                  });

                  const result = await response.json();
                  if (result.success) {
                    alert("Status updated to received by receiver");
                    // Update local state to reflect status change
                    setRequest((prev: RecyclingRequestDetail | null) => prev ? { ...prev, status: "received by receiver" } : prev);
                  } else {
                    alert("Failed to update status: " + result.error);
                  }
                } catch (error) {
                  alert("Error updating status: " + error);
                }
              }}
            >
              Received by Recycler
            </button>
          )}
          <button
            className="bg-gray-600 text-white py-2 px-4 rounded ml-4"
            onClick={() => router.back()}
          >
            Back to Pickup Requests
          </button>
        </>
      ) : (
        <>
          <div className="mb-4">
            <strong>Status:</strong> {request.status || "N/A"}
          </div>
          <div className="mb-4">
          <strong>Assigned to:</strong>{" "}
          {typeof request.assignedReceiver === "string"
            ? (() => {
                const receiver = receivers.find(
                  (r) => r.id === request.assignedReceiver || r._id === request.assignedReceiver
                );
                return receiver ? `${receiver.name} (${receiver.email})` : request.assignedReceiver;
              })()
            : request.assignedReceiver?.name && request.assignedReceiver?.email
            ? `${request.assignedReceiver.name} (${request.assignedReceiver.email})`
            : request.assignedReceiver?.name || "N/A"}
          </div>
          <button
            className="bg-gray-600 text-white py-2 px-4 rounded ml-4"
            onClick={() => router.back()}
          >
            Back to Pickup Requests
          </button>
        </>
      )}
      </div>
    </div>
  );
};

export default PickupRequestDetailPage;
