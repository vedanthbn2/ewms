"use client";
import React, { useState, useEffect } from "react";
import { IonIcon } from "@ionic/react";
import {
  location,
  call,
  mail,
  logoLinkedin,
  logoTwitter,
  logoInstagram,
  logoWhatsapp,
} from "ionicons/icons";
import Link from "next/link";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";
import { getUser, getfullname, getEmail, getPhoneNumber } from "../sign-in/auth";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    message: "",
  });

  const [adminResponse, setAdminResponse] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);

  // New state for messages modal and user messages
  const [showMessagesModal, setShowMessagesModal] = useState(false);
  const [userMessages, setUserMessages] = useState<
    {
      _id: string;
      name: string;
      email: string;
      phone: string;
      message: string;
      adminResponse: string;
      createdAt: string;
    }[]
  >([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const currentUser = getUser();
    setUser(currentUser);
  }, [mounted]);

  useEffect(() => {
    if (!mounted || !user) return;
    // Fetch admin response for the logged-in user
    const fetchAdminResponse = async () => {
      try {
        const response = await axios.get(`/api/contactus/response?email=${user.email}`);
        if (response.data && response.data.adminResponse) {
          setAdminResponse(response.data.adminResponse);
        }
      } catch (error) {
        console.error("Error fetching admin response:", error);
      }
    };
    fetchAdminResponse();
  }, [user, mounted]);

  // Fetch user messages when modal is opened
  useEffect(() => {
    if (!showMessagesModal || !user) return;
    const fetchUserMessages = async () => {
      try {
        const response = await axios.get(`/api/contactus?email=${user.email}`);
        setUserMessages(response.data);
      } catch (error) {
        console.error("Error fetching user messages:", error);
        toast.error("Failed to load your messages.");
      }
    };
    fetchUserMessages();
  }, [showMessagesModal, user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const SendMsg = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (!formData.message.trim()) {
      toast.error("Message is required.");
      return;
    }

    const fullname = getfullname();
    const email = getEmail();
    const phoneNumber = getPhoneNumber();

    if (!fullname || !email || !phoneNumber) {
      toast.error("Please complete your profile with name, email, and phone before sending a message.");
      return;
    }

    try {
      const dataToSend = {
        name: fullname,
        email: email,
        phone: phoneNumber,
        message: formData.message,
      };

      await axios.post("/api/contactus", dataToSend);
      setFormData({
        message: "",
      });
      toast.success("Message Received! Our team will respond shortly.");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("We encountered an issue. Please try again or email us directly.");
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <>
      <Head>
        <title>E-Waste - Connect With Our Sustainability Experts</title>
        <meta
          name="description"
          content="Have questions about e-waste management or our platform? Get in touch with ELocate's dedicated team for personalized assistance and information."
        />
      </Head>

      <div className="px-4 w-full py-16 lg:py-24 md:pb-32 md:container contactus-container">
        <ToastContainer
          className="text-2xl"
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />

        <div className="flex flex-col items-center justify-center px-10">
          <div className="text-black section-subtitle text-center font-bold text-2xl md:text-4xl 2xl:text-6xl uppercase tracking-widest teamHeadingText">
            —Connect With Us—
          </div>
          <div className="text-black text-center text-xl md:text-3xl mt-4">
            Partner with us in building a sustainable future for electronics
          </div>
          <p className="text-gray-600 text-center max-w-3xl mt-4 text-lg">
            Whether you have questions about our services, want to suggest a recycling facility, or need assistance with e-waste management, our dedicated team is here to help you make environmentally responsible choices.
          </p>
          {/* Messages button */}
          {/* Removed Messages button from here */}
          {/* Messages button moved inside the form after submit button */}
        </div>
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 justify-center gap-8 mt-10">
            {/* Section for sending a message */}
            <div className="p-6 rounded-md shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="md:text-4xl text-2xl text-center font-semibold py-4 mb-4">
                Reach Out to Our Team
              </h3>
              <form
                className="newsletter-form mb-0 mx-auto md:mb-4"
                onSubmit={SendMsg}
              >
                {/* Removed Your Name, Email Address, and Phone Number fields as per request */}
                <div className="mb-6">
                  <label
                    htmlFor="message"
                    className="block text-gray-800 font-semibold mb-2 text-xl"
                  >
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="border rounded-md py-3 text-xl px-4 w-full resize-none focus:outline-none focus:ring focus:border-blue-300 bg-white"
                    placeholder="How can we assist with your e-waste management needs?"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="bg-emerald-500 text-white font-bold py-3 px-6 btn btn-secondary hover:bg-white-700 transition-colors duration-300"
                  >
                    Send Your Message
                  </button>
                  {user && (
                    <button
                      onClick={() => setShowMessagesModal(true)}
                      className="bg-emerald-500 text-white font-bold py-2 px-6 btn btn-secondary hover:bg-emerald-700 transition-colors duration-300"
                    >
                      Messages
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Section for contact information */}
            <div className="p-6 rounded-md shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="md:text-4xl text-2xl text-center font-semibold py-4 mb-4">
                Direct Contact Information
              </h3>
              <ul className="footer footer-list space-y-6">
                <li className="footer-item flex items-start">
                  <IonIcon
                    icon={location}
                    aria-hidden="true"
                    className="w-8 h-8 mt-1 mr-3"
                  ></IonIcon>
                  <div>
                    <h4 className="font-semibold text-xl mb-1">Our Location</h4>
                    <address className="contact-link address text-gray-600">
                      Main Office:PES UNIVERSITY,BENGALURU
                      <br />
                      KARNATAKA, India 560056
                    </address>
                  </div>
                </li>
                <li className="footer-item flex items-start">
                  <IonIcon
                    icon={call}
                    aria-hidden="true"
                    className="w-8 h-8 mt-1 mr-3"
                  ></IonIcon>
                  <div>
                    <h4 className="font-semibold text-xl mb-1">Phone Support</h4>
                    <Link
                      target="_blank"
                      rel="noopener noreferrer"
                      href="tel:+911234567890"
                      className="contact-link text-gray-600 hover:text-emerald-500 transition-colors duration-300"
                    >
                      +91 123 456 7890
                    </Link>
                    <p className="text-sm text-gray-500">Mon-Fri: 9AM to 6PM IST</p>
                  </div>
                </li>
                <li className="footer-item flex items-start">
                  <IonIcon
                    icon={mail}
                    aria-hidden="true"
                    className="w-8 h-8 mt-1 mr-3"
                  ></IonIcon>
                  <div>
                    <h4 className="font-semibold text-xl mb-1">Email Us</h4>
                    <Link
                      target="_blank"
                      rel="noopener noreferrer"
                      href="mailto:contact@elocate.com"
                      className="contact-link text-gray-600 hover:text-emerald-500 transition-colors duration-300"
                    >
                      recycleewaste@gmail.com
                    </Link>
                    <p className="text-sm text-gray-500">We respond within 24 hours</p>
                  </div>
                </li>
                <li className="footer-item mt-6">
                  <h4 className="font-semibold text-xl mb-3 text-center">
                    Connect on Social Media
                  </h4>
                  <ul className="social-list mb-4 md:mb-0 flex justify-center space-x-4">
                    <li>
                      <Link
                        target="_blank"
                        rel="noopener noreferrer"
                        href="/"
                        aria-label="Connect with ELocate on LinkedIn"
                        className="social-link bg-gray-100 hover:bg-emerald-100 transition-colors duration-300"
                      >
                        <IonIcon icon={logoLinkedin}></IonIcon>
                      </Link>
                    </li>
                    <li>
                      <Link
                        target="_blank"
                        rel="noopener noreferrer"
                        href="/"
                        aria-label="Follow ELocate on Instagram"
                        className="social-link bg-gray-100 hover:bg-emerald-100 transition-colors duration-300"
                      >
                        <IonIcon icon={logoInstagram}></IonIcon>
                      </Link>
                    </li>
                    <li>
                      <Link
                        target="_blank"
                        rel="noopener noreferrer"
                        href="/"
                        aria-label="Follow ELocate on Twitter"
                        className="social-link bg-gray-100 hover:bg-emerald-100 transition-colors duration-300"
                      >
                        <IonIcon icon={logoTwitter}></IonIcon>
                      </Link>
                    </li>
                    <li>
                      <Link
                        target="_blank"
                        rel="noopener noreferrer"
                        href="/"
                        aria-label="Contact ELocate on WhatsApp"
                        className="social-link bg-gray-100 hover:bg-emerald-100 transition-colors duration-300"
                      >
                        <IonIcon icon={logoWhatsapp}></IonIcon>
                      </Link>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Messages Modal */}
        {showMessagesModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto p-6 relative">
              <button
                onClick={() => setShowMessagesModal(false)}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold"
                aria-label="Close messages modal"
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold mb-4 text-center">Your Messages & Responses</h2>
              {userMessages.length === 0 ? (
                <p className="text-center text-gray-600">You have no messages yet.</p>
              ) : (
                <div className="space-y-4">
                  {userMessages.map((msg) => (
                    <div key={msg._id} className="border rounded-md p-4 shadow-sm">
                      <p className="font-semibold mb-1">Message:</p>
                      <p className="mb-2 whitespace-pre-wrap">{msg.message}</p>
                      <p className="font-semibold mb-1">Admin Response:</p>
                      <p className="mb-2 whitespace-pre-wrap">
                        {msg.adminResponse ? msg.adminResponse : "No response yet."}
                      </p>
                      <p className="text-sm text-gray-500 text-right">
                        Sent on: {new Date(msg.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ContactUs;
