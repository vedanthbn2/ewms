"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getEmail,
  getfullname,
  isAuthenticated,
  getUser,
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
  recycleItemPrice?: number;
  pickupDate: string;
  pickupTime: string;
  fullName: string;
  category?: string;
  address: string;
  phone: number;
  location?: Location;
  deviceCondition?: string;
  accessories?: string[];
  deviceImageUrl?: string;
  preferredContactNumber?: string;
  alternateContactNumber?: string;
  specialInstructions?: string;
  declarationChecked?: boolean;
  status?: string;
  receiverEmail?: string;
  receiverPhone?: string;
  receiverName?: string;
  model?: string;
}

const Smartphone: React.FC = () => {
  const [selectedBrand, setSelectedBrand] = useState("");
  const [modelInput, setModelInput] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [brands, setBrands] = useState<Brand[]>([]);
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState<Location | undefined>(undefined);
  const [bookingData, setBookingData] = useState<BookingData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const [deviceCondition, setDeviceCondition] = useState("");
  const [accessories, setAccessories] = useState<string[]>([]);
  const [deviceImage, setDeviceImage] = useState<File | null>(null);
  const [preferredContactNumber, setPreferredContactNumber] = useState("");
  const [alternateContactNumber, setAlternateContactNumber] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [declarationChecked, setDeclarationChecked] = useState(false);

  const [fullNameInput, setFullNameInput] = useState("");

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
                address: data.results[0].formatted_address,
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

  const handleBrandChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const brand = event.target.value;
    setSelectedBrand(brand);
  };

  const handleAccessoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    if (checked) {
      setAccessories((prev) => [...prev, value]);
    } else {
      setAccessories((prev) => prev.filter((acc) => acc !== value));
    }
  };

  useEffect(() => {
    const fetchBrandsAndModels = () => {
      const brandsData: Brand[] = [
        {
          brand: "Samsung",
          models: ["Galaxy S21", "Galaxy S20", "Galaxy Note 20", "Galaxy A52", "Galaxy M32"],
        },
        {
          brand: "Apple",
          models: ["iPhone 13", "iPhone 12", "iPhone SE", "iPhone 11", "iPhone XR"],
        },
        {
          brand: "Xiaomi",
          models: ["Redmi Note 10", "Mi 11X", "Poco X3", "Redmi 9", "Mi 10T"],
        },
        {
          brand: "OnePlus",
          models: ["OnePlus 9 Pro", "OnePlus 9", "OnePlus 8T", "OnePlus Nord", "OnePlus 8"],
        },
        {
          brand: "Realme",
          models: ["Realme 8 Pro", "Realme Narzo 30 Pro", "Realme 7", "Realme C11", "Realme X7 Max"],
        },
        {
          brand: "Vivo",
          models: ["Vivo V21", "Vivo Y73", "Vivo X60 Pro", "Vivo S1 Pro", "Vivo Y20G"],
        },
        {
          brand: "OPPO",
          models: ["OPPO F19 Pro", "OPPO Reno 5 Pro", "OPPO A74", "OPPO A53", "OPPO Find X3 Pro"],
        },
        {
          brand: "Nokia",
          models: ["Nokia 5.4", "Nokia 3.4", "Nokia 8.3", "Nokia 2.4", "Nokia 7.2"],
        },
        {
          brand: "Motorola",
          models: ["Moto G60", "Moto G40 Fusion", "Moto G30", "Moto G9 Power", "Moto E7 Power"],
        },
      ];

      setBrands(brandsData);
    };
    fetchBrandsAndModels();
  }, []);

  const email = getEmail();
  const fullname = getfullname() || getUser()?.fullname || "";

  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());

  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const authStatus = isAuthenticated();
      setIsLoggedIn(authStatus);
      if (!authStatus) {
        router.push("/sign-in?message=signin to recycle");
        toast.error("Please login to book a facility", { autoClose: 3000 });
      }
    };

    checkAuth();
    const handleStorageChange = () => checkAuth();
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleSubmit = async () => {
    const model = selectedBrand + " " + modelInput;
    const user = getUser();
    const userId = user ? user.id : "";
    const userRole = user ? user.role : "user";

    console.log("Form values:", {
      model,
      pickupDate,
      pickupTime,
      fullname,
      preferredContactNumber,
      alternateContactNumber,
      address,
      deviceCondition,
      accessories,
      specialInstructions,
      declarationChecked,
      email,
      userId,
      userRole,
    });

    if (isLoggedIn) {
      if (
        model &&
        pickupDate &&
        pickupTime &&
        fullname &&
        preferredContactNumber &&
        address &&
        deviceCondition &&
        declarationChecked &&
        email &&
        userId
      ) {
        let imageUrl = "";
        if (deviceImage) {
          const formData = new FormData();
          formData.append("file", deviceImage);
          try {
            const uploadResponse = await fetch("/api/uploadImage", {
              method: "POST",
              body: formData,
            });
            const uploadData = await uploadResponse.json();
            if (uploadData.success) {
              imageUrl = uploadData.url;
            } else {
              toast.error("Image upload failed");
            }
          } catch (error) {
            console.error("Image upload error:", error);
            toast.error("Image upload error");
          }
        }

        const newBooking: BookingData = {
          userId: userId,
          userEmail: email,
          recycleItem: model,
          pickupDate,
          pickupTime,
          fullName: fullname,
          category: "smartphone",
          address,
          phone: Number(preferredContactNumber),
          location: location,
          deviceCondition,
          accessories: accessories.length > 0 ? accessories : undefined,
          deviceImageUrl: imageUrl,
          preferredContactNumber,
          alternateContactNumber,
          specialInstructions,
          declarationChecked,
          status: "pending",
          receiverEmail: "",
          receiverPhone: "",
          receiverName: "",
          model: model,
        };

        setBookingData([...bookingData, newBooking]);
        setIsLoading(true);

        try {
          const response = await fetch("/api/recyclingRequests", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-user-id": userId,
              "x-user-role": userRole,
            },
            body: JSON.stringify(newBooking),
          });

          const responseData = await response.json();
          console.log("API response:", responseData);

          if (response.ok) {
            toast.success("Submitted successfully!", { autoClose: 3000 });
            setSelectedBrand("");
            setModelInput("");
            setPickupDate("");
            setPickupTime("");
            setAddress("");
            setDeviceCondition("");
            setAccessories([]);
            setDeviceImage(null);
            setPreferredContactNumber("");
            setAlternateContactNumber("");
            setSpecialInstructions("");
            setDeclarationChecked(false);
            router.push("/my-requests");
          } else {
            toast.error(`Error: ${responseData.error || "Failed to submit data"}`, {
              autoClose: 5000,
            });
          }
        } catch (error) {
          console.error("Error:", error);
          toast.error("Error submitting data.", { autoClose: 3000 });
        } finally {
          setIsLoading(false);
        }
      } else {
        const missingFields = [];
        if (!model) missingFields.push("brand and model");
        if (!pickupDate) missingFields.push("pickup date");
        if (!pickupTime) missingFields.push("pickup time");
        if (!fullname) missingFields.push("full name");
        if (!preferredContactNumber) missingFields.push("preferred contact number");
        if (!address) missingFields.push("address");
        if (!deviceCondition) missingFields.push("device condition");
        if (!declarationChecked) missingFields.push("declaration confirmation");
        if (!email) missingFields.push("email");
        if (!userId) missingFields.push("user ID");

        toast.error(`Please fill in: ${missingFields.join(", ")}`, { autoClose: 5000 });
      }
    } else {
      router.push("/sign-in?message=signin to recycle");
      toast.error("Please Login to book a facility", { autoClose: 3000 });
    }
  };

  if (isLoading) {
    return (
      <div className="loader-container">
        <div className="loader" />
        <div className="loading-text">Submitting...</div>
      </div>
    );
  }

  const currentDate = new Date().toISOString().split("T")[0];

  return (
    <div className="container mx-auto p-8">
      <ToastContainer />
      <h1 className="text-4xl font-bold mb-6 p-6 text-center">Smartphone Recycling Request Form</h1>
      <form
        className="grid grid-cols-1 md:grid-cols-2 mx-8 md:mx-0 gap-4 justify-center"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        {/* Device Details Section */}
        <div className="md:col-span-2">
          <h2 className="text-2xl font-semibold mb-4">Device Details:</h2>
        </div>

        <div className="mb-4" style={{ height: '1cm' }}>
          <label className="block text-gray-700 mb-2" htmlFor="brand">
            Brand
          </label>
          <select
            id="brand"
            className="w-full p-2 border rounded bg-white"
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

        <div className="mb-4" style={{ height: '1cm' }}>
          <label className="block text-gray-700 mb-2" htmlFor="model">
            Model
          </label>
          <input
            type="text"
            id="model"
            className="w-full p-2 border rounded bg-white"
            value={modelInput}
            onChange={(e) => setModelInput(e.target.value)}
            placeholder="Enter Model"
            required
          />
        </div>

        <div className="mb-4" style={{ height: '1cm' }}>
          <label className="block text-gray-700 mb-2" htmlFor="deviceCondition">
            Device Condition
          </label>
          <select
            id="deviceCondition"
            className="w-full p-2 border rounded bg-white"
            value={deviceCondition}
            onChange={(e) => setDeviceCondition(e.target.value)}
            required
          >
            <option value="">Select Condition</option>
            <option value="Like New">Like New</option>
            <option value="Working but damaged">Working but damaged</option>
            <option value="Not working">Not working</option>
          </select>
        </div>

        {/* Accessories Included section removed as per user request */}

        <div className="mb-4" style={{ height: '1cm' }}>
          <label className="block text-gray-700 mb-2" htmlFor="deviceImage">
            Upload Device Image (Optional)
          </label>
          <input
            type="file"
            id="deviceImage"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setDeviceImage(e.target.files[0]);
              } else {
                setDeviceImage(null);
              }
            }}
          className="w-full bg-white"
          />
        </div>

        {/* Pickup & Contact Details Section */}
        <div className="md:col-span-2">
          <h2 className="text-2xl font-semibold mb-4">Pickup & Contact Details:</h2>
        </div>

        <div className="mb-4" style={{ height: '1cm' }}>
          <label className="block text-gray-700 mb-2" htmlFor="pickupDate">
            Pickup Date
          </label>
          <input
            type="date"
            id="pickupDate"
            className="w-full p-2 border rounded bg-white"
            min={currentDate}
            value={pickupDate}
            onChange={(e) => setPickupDate(e.target.value)}
            required
          />
        </div>

        <div className="mb-4" style={{ height: '1cm' }}>
          <label className="block text-gray-700 mb-2" htmlFor="pickupTime">
            Pickup Time
          </label>
          <input
            type="time"
            id="pickupTime"
            className="w-full p-2 border rounded bg-white"
            value={pickupTime}
            onChange={(e) => setPickupTime(e.target.value)}
            required
          />
        </div>

        <div className="mb-4" style={{ height: '1cm' }}>
          <label className="block text-gray-700 mb-2" htmlFor="address">
            Pickup Address
          </label>
          <textarea
            id="address"
          className="w-full p-2 border rounded mb-2 bg-white"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={getCurrentLocation}
            disabled={isGettingLocation}
            className="bg-blue-500 text-white py-1 px-3 rounded text-sm hover:bg-blue-600 transition"
          >
            {isGettingLocation ? "Getting Location..." : "Use Current Location"}
          </button>
          {location && (
            <div className="mt-2 text-sm text-green-600">
              Location captured: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
            </div>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="preferredContactNumber">
            Preferred Contact Number
          </label>
          <input
            type="tel"
            id="preferredContactNumber"
            className="w-full p-2 border rounded bg-white"
            value={preferredContactNumber}
            onChange={(e) => setPreferredContactNumber(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="alternateContactNumber">
            Alternate Contact Number (Optional)
          </label>
          <input
            type="tel"
            id="alternateContactNumber"
            className="w-full p-2 border rounded bg-white"
            value={alternateContactNumber}
            onChange={(e) => setAlternateContactNumber(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="specialInstructions">
            Special Pickup Instructions
          </label>
          <textarea
            id="specialInstructions"
            className="w-full p-2 border rounded bg-white"
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            placeholder="e.g., Call before 30 min arrival"
          />
        </div>

        {/* Declaration Section */}
        <div className="md:col-span-2 mb-4" style={{ height: '1cm' }}>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={declarationChecked}
              onChange={(e) => setDeclarationChecked(e.target.checked)}
              required
              className="mr-2"
            />
            I confirm that this device is owned by me and I have the right to recycle it.
          </label>
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2 flex justify-center">
          <button
            type="submit"
            className="bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700 transition"
          >
            Submit Recycling Request
          </button>
        </div>
      </form>
    </div>
  );
};

export default Smartphone;
