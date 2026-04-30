"use client";
import Navbar from "@/components/Navbar";
import News from "@/components/News";
import Footer from "@/components/Footer";

export default function NewsPage() {
  return (
    <main>
      <Navbar />
      <div className="pt-24">
        <News />
      </div>
      <Footer />
    </main>
  );
}
