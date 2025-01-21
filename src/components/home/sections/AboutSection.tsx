"use client"

import { Container } from "@/components/ui/Container"
import { Wind, Shield, Zap } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

const benefits = [
  {
    title: "Wind Industry Expertise",
    description: "Deep understanding of wind turbine systems and industry requirements",
    icon: Wind,
  },
  {
    title: "Compliance Focused",
    description: "Ensuring adherence to all relevant standards and regulations",
    icon: Shield,
  },
  {
    title: "Efficiency Driven",
    description: "Streamlining processes to save time and reduce errors",
    icon: Zap,
  },
]

export function AboutSection() {
  return (
    <section id="about">
      <Container className="py-24 bg-muted/50">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold">About Aurai Wind</h2>
            <p className="text-muted-foreground text-lg">
              We're revolutionizing wind turbine documentation management through 
              advanced AI technology and deep industry expertise. Our platform helps 
              wind energy professionals work more efficiently while maintaining the 
              highest standards of compliance and safety.
            </p>
            <div className="space-y-6">
              {benefits.map((benefit) => (
                <motion.div 
                  key={benefit.title} 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex gap-4"
                >
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "#8ec2b3" }}
                  >
                    <benefit.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#8ec2b3]/20 via-transparent to-[#8ec2b3]/10 rounded-2xl" />
              <div className="absolute -inset-1 bg-gradient-to-br from-[#8ec2b3]/20 via-transparent to-[#8ec2b3]/10 blur-2xl opacity-50" />
              
              <div className="relative w-full h-full rounded-2xl overflow-hidden border border-[#8ec2b3]/20">
                <Image
                  src="/windfarm.webp"
                  alt="Wind Farm"
                  fill
                  className="object-cover"
                />
                
                <div className="absolute top-4 left-4 w-24 h-24 bg-[#8ec2b3]/10 rounded-full blur-xl animate-pulse" />
                <div className="absolute bottom-4 right-4 w-32 h-32 bg-[#8ec2b3]/15 rounded-full blur-2xl animate-pulse delay-500" />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  )
} 