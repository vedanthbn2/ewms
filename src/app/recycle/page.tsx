"use client";
import React from "react";
import { motion } from "framer-motion";
import Recycle from "./Recycle";

const Page = () => {
  return (
<>
      <div className="min-h-screen flex flex-col justify-start">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
          className="pt-16 flex flex-col items-start justify-start"
        >
          <div className="w-full">
            <Recycle />
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Page;
