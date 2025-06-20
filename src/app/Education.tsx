"use client";
import React from "react";
import Link from "next/link";

const Education = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6">E-Waste Education</h1>
      <p className="mb-4">
        Welcome to the E-Waste Education section. Here you will find valuable resources and information about electronic waste management.
      </p>
      <Link href="/recycle" className="text-emerald-600 hover:text-emerald-800">
        Learn more about recycling e-waste
      </Link>
    </div>
  );
};

export default Education;
