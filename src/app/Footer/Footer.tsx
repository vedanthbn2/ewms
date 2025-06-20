"use client";
import React, { useState } from "react";
import { IonIcon } from "@ionic/react";
import { paperPlane } from "ionicons/icons";
import { location } from "ionicons/icons";
import { call } from "ionicons/icons";
import { mail } from "ionicons/icons";
import { logoLinkedin } from "ionicons/icons";
import { logoTwitter } from "ionicons/icons";
import { logoInstagram } from "ionicons/icons";
import { logoWhatsapp } from "ionicons/icons";
import logo from "../../assets/ELocate-s.png";
import Link from "next/link";
import Image from "next/image";
import emailjs from "@emailjs/browser";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Footer = () => {
  const [formData, setFormData] = useState({
    email: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    } as Pick<typeof formData, keyof typeof formData>);
    ;
  };

  const SendMsg = (e: React.FormEvent) => {
    e.preventDefault();
    const templateParams = {
      email: formData.email,
    };

    emailjs
      .send(
        "service_jqn5flv",
        "template_ppph1w9",
        templateParams,
        "ddYcz13MvW01UFF5u"
      )
      .then((result: { text: any }) => {
        setFormData({
          email: "",
        });
        toast.success("Subscription Confirmed! Welcome to the ELocate community.");
      })
      .catch((error: { text: any }) => {
        toast.error("Unable to process your request. Please try again.");
      });
  };
  return (
    <footer className="footer projects shadow-2xl">
      <div className="footer-top md:section">
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
        <div className="container flex justify-start">
        </div>
      </div>
      <p className="text-center font-bold my-4 px-4">
        Empowering responsible e-waste disposal by connecting users with recycling partners — simplifying the journey toward a cleaner, greener future.
      </p>
      <div className="social-icons-container flex justify-center space-x-6 my-4">
        <span
          aria-label="Connect with ELocate on LinkedIn"
          className="social-link"
        >
          <IonIcon icon={logoLinkedin} />
        </span>
        <span
          aria-label="Follow ELocate on Instagram"
          className="social-link"
        >
          <IonIcon icon={logoInstagram} />
        </span>
        <span
          aria-label="Follow ELocate on Twitter"
          className="social-link"
        >
          <IonIcon icon={logoTwitter} />
        </span>
        <span
          aria-label="Contact ELocate on WhatsApp"
          className="social-link"
        >
          <IonIcon icon={logoWhatsapp} />
        </span>
      </div>
      <div className="footer-bottom">
        <div className="container">
        </div>
      </div>
    </footer>
  );
};

export default Footer;
