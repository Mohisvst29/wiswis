"use client";
import Navbar from "@/components/Navbar";
import Services from "@/components/Services";
import Footer from "@/components/Footer";

export default function ServicesPage() {
  return (
    <main>
      <Navbar />
      <div className="pt-24">
        <Services />
      </div>
      <Footer />
    </main>
  );
}
