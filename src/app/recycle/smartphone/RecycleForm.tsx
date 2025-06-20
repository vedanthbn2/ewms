import React, { useState } from 'react';

const brands = [
  'Apple',
  'Samsung',
  'OnePlus',
  'Google',
  'Huawei',
  'Xiaomi',
  'Other',
];

const conditions = [
  'New',
  'Like New',
  'Good',
  'Fair',
  'Poor',
];

const RecycleForm: React.FC = () => {
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [condition, setCondition] = useState('');
  const [deviceImage, setDeviceImage] = useState<File | null>(null);
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [preferredContact, setPreferredContact] = useState('');
  const [alternateContact, setAlternateContact] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [ownershipConfirmed, setOwnershipConfirmed] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setDeviceImage(e.target.files[0]);
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setPickupAddress(`Lat: ${position.coords.latitude.toFixed(5)}, Lon: ${position.coords.longitude.toFixed(5)}`);
        setUseCurrentLocation(true);
      },
      () => {
        alert('Unable to retrieve your location');
      }
    );
  };

  import { useNotification } from "../../Components/NotificationContext";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownershipConfirmed) {
      alert('Please confirm ownership of the device.');
      return;
    }
    // Here you can add form submission logic, e.g., API call
    try {
      // Get user info from localStorage
      const userJSON = localStorage.getItem("user");
      const user = userJSON ? JSON.parse(userJSON) : null;
      if (!user) {
        alert("User not logged in");
        return;
      }
      // Example API call to submit the request
      const response = await fetch('/api/recyclingRequests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id,
          'x-user-role': user.role || 'user',
        },
        body: JSON.stringify({
          // Include form data here
          recycleItem: brand,
          model,
          deviceCondition: condition,
          pickupDate,
          pickupTime,
          address: pickupAddress,
          preferredContactNumber: preferredContact,
          alternateContactNumber: alternateContact,
          specialInstructions,
          status: 'Pending',
          userEmail: user.email || '',
          fullName: user.username || '',
          // Add other required fields
        }),
      });
      const data = await response.json();
      if (data.success) {
        setFormSubmitted(true);
        // Trigger notification refresh
        refreshNotifications();
      } else {
        alert('Failed to submit request: ' + data.error);
      }
    } catch (error) {
      alert('Error submitting request: ' + error);
    }
  };

  const { refreshNotifications } = useNotification();

  return (
    <div className="max-w-3xl mx-auto p-8 bg-gradient-to-r from-green-400 via-green-500 to-green-600 rounded-xl shadow-xl text-white font-sans">
      <h2 className="text-4xl font-extrabold mb-8 text-center drop-shadow-lg">Smartphone Recycling Request Form</h2>
      {formSubmitted ? (
        <div className="text-center text-yellow-100 font-semibold text-xl drop-shadow-md">
          Thank you! Your recycling request has been submitted.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          <fieldset className="bg-white bg-opacity-20 backdrop-blur-md border border-green-200 rounded-lg p-6 shadow-md">
            <legend className="text-2xl font-semibold mb-6 text-green-100">Device Details:</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="brand" className="block mb-2 font-semibold text-green-100">Brand</label>
                <select
                  id="brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  required
                  className="w-full rounded-md px-4 py-3 text-green-900 font-semibold focus:outline-none focus:ring-4 focus:ring-green-300"
                >
                  <option value="" disabled>Select Brand</option>
                  {brands.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="model" className="block mb-2 font-semibold text-green-100">Model</label>
                <input
                  type="text"
                  id="model"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="Enter Model"
                  required
                  className="w-full rounded-md px-4 py-3 text-green-900 font-semibold focus:outline-none focus:ring-4 focus:ring-green-300"
                />
              </div>
              <div>
                <label htmlFor="condition" className="block mb-2 font-semibold text-green-100">Device Condition</label>
                <select
                  id="condition"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  required
                  className="w-full rounded-md px-4 py-3 text-green-900 font-semibold focus:outline-none focus:ring-4 focus:ring-green-300"
                >
                  <option value="" disabled>Select Condition</option>
                  {conditions.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="deviceImage" className="block mb-2 font-semibold text-green-100">Upload Device Image (Optional)</label>
                <input
                  type="file"
                  id="deviceImage"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full rounded-md text-green-900 font-semibold"
                />
                {deviceImage && (
                  <p className="mt-2 text-green-100 font-semibold">{deviceImage.name}</p>
                )}
              </div>
            </div>
          </fieldset>

          <fieldset className="bg-white bg-opacity-20 backdrop-blur-md border border-green-200 rounded-lg p-6 shadow-md">
            <legend className="text-2xl font-semibold mb-6 text-green-100">Pickup & Contact Details:</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="pickupDate" className="block mb-2 font-semibold text-green-100">Pickup Date</label>
                <input
                  type="date"
                  id="pickupDate"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  required
                  className="w-full rounded-md px-4 py-3 text-green-900 font-semibold focus:outline-none focus:ring-4 focus:ring-green-300"
                />
              </div>
              <div>
                <label htmlFor="pickupTime" className="block mb-2 font-semibold text-green-100">Pickup Time</label>
                <input
                  type="time"
                  id="pickupTime"
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  required
                  className="w-full rounded-md px-4 py-3 text-green-900 font-semibold focus:outline-none focus:ring-4 focus:ring-green-300"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="pickupAddress" className="block mb-2 font-semibold text-green-100">Pickup Address</label>
                <textarea
                  id="pickupAddress"
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  placeholder="Enter pickup address"
                  required={!useCurrentLocation}
                  disabled={useCurrentLocation}
                  rows={3}
                  className="w-full rounded-md px-4 py-3 resize-none text-green-900 font-semibold focus:outline-none focus:ring-4 focus:ring-green-300"
                />
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  className="mt-3 inline-flex items-center px-5 py-3 bg-yellow-400 text-green-900 font-bold rounded-lg hover:bg-yellow-300 focus:outline-none focus:ring-4 focus:ring-yellow-300"
                >
                  Use Current Location
                </button>
              </div>
              <div>
                <label htmlFor="preferredContact" className="block mb-2 font-semibold text-green-100">Preferred Contact Number</label>
                <input
                  type="tel"
                  id="preferredContact"
                  value={preferredContact}
                  onChange={(e) => setPreferredContact(e.target.value)}
                  placeholder="Enter preferred contact number"
                  required
                  className="w-full rounded-md px-4 py-3 text-green-900 font-semibold focus:outline-none focus:ring-4 focus:ring-green-300"
                />
              </div>
              <div>
                <label htmlFor="alternateContact" className="block mb-2 font-semibold text-green-100">Alternate Contact Number (Optional)</label>
                <input
                  type="tel"
                  id="alternateContact"
                  value={alternateContact}
                  onChange={(e) => setAlternateContact(e.target.value)}
                  placeholder="Enter alternate contact number"
                  className="w-full rounded-md px-4 py-3 text-green-900 font-semibold focus:outline-none focus:ring-4 focus:ring-green-300"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="specialInstructions" className="block mb-2 font-semibold text-green-100">Special Pickup Instructions</label>
                <textarea
                  id="specialInstructions"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="e.g., Call before 30 min arrival"
                  rows={3}
                  className="w-full rounded-md px-4 py-3 resize-none text-green-900 font-semibold focus:outline-none focus:ring-4 focus:ring-green-300"
                />
              </div>
            </div>
          </fieldset>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="ownershipConfirmed"
              checked={ownershipConfirmed}
              onChange={(e) => setOwnershipConfirmed(e.target.checked)}
              className="h-5 w-5 text-yellow-400 focus:ring-yellow-300 border-green-300 rounded"
              required
            />
            <label htmlFor="ownershipConfirmed" className="ml-3 block text-yellow-100 font-semibold">
              I confirm that this device is owned by me and I have the right to recycle it.
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-4 mt-6 bg-yellow-400 text-green-900 font-extrabold rounded-lg hover:bg-yellow-300 focus:outline-none focus:ring-4 focus:ring-yellow-300"
          >
            Submit Recycling Request
          </button>
        </form>
      )}
    </div>
  );
};

export default RecycleForm;
