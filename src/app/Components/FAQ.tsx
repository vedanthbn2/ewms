"use client";
import React, { useState } from "react";
import { Container, Row, Col } from "reactstrap";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";

const FAQ = () => {
    const faqData = [
        {
          question: "01] Quick & Convenient E-Waste Pickup",
          answer:
            "Schedule a pickup in just a few clicks. Our streamlined system ensures fast and hassle-free collection from your doorstep—whether you're a household, office, or business",
        },
        {
          question: "02] Smart Recycling Made Simple",
          answer:
            "We make responsible recycling easy. Just tell us what you’ve got, and we’ll take care of the rest—from pickup to proper processing at certified facilities.",
        },
        {
          question: "03] On-Demand Pickup Scheduling",
          answer:
            "Choose a time that works for you. Our flexible, on-demand scheduling makes it easy to book e-waste pickups around your routine—no waiting, no hassle.",
        },
        {
          question: "04] Real-Time Tracking & Updates",
          answer:
            "Stay in the loop from pickup to processing. Track your e-waste in real time and receive instant updates on its recycling journey.",
        },
        {
          question: "05] Eco-Friendly Logistics",
          answer:
            "We partner with green transport providers to reduce carbon emissions during every pickup and delivery, making your recycling efforts even more sustainable.",
        },
        
      ];
      

  const [activeQuestion, setActiveQuestion] = useState(null);

  const toggleQuestion = (index: any) => {
    if (activeQuestion === index) {
      setActiveQuestion(null);
    } else {
      setActiveQuestion(index);
    }
  };

  return (
    <section className="md:mb-40">
      <Container >
        <Row>
          <Col>
            <h2 className="text-center text-3xl font-bold mb-2">Why You Should Recycle Your Electronics with E-Waste Recycling</h2>
            <p className="text-center text-gray-600 mb-8">Our services are designed to simplify your e-waste disposal experience</p>
            <div className="mt-8">
              {faqData.map((item, index) => (
                <div
                  className={`mb-6 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer ${
                    activeQuestion === index ? "bg-gray-50 active" : ""
                  }`}
                  key={index}
                  onClick={() => toggleQuestion(index)}
                >
                  <div className="flex items-center justify-between text-center gap-12">
                    <h4 className="text-2xl font-bold">
                      {item.question}
                      <span className="text-xl font-semibold ">
                        {activeQuestion === index ? (
                          <RiArrowDropUpLine />
                        ) : (
                          <RiArrowDropDownLine />
                        )}
                      </span>
                    </h4>
                  </div>
                  {activeQuestion === index && (
                    <p className="text-xl mt-4 leading-relaxed">{item.answer}</p>
                  )}
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default FAQ;
