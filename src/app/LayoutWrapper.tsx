"use client";

import Navbar from "./Header/Navbar";
import Footer from "./Footer/Footer";
import { usePathname } from "next/navigation";

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  return (
    <>
      <Navbar />
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <main style={{ flex: 1 }}>
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default LayoutWrapper;
