"use client";

export const dynamic = 'force-dynamic'

import { useEffect, useState } from "react";
import { HeroSection } from "@/components/home/sections/HeroSection"
import { FeaturesSection } from "@/components/home/sections/FeaturesSection"
import { HowItWorksSection } from "@/components/home/sections/HowItWorksSection"
import { AboutSection } from "@/components/home/sections/AboutSection"
import { CTASection } from "@/components/home/sections/CTASection"
import { GradientEffects } from "@/components/ui/GradientEffects"
import { ThemedBackground } from "@/components/ui/ThemedBackground"

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <main className="flex min-h-screen flex-col relative overflow-hidden">
      
      <GradientEffects />
      <ThemedBackground />
      
      <div className="relative z-10">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <AboutSection />
        <CTASection />
      </div>
    </main>
  )
} 