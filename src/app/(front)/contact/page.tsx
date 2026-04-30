"use client";
import Navbar from "@/components/Navbar";
import Contact from "@/components/Contact";
import Partners from "@/components/Partners";
import Footer from "@/components/Footer";

export default function ContactPage() {
  return (
    <main>
      <Navbar />
      <div className="pt-24">
        <Contact />
        <Partners />
      </div>
      <Footer />
    </main>
  );
}
