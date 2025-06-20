"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const categories = ["Smartphone", "Laptop", "TV", "Refrigerator", "Battery", "Other"];
const conditions = ["Working", "Not Working", "Broken", "Parts Only"];

export default function RecycleForm() {
  const [formData, setFormData] = useState({
    category: "",
    brandName: "",
    modelName: "",
    condition: "",
    image: null as File | null,
    pickupAddress: "",
    preferredDate: "",
    preferredTime: "",
    specialInstructions: "",
  });

  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userJSON = localStorage.getItem("user");
    if (userJSON) {
      const user = JSON.parse(userJSON);
      setUserId(user.id);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === "image" && files) {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData({
            ...formData,
            pickupAddress: `Lat: ${latitude.toFixed(5)}, Lon: ${longitude.toFixed(5)}`,
          });
        },
        (error) => {
          alert("Unable to retrieve your location.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userId) {
      alert("You must be signed in to submit a request.");
      return;
    }

    // Validate required fields
    if (
      !formData.category ||
      !formData.brandName ||
      !formData.modelName ||
      !formData.condition ||
      !formData.pickupAddress ||
      !formData.preferredDate ||
      !formData.preferredTime
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const payload = {
        userId,
        category: formData.category,
        brandName: formData.brandName,
        modelName: formData.modelName,
        condition: formData.condition,
        pickupAddress: formData.pickupAddress,
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime,
        specialInstructions: formData.specialInstructions,
        // image upload handling can be added later if needed
      };

      const response = await fetch("/api/recycling-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        alert("Your e-waste pickup request has been submitted successfully.");
        // Reset form
        setFormData({
          category: "",
          brandName: "",
          modelName: "",
          condition: "",
          image: null,
          pickupAddress: "",
          preferredDate: "",
          preferredTime: "",
          specialInstructions: "",
        });
        // Navigate to my-requests page to show all requests
        router.push("/my-requests");
      } else {
        alert("Failed to submit request: " + (result.error || "Unknown error"));
      }
    } catch (error) {
      alert("Error submitting request: " + error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl w-full mx-auto p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-8 text-center text-emerald-700">E-Waste Item Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <label className="block">
          Category
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="" disabled>Select category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </label>

        <label className="block">
          Brand Name
          <input
            type="text"
            name="brandName"
            value={formData.brandName}
            onChange={handleChange}
            required
            className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </label>

        <label className="block">
          Model Name/Number
          <input
            type="text"
            name="modelName"
            value={formData.modelName}
            onChange={handleChange}
            required
            className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </label>

        <label className="block">
          Condition
          <select
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            required
            className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="" disabled>Select condition</option>
            {conditions.map((cond) => (
              <option key={cond} value={cond}>{cond}</option>
            ))}
          </select>
        </label>

        <label className="block md:col-span-2">
          Upload Image of Item (optional)
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full mt-1"
          />
        </label>
      </div>

      <h3 className="text-2xl font-semibold mt-10 mb-6 text-emerald-700">📅 Pickup Details</h3>

      <label className="block mb-6">
        Pickup Address
        <textarea
          name="pickupAddress"
          value={formData.pickupAddress}
          onChange={handleChange}
          required
          rows={3}
          className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          className="mt-3 px-5 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
        >
          Use Current Location
        </button>
      </label>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <label className="block">
          Preferred Pickup Date
          <input
            type="date"
            name="preferredDate"
            value={formData.preferredDate}
            onChange={handleChange}
            required
            className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </label>

        <label className="block">
          Preferred Pickup Time
          <input
            type="time"
            name="preferredTime"
            value={formData.preferredTime}
            onChange={handleChange}
            required
            className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </label>
      </div>

      <h3 className="text-2xl font-semibold mt-10 mb-6 text-emerald-700">📄 Additional Info (Optional)</h3>

      <label className="block mb-6">
        Any Special Instructions?
        <textarea
          name="specialInstructions"
          value={formData.specialInstructions}
          onChange={handleChange}
          rows={4}
          className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </label>

      <button
        type="submit"
        className="w-full py-4 bg-emerald-600 text-white font-semibold rounded-md hover:bg-emerald-700 transition-colors"
      >
        Submit
      </button>
    </form>
  );
}
