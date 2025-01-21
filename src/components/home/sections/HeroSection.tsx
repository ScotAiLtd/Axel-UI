"use client"

import { Container } from "@/components/ui/Container"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { motion } from "framer-motion"

export function HeroSection() {
  return (
    <Container className="pt-24 md:pt-32">
      <div className="flex flex-col lg:flex-row items-center gap-12">
       
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 text-center lg:text-left"
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            AI-Powered Wind Turbine Documentations
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
            Streamline your wind turbine documentation process with advanced AI. 
            Automate reviews, ensure compliance, and reduce risks.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button 
              size="lg" 
              style={{ backgroundColor: "#8ec2b3" }}
              className="hover:scale-105 transition-transform"
            >
              Get Started
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="hover:scale-105 transition-transform"
            >
              Book a Demo
            </Button>
          </div>
        </motion.div>

       
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex-1 relative"
        >
          <div className="relative w-full aspect-square max-w-[600px] mx-auto">
        
            <div className="absolute inset-0 bg-gradient-to-r from-[#8ec2b3]/20 to-transparent rounded-3xl" />
            <div className="absolute -inset-1 bg-gradient-to-r from-[#8ec2b3]/20 to-transparent blur-2xl opacity-50" />
            
   
            <div className="relative w-full h-full rounded-3xl overflow-hidden border border-[#8ec2b3]/20">
              <Image
                src="/windmill2.webp"
                alt="Wind Turbine"
                fill
                className="object-cover"
                priority
              />
              
          
              <div className="absolute top-4 right-4 w-20 h-20 bg-[#8ec2b3]/10 rounded-full blur-xl animate-pulse" />
              <div className="absolute bottom-8 left-8 w-16 h-16 bg-[#8ec2b3]/20 rounded-full blur-lg animate-pulse delay-700" />
            </div>
          </div>
        </motion.div>
      </div>
    </Container>
  )
} 