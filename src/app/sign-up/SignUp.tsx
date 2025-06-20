import React, { useState, ChangeEvent } from "react";
import { toast, ToastContainer } from "react-toastify";
import Link from "next/link";

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [role, setRole] = useState<"user" | "receiver">("user");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPasswordMatch(true); // Reset password match error on input change
    setFormData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRoleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRole(e.target.value as "user" | "receiver");
  };

  const register = async () => {
    console.log('Register function called');
    if (formData.password !== formData.confirmPassword) {
      console.log('Password and confirm password do not match');
      setPasswordMatch(false);
      return;
    }

    try {
      console.log('Sending registration request...');
      const apiUrl = role === 'user' ? '/api/users' : '/api/receivers';

      const names = formData.fullName.trim().split(" ");
      const firstName = names[0];
      const lastName = names.length > 1 ? names.slice(1).join(" ") : "";

      const requestBody = {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phoneNumber,
        password: formData.password,
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      console.log('Waiting for response...');
      let result;
      try {
        result = await response.json();
      } catch (jsonError) {
        console.error('Error parsing JSON:', jsonError);
        result = null;
      }
      console.log('Registration result:', result);
      if (response.ok && result && result.success) {
        // Save fullname to localStorage for later use
        localStorage.setItem("fullname", formData.fullName);
        toast.success(`${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully. You can now login.`);
        setFormData({
          fullName: "",
          email: "",
          phoneNumber: "",
          password: "",
          confirmPassword: "",
        });
        console.log('Navigating to sign-in page...');
        // Delay navigation to allow toast to show
        setTimeout(() => {
          window.location.href = "/sign-in?email=" + encodeURIComponent(formData.email);
        }, 1500);
      } else {
        if (result && result.error === 'already signup') {
          toast.error("Email ID already used. Please use a different email.");
        } else if (result && result.error) {
          toast.error("Registration failed: " + result.error);
        } else {
          toast.error("Registration failed: " + response.statusText);
        }
      }
    } catch (error: any) {
      console.error('Error in registration:', error);
      toast.error("Registration failed: " + (error.message || error.toString()));
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="my-3 text-center">
        <span className=" text-4xl font-bold">Welcome to Elocate</span>
        <span className="font-light text-gray-400 mb-4">
          Please enter your details to register
        </span>
      </div>

      <div className="mx-auto w-4/5 md:w-256 h-[90vh] md:h-[70vh]">
        <div className="relative flex flex-col md:flex-row p-6 bg-white shadow-2xl rounded-2xl">
          <div className="flex flex-col justify-center p-4 md:w-1/2">
            <div className="py-4">
              <span className="mb-2 text-md">Role</span>
              <div className="flex space-x-4">
                <label>
                  <input
                    type="radio"
                    name="role"
                    value="user"
                    checked={role === "user"}
                    onChange={handleRoleChange}
                  />
                  User
                </label>
                <label>
                  <input
                    type="radio"
                    name="role"
                    value="receiver"
                    checked={role === "receiver"}
                    onChange={handleRoleChange}
                  />
                  Receiver
                </label>
              </div>
            </div>
            <div className="py-4">
              <span className="mb-2 text-md">Email</span>
              <input
                type="text"
                className="w-full p-2 px-4 sign-field rounded-md placeholder:font-light placeholder:text-gray-500"
                name="email"
                id="email"
                placeholder="Email"
                onChange={handleInputChange}
                value={formData.email}
                required
              />
            </div>
            <div className="py-4">
              <span className="mb-2 text-md">Password</span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder="Password"
                className="w-full p-2 sign-field rounded-md placeholder:font-light placeholder:text-gray-500"
                onChange={handleInputChange}
                value={formData.password}
                required
              />
            </div>
          </div>

          <div className="flex flex-col justify-center p-4 md:w-1/2">
            <div className="py-4">
              <span className="mb-2 text-md">Phone Number</span>
              <input
                type="text"
                className="w-full p-2 px-4 sign-field rounded-md placeholder:font-light placeholder:text-gray-500"
                name="phoneNumber"
                id="phoneNumber"
                placeholder="Phone Number"
                onChange={handleInputChange}
                value={formData.phoneNumber}
                required
              />
            </div>
            <div className="py-4">
              <span className="mb-2 text-md">Full Name</span>
              <input
                type="text"
                className="w-full p-2 sign-field rounded-md placeholder:font-light placeholder:text-gray-500"
                name="fullName"
                id="fullName"
                placeholder="Full Name"
                onChange={handleInputChange}
                value={formData.fullName}
                required
              />
            </div>
            <div className="py-4">
              <span className="mb-2 text-md">Confirm Password</span>
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                id="confirmPassword"
                placeholder="Confirm Password"
                className="w-full p-2 sign-field rounded-md placeholder:font-light placeholder:text-gray-500"
                onChange={handleInputChange}
                value={formData.confirmPassword}
                required
              />
            </div>
          </div>
        </div>
        <div className="flex justify-between py-4">
          <label className="flex text-xl">
            <input
              type="checkbox"
              name="ch"
              id="ch"
              placeholder="checkbox"
              className="ml-8 p-1"
              onClick={togglePasswordVisibility}
            />
          </label>
          <span className="md:-ml-120"> Show Password</span>
          <Link href="/forget-password" className="font-bold text-black">
            Forgot Password?
          </Link>
        </div>
        {!passwordMatch && (
          <div className="text-red-600 text-sm">
            Password and Confirm Password do not match.
          </div>
        )}
        <button
          type="button"
          className="w-full bg-black mt-4 text-white p-2 rounded-lg mb-6 hover:bg-emerald-400 hover:text-black hover:border hover:border-gray-300"
          onClick={register}
        >
          Sign Up
        </button>

        <div className="text-center text-gray-400">
          Already have an account?
          <Link
            href="/sign-in"
            className="font-bold text-black hover:text-emerald-300"
          >
            Sign In
          </Link>
        </div>
      </div>
    </>
  );
};

export default SignUp;
