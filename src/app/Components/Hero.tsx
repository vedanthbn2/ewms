"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import hero from "../../assets/hero-banner.png";
import { IonIcon } from "@ionic/react";
import { play } from "ionicons/icons";

const solutions = [
  "Be a part of the solution, not the pollution",
  "Don’t Trash It, Recycle It!",
  "Dispose with purpose. Recycle with pride.",
];

const solutionVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

export default function HeroSection() {
  const [currentSolution, setCurrentSolution] = useState(solutions[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentIndex = solutions.indexOf(currentSolution);
      const nextIndex = (currentIndex + 1) % solutions.length;
      setCurrentSolution(solutions[nextIndex]);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentSolution]);

  return (
    <section className="section hero" id="home" aria-label="hero">
      <div
        className="w-full min-h-[100vh] flex items-start justify-center"
        style={{
          backgroundImage: "url('https://www.sswml.com/wp-content/uploads/2022/10/E-Waste-Wallpaper-1.jpg')",
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="hero-content text-center w-[65vw] pr-0 p-6 rounded-md text-white drop-shadow-lg flex flex-col justify-between h-full mx-auto">
          <div>
            <p
              className="mb-4 hero-subtitle has-before max-w-full mx-auto font-bold"
              style={{
                color: "#a6fbb2",
                fontSize: "150%",
                textShadow: "2px 2px 8px rgba(0, 0, 0, 0.9)",
              }}
            >
              One World. One Chance. Welcome to ELocate — Powering a Better Tomorrow.
            </p>

            <h1
              className="h1 hero-title font-bold max-w-full text-white text-5xl drop-shadow-lg"
              style={{ marginBottom: "12cm" }}
            >
              Your Reliable Solution for Safe and Smart E-Waste <span className="text-emerald-600">Disposal.</span>
            </h1>
          </div>

          <div>
            <p className="font-semibold mb-6 max-w-full text-emerald-600 text-xl drop-shadow-lg">
              E-Waste Dispose with purpose. Recycle with pride.
            </p>

            <p className="mb-8 max-w-full text-emerald-600 text-lg drop-shadow-lg">
              raise pickup requests, manage your e-waste, and build a cleaner, greener tomorrow. Together, let’s say goodbye to harmful dumping and hello to recycling.
            </p>

            <div className="flex flex-row md:flex-row items-center justify-center sm:space-y-0 md:space-x-4 mb-10">
              <Link href="/recycle" className="btn btn-primary mx-auto text-lg">
                Recycle Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
