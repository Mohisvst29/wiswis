"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { H1, H2, H3, Text } from "@/components/ui/typography";
import { motion } from "framer-motion";

export default function DesignSystemPage() {
  return (
    <main className="min-h-screen bg-background text-foreground pb-20 font-sans">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 md:px-12 lg:px-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background -z-10" />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          <div className="inline-block px-4 py-1 mb-6 rounded-full border border-primary/30 bg-primary/10 text-primary font-medium tracking-wide text-sm">
            WISWIS DESIGN SYSTEM
          </div>
          <H1 className="mb-6 font-['Inter',sans-serif]">Premium <span className="gradient-text">Cinematic</span><br/>Energy Theme</H1>
          <Text className="max-w-2xl text-xl">
            Inspired by Aramco, ADNOC, and ENOC. Strong, bold, industrial UI components built for high-performance petroleum services.
          </Text>
        </motion.div>
      </section>

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 space-y-32">
        {/* Colors */}
        <section>
          <H2 className="mb-8 premium-border pb-4 inline-block font-['Inter',sans-serif]">Color Palette</H2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Primary Red", var: "bg-[#8B0000]", text: "text-white" },
              { name: "Energy Orange", var: "bg-[#FF6B00]", text: "text-white" },
              { name: "Deep Background", var: "bg-[#080808]", text: "text-white border border-white/10" },
              { name: "Glass Card", var: "glass-card", text: "text-white" },
            ].map((color, i) => (
              <div key={i} className="space-y-3">
                <div className={`h-32 rounded-xl ${color.var} flex items-end p-4 shadow-lg transition-transform hover:scale-105`}>
                  <span className={`font-mono text-sm font-bold ${color.text}`}>{color.name}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Typography */}
        <section>
          <H2 className="mb-8 premium-border pb-4 inline-block font-['Inter',sans-serif]">Typography Scale</H2>
          <div className="space-y-8 glass-card p-8 rounded-2xl">
            <div>
              <span className="text-primary text-sm font-bold tracking-widest uppercase mb-2 block">Heading 1 / 5xl-7xl</span>
              <H1 className="font-['Inter',sans-serif]">Cinematic Impact</H1>
            </div>
            <div className="h-px w-full bg-white/5" />
            <div>
              <span className="text-primary text-sm font-bold tracking-widest uppercase mb-2 block">Heading 2 / 4xl-5xl</span>
              <H2 className="font-['Inter',sans-serif]">Industrial Strength</H2>
            </div>
            <div className="h-px w-full bg-white/5" />
            <div>
              <span className="text-primary text-sm font-bold tracking-widest uppercase mb-2 block">Heading 3 / 2xl-3xl</span>
              <H3 className="font-['Inter',sans-serif]">Refined Sections</H3>
            </div>
            <div className="h-px w-full bg-white/5" />
            <div>
              <span className="text-primary text-sm font-bold tracking-widest uppercase mb-2 block">Body Text / Base-Lg</span>
              <Text className="max-w-3xl">
                Clean spacing and large typography provide a premium reading experience. The text is designed to be highly legible on dark backgrounds, utilizing muted foregrounds to reduce eye strain while maintaining contrast.
              </Text>
            </div>
          </div>
        </section>

        {/* Buttons */}
        <section>
          <H2 className="mb-8 premium-border pb-4 inline-block font-['Inter',sans-serif]">Interactive Elements</H2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <H3 className="text-xl font-['Inter',sans-serif]">Button Variants</H3>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary">Primary Action</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="glass">Glass Button</Button>
              </div>
            </div>
            <div className="space-y-8">
              <H3 className="text-xl font-['Inter',sans-serif]">Button Sizes & States</H3>
              <div className="flex flex-wrap items-center gap-4">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large Hero</Button>
                <Button isLoading>Loading</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Cards */}
        <section>
          <H2 className="mb-8 premium-border pb-4 inline-block font-['Inter',sans-serif]">Data Presentation</H2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-6 border border-primary/50 relative overflow-hidden group-hover:scale-110 transition-transform">
                <div className="w-6 h-6 bg-primary rounded-full glow-red" />
              </div>
              <H3 className="text-xl mb-3 font-['Inter',sans-serif]">Premium Quality</H3>
              <Text className="text-sm">
                Industry-leading fuel standards matching global petroleum giants.
              </Text>
            </Card>
            
            <Card>
              <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center mb-6 border border-secondary/50 relative overflow-hidden group-hover:scale-110 transition-transform">
                <div className="w-6 h-6 bg-secondary rounded-full" />
              </div>
              <H3 className="text-xl mb-3 font-['Inter',sans-serif]">Fast Service</H3>
              <Text className="text-sm">
                Optimized workflows to get you back on the road in record time.
              </Text>
            </Card>

            <Card className="border-primary/30">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full -z-10 transition-transform group-hover:scale-110" />
              <H3 className="text-xl mb-3 text-primary font-['Inter',sans-serif]">Highlighted Card</H3>
              <Text className="text-sm mb-6">
                Special styling for featured services or important announcements.
              </Text>
              <Button variant="outline" size="sm" className="w-full">Read More</Button>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}
