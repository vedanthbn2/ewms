import React from "react";
import { FaRecycle, FaLeaf, FaUsers, FaGlobeAmericas, FaLightbulb } from "react-icons/fa";

const About = () => {
  return (
    <section className="bg-gradient-to-r from-green-100 via-green-50 to-white py-16 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-green-700 font-extrabold text-xl mb-3 tracking-widest uppercase">
          — Welcome to E-Waste —
        </p>

        <h1 className="text-5xl font-extrabold text-gray-900 mb-8 drop-shadow-md">
          Leading the Way in E-Waste Management & Sustainability
        </h1>

        <div className="space-y-16 text-left max-w-4xl mx-auto">
          {/* Section Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-green-200">
            <h2 className="flex items-center text-2xl font-bold text-green-800 mb-4">
              <FaGlobeAmericas className="mr-3 text-green-600" />
              India’s E-Waste Challenge:
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Over 1.71 million metric tons of e-waste are generated annually in India.</li>
              <li>Most of it is improperly disposed of, causing severe environmental and health hazards.</li>
              <li>Lack of reliable, certified e-waste collection and recycling centers adds to the crisis.</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 border border-green-200">
            <h2 className="flex items-center text-2xl font-bold text-green-800 mb-4">
              <FaLightbulb className="mr-3 text-green-600" />
              Why E-Waste Was Created:
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>To tackle the growing problem of electronic waste management in India.</li>
              <li>To make e-waste disposal accessible, safe, and hassle-free for individuals and businesses.</li>
              <li>To bridge the gap between consumers and certified e-waste facilities through a powerful digital platform.</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 border border-green-200">
            <h2 className="flex items-center text-2xl font-bold text-green-800 mb-4">
              <FaLeaf className="mr-3 text-green-600" />
              Environmental Impact:
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Prevents harmful substances like lead, mercury, and cadmium from polluting soil, water, and air.</li>
              <li>Reduces health risks to informal waste pickers and local communities.</li>
              <li>Promotes a circular economy by recovering valuable metals like gold, silver, copper, and rare earth elements.</li>
              <li>Reduces the demand for new resource extraction through reuse, refurbishing, and recycling.</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 border border-green-200">
            <h2 className="flex items-center text-2xl font-bold text-green-800 mb-4">
              <FaRecycle className="mr-3 text-green-600" />
              Key Benefits of Using E-Waste:
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Ensures responsible disposal of outdated and unused electronic devices.</li>
              <li>Helps users contribute to a cleaner, greener environment effortlessly.</li>
              <li>Encourages community participation through awareness campaigns and e-waste collection drives.</li>
              <li>Supports India’s goal of achieving a sustainable waste management system and eco-friendly urban living.</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 border border-green-200">
            <h2 className="flex items-center text-2xl font-bold text-green-800 mb-4">
              <FaUsers className="mr-3 text-green-600" />
              Our Vision:
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>To make responsible e-waste disposal a daily habit for every Indian household and business.</li>
              <li>To build an informed, conscious, and active community driving the e-waste management revolution.</li>
              <li>To create a greener, safer, and more sustainable future for coming generations.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
