"use client";
import React, { useState, FormEvent } from "react";
import Link from "next/link";

interface PickupRequest {
  id: string;
  recyclerApproved: boolean;
  scheduledTime: string;
}

const PickupStatus = () => {
  const [pickupRequest, setPickupRequest] = useState<PickupRequest | null>(null);
  const [status, setStatus] = useState("Pending");

  const handleRequestSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Simulate a pickup request submission
    const requestData = {
      id: Math.random().toString(36).substr(2, 9),
      recyclerApproved: Math.random() > 0.5, // Randomly approve or disapprove
      scheduledTime: new Date().toLocaleString(),
    };
    setPickupRequest(requestData);
    setStatus(requestData.recyclerApproved ? "Approved" : "Not Approved");
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold mb-4">Pickup Request Status</h1>
      <form onSubmit={handleRequestSubmit} className="mb-4">
        <button type="submit" className="btn btn-primary">
          Request Pickup
        </button>
      </form>
      {pickupRequest && (
        <div className="status-info">
          <h2 className="text-2xl">Request ID: {pickupRequest.id}</h2>
          <p>Status: {status}</p>
          {status === "Approved" && (
            <p>Pickup Scheduled Time: {pickupRequest.scheduledTime}</p>
          )}
        </div>
      )}
      <Link href="/about" className="mt-4 inline-block">
        Back to About
      </Link>
    </div>
  );
};

export default PickupStatus;
