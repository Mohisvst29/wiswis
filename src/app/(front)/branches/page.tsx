"use client";
import Navbar from "@/components/Navbar";
import Branches from "@/components/Branches";
import Footer from "@/components/Footer";

export default function BranchesPage() {
  return (
    <main>
      <Navbar />
      <div className="pt-24">
        <Branches />
      </div>
      <Footer />
    </main>
  );
}
