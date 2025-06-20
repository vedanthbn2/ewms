"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import {
  getEmail,
  getPhoneNumber,
  getUserID,
  getfullname,
  isAuthenticated,
} from "../../sign-in/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Brand {
  brand: string;
  models: string[];
}

interface Location {
  lat: number;
  lng: number;
  address: string;
}

interface BookingData {
  userId: string;
  userEmail: string;
  recycleItem: string;
  recycleItemPrice: number;
  pickupDate: string;
  pickupTime: string;
  fullName: string;
  address: string;
  phone: number;
  location?: Location;
  imeiNumber?: string;
  deviceCondition?: string;
  accessoriesIncluded?: string[];
  specialPickupInstructions?: string;
  alternateContactNumber?: string;
  donateForCharity?: string;
  preferredPaymentMode?: string;
  declarationConfirmed?: boolean;
  deviceImage?: File | null;
}

const Smartphone: React.FC = () => {
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [recycleItemPrice, setRecycleItemPrice] = useState<number>();
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [brands, setBrands] = useState<Brand[]>([]);
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState<Location | null>(null);
  const [models, setModels] = useState<string[]>([]);
  const [bookingData, setBookingData] = useState<BookingData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // New state variables for additional fields
  const [imeiNumber, setImeiNumber] = useState("");
  const [deviceCondition, setDeviceCondition] = useState("");
  const [accessoriesIncluded, setAccessoriesIncluded] = useState<string[]>([]);
  const [deviceImage, setDeviceImage] = useState<File | null>(null);
  const [preferredContactNumber, setPreferredContactNumber] = useState(getPhoneNumber() || "");
  const [alternateContactNumber, setAlternateContactNumber] = useState("");
  const [specialPickupInstructions, setSpecialPickupInstructions] = useState("");
  const [donateForCharity, setDonateForCharity] = useState("");
  const [preferredPaymentMode, setPreferredPaymentMode] = useState("");
  const [declarationConfirmed, setDeclarationConfirmed] = useState(false);

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            // In production, replace with your Google Maps API key
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=YOUR_API_KEY`
            );
            const data = await response.json();
            if (data.results && data.results[0]) {
              setLocation({
                lat: latitude,
                lng: longitude,
                address: data.results[0].formatted_address
              });
              setAddress(data.results[0].formatted_address);
            }
          } catch (error) {
            console.error("Error getting address:", error);
            toast.error("Could not get address from location", { autoClose: 3000 });
          } finally {
            setIsGettingLocation(false);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Could not get your location", { autoClose: 3000 });
          setIsGettingLocation(false);
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser", { autoClose: 3000 });
      setIsGettingLocation(false);
    }
  };

  const handleBrandChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const brand = event.target.value;
    setSelectedBrand(brand);
    setSelectedModel("");

    if (brand) {
      const selectedBrand = brands.find((b) => b.brand === brand);
      if (selectedBrand) {
        setModels(selectedBrand.models);
      }
    }
  };

  const handleAccessoryChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    if (checked) {
      setAccessoriesIncluded([...accessoriesIncluded, value]);
    } else {
      setAccessoriesIncluded(accessoriesIncluded.filter((item) => item !== value));
    }
  };

  const currentDate = new Date().toISOString().split("T")[0];

  return (
    <div className="container mx-auto p-8">
      <ToastContainer />
      <h1 className="text-4xl font-bold mb-6 p-6 text-center">
        📱 Smartphone Recycling Request Form
      </h1>
      <form
        className="grid grid-cols-1 md:grid-cols-2 mx-8 md:mx-0 gap-6 justify-center"
        onSubmit={(e) => {
          e.preventDefault();
          // handleSubmit will be added in next part
        }}
      >
        {/* Device Details Section */}
        <fieldset className="md:col-span-2 border p-4 rounded mb-6">
          <legend className="text-xl font-semibold mb-4">📄 Device Details:</legend>

          <div className="mb-4">
            <label htmlFor="brand" className="block text-gray-700 mb-2">
              Brand:
            </label>
            <select
              id="brand"
              className="w-full p-2 border rounded"
              value={selectedBrand}
              onChange={handleBrandChange}
              required
            >
              <option value="">Select Brand</option>
              {brands.map((brand) => (
                <option key={brand.brand} value={brand.brand}>
                  {brand.brand}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="model" className="block text-gray-700 mb-2">
              Model:
            </label>
            <input
              type="text"
              id="model"
              className="w-full p-2 border rounded"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              required
            />
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default Smartphone;
