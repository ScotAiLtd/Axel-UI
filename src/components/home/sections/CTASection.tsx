"use client"

import { Container } from "@/components/ui/Container"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export function CTASection() {
  return (
    <Container className="py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative isolate overflow-hidden"
      >
       
        <div className="relative rounded-2xl overflow-hidden">

          <div 
            className="absolute inset-0 bg-background/30 backdrop-blur-xl"
            style={{
              background: `
                linear-gradient(
                  135deg,
                  rgba(142, 194, 179, 0.1),
                  rgba(142, 194, 179, 0.05)
                )
              `
            }}
          />
      
          <div className="absolute inset-[1px] rounded-2xl bg-gradient-to-br from-[#8ec2b3]/20 via-transparent to-transparent" />

          
          <div className="relative px-8 py-12 md:p-12">
         
            <div className="absolute top-0 right-0 -mt-10 -mr-10 h-[300px] w-[300px] rounded-full bg-[#8ec2b3] opacity-[0.08] blur-[64px]" />
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-[200px] w-[200px] rounded-full bg-[#8ec2b3] opacity-[0.04] blur-[64px]" />

            <div className="relative z-10 max-w-2xl mx-auto text-center">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-3xl md:text-4xl font-bold mb-4"
              >
                Ready to Transform Your Documentation Process?
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-lg text-muted-foreground mb-8"
              >
                Join leading wind energy companies in streamlining their documentation
                workflow with AI-powered solutions.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Button
                  size="lg"
                  style={{ backgroundColor: "#8ec2b3" }}
                  className="hover:scale-105 transition-transform relative group"
                >
                  <span className="relative z-10">Get Started Now</span>
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-md" />
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  className="hover:scale-105 transition-transform border-[#8ec2b3]/30 hover:bg-[#8ec2b3]/10"
                >
                  Schedule a Demo
                </Button>
              </motion.div>
            </div>
          </div>
        </div>

     
        <div className="absolute -top-px left-20 right-11 h-[1px] bg-gradient-to-r from-transparent via-[#8ec2b3]/30 to-transparent" />
        <div className="absolute -bottom-px left-11 right-20 h-[1px] bg-gradient-to-r from-transparent via-[#8ec2b3]/30 to-transparent" />
      </motion.div>
    </Container>
  )
} 