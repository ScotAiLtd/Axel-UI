"use client"

import { motion } from "framer-motion"

export function GradientEffects() {
  return (
    <>
  
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute top-[-10%] left-1/2 -translate-x-1/2 h-[500px] w-[800px] bg-gradient-to-r from-[#D29653] to-[#603BDA] opacity-[0.07] blur-[150px] rounded-full"
      />
      
     
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.2 }}
        className="absolute right-[-20%] top-[20%] h-[300px] w-[300px] bg-[#D29653] opacity-[0.05] blur-[90px] rounded-full"
      />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="absolute left-[-10%] top-[40%] h-[250px] w-[250px] bg-[#603BDA] opacity-[0.04] blur-[80px] rounded-full"
      />
      
  
      <div 
        className="absolute inset-0 bottom-[400px] opacity-[0.008] mix-blend-soft-light"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
      
    
      <div className="absolute inset-0 bottom-[400px] bg-gradient-to-b from-transparent via-background/40 to-transparent pointer-events-none opacity-50" />
    </>
  )
} 