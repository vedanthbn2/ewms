import React from "react";
import { FiSmartphone, FiHeadphones, FiTv } from "react-icons/fi";
import { GiWashingMachine } from "react-icons/gi";
import { RiFridgeFill } from "react-icons/ri";
import { FaLaptop } from "react-icons/fa";
import { MdOutlineDevicesOther } from "react-icons/md";
import Link from "next/link";
import Head from "next/head";

interface RecycleCardProps {
  itemName: string;
  description: string;
  recyclingProcess: string;
  specialInstructions: string;
  icon: React.ReactNode;
  benefits: string;
}

const Recycle: React.FC = () => {
  const recycleItems: RecycleCardProps[] = [
    {
      itemName: "Smartphone",
      description:
        "Responsibly recycle your outdated or non-functional smartphones and recover valuable materials while protecting the environment.",
      recyclingProcess: "",
      specialInstructions: "",
      benefits: "",
      icon: <FiSmartphone size={48} className="text-emerald-500" />,
    },
    {
      itemName: "Laptop",
      description:
        "Give your old laptops and computers a sustainable afterlife through our specialized electronics recycling program.",
      recyclingProcess:
        "We implement secure data destruction, component disassembly, circuit board processing, and proper management of LCD screens and batteries.",
      specialInstructions:
        "Back up important files, perform a secure wipe of all storage drives, and remove any external batteries before recycling.",
      benefits:
        "Recycling laptops can recover 95% of materials including valuable metals like gold, silver, and rare earth elements.",
      icon: <FaLaptop size={48} className="text-emerald-500" />,
    },
    {
      itemName: "Accessories",
      description:
        "Properly dispose of cables, chargers, headphones, keyboards, and other electronic accessories that accumulate over time.",
      recyclingProcess:
        "We meticulously sort accessories by material type, separate metal components, process plastic elements, and safely handle any hazardous materials.",
      specialInstructions:
        "Bundle similar accessories together for easier processing and ensure batteries are removed from wireless devices.",
      benefits:
        "Recycling accessories prevents toxic materials from entering landfills and reduces the need for virgin resource extraction.",
      icon: <FiHeadphones size={48} className="text-emerald-500" />,
    },
    {
      itemName: "Television",
      description:
        "Ensure your old TVs, monitors, and display devices are recycled in an environmentally responsible manner.",
      recyclingProcess:
        "Our specialized process includes screen separation, hazardous material containment, circuit board recovery, and plastic/metal segregation for optimal recycling.",
      specialInstructions:
        "Transport with screen facing down to prevent shattering. Include all cables, stands, and remote controls when possible.",
      benefits:
        "Proper TV recycling prevents lead, mercury, and flame retardants from contaminating soil and water resources.",
      icon: <FiTv size={48} className="text-emerald-500" />,
    },
    {
      itemName: "Refrigerator",
      description:
        "Dispose of refrigerators and freezers through our specialized large appliance recycling program that safely handles refrigerants.",
      recyclingProcess:
        "We carefully extract and properly dispose of refrigerants, recover insulation materials, separate and process metal components, and manage hazardous elements.",
      specialInstructions:
        "Clean and defrost the unit completely before recycling. Remove all food, shelving, and loose components.",
      benefits:
        "Proper refrigerator recycling prevents potent greenhouse gases from entering the atmosphere and recovers valuable metals and plastics.",
      icon: <RiFridgeFill size={48} className="text-emerald-500" />,
    },
    {
      itemName: "Other",
      description:
        "Recycle any electronic device not covered by other categories through our comprehensive e-waste management program.",
      recyclingProcess:
        "Every device undergoes proper assessment, disassembly, component sorting, material recovery, and environmentally sound disposal of non-recyclable parts.",
      specialInstructions:
        "If possible, include original packaging, manuals, and accessories for the most complete recycling process.",
      benefits:
        "Ensures that even unusual or uncommon electronic devices are properly handled and don't end up in landfills.",
      icon: <MdOutlineDevicesOther size={48} className="text-emerald-500" />,
    },
  ];

  return (
    <>
      <Head>
        <title>ELocate - Electronics Recycling Solutions</title>
        <meta
          name="description"
          content="Responsibly recycle your electronic devices with ELocate's specialized recycling programs for smartphones, laptops, TVs, refrigerators and more."
        />
      </Head>

      <div className="section container mx-auto px-4 recycle-container">
        <div className="text-center mb-16">
          <h2 className="text-4xl text-emerald-700 font-bold mb-4">
            Sustainable Electronics Recycling Solutions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the right recycling option for your electronic devices and contribute to a circular economy that preserves resources and protects our environment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recycleItems.map((item, index) => (
            <RecycleCard key={index} {...item} />
          ))}
        </div>
      </div>
    </>
  );
};

const RecycleCard: React.FC<RecycleCardProps> = ({
  itemName,
  description,
  recyclingProcess,
  specialInstructions,
  benefits,
  icon,
}) => {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <div className="bg-emerald-50 p-6 flex justify-center items-center">
        <div className="bg-white rounded-full p-4 shadow-sm">{icon}</div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-2xl font-bold mb-3 text-gray-800">{itemName}</h3>
        <p className="text-gray-600 mb-4">{description}</p>

        <div className="mb-4 flex-grow">
        </div>

        <Link
          href={`/recycle/${itemName.toLowerCase()}`}
          className="mt-auto w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-md text-center transition-colors duration-300 inline-block"
        >
          Recycle {itemName} Now
        </Link>
      </div>
    </div>
  );
};

export default Recycle;
