"use client"

import { motion } from "framer-motion"

export function ThemedBackground() {
  return (
    <>
      {/* Geometric pattern background */}
      <div className="absolute inset-0">
        <svg className="w-full h-full opacity-[0.04]">
          <defs>
            <pattern id="geometric-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="1.5" fill="#603BDA" />
              <circle cx="25" cy="25" r="1.5" fill="#D29653" />
              <circle cx="75" cy="75" r="1.5" fill="#D29653" />
              <circle cx="50" cy="50" r="25" stroke="#603BDA" strokeWidth="0.5" fill="none" />
              <rect x="40" y="40" width="20" height="20" stroke="#D29653" strokeWidth="0.5" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#geometric-pattern)" />
        </svg>
      </div>

      {/* Animated wave patterns */}
      <div className="absolute inset-0">
        <svg className="w-full h-full opacity-[0.03]">
          <defs>
            <pattern id="wave-pattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
              <motion.path
                d="M0 80 Q 40 40, 80 80 T 160 80 T 240 80"
                fill="none"
                stroke="#D29653"
                strokeWidth="1.5"
                initial={{ strokeDasharray: 240, strokeDashoffset: 240 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              <motion.path
                d="M0 120 Q 40 160, 80 120 T 160 120 T 240 120"
                fill="none"
                stroke="#603BDA"
                strokeWidth="1.5"
                initial={{ strokeDasharray: 240, strokeDashoffset: 240 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 3, delay: 1.5, repeat: Infinity, ease: "linear" }}
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#wave-pattern)" />
        </svg>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-2 h-2 rounded-full bg-[#D29653]/30"
          initial={{ x: '10%', y: '20%', opacity: 0 }}
          animate={{ x: '15%', y: '25%', opacity: 0.5 }}
          transition={{ duration: 8, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-3 h-3 rounded-full bg-[#603BDA]/20"
          initial={{ x: '80%', y: '50%', opacity: 0 }}
          animate={{ x: '75%', y: '45%', opacity: 0.4 }}
          transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-4 h-4 rounded-full bg-[#D29653]/15"
          initial={{ x: '30%', y: '70%', opacity: 0 }}
          animate={{ x: '35%', y: '65%', opacity: 0.3 }}
          transition={{ duration: 12, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
        />
      </div>

      {/* Subtle grid lines */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute top-[15%] left-[10%] w-[150px] border-t border-dashed border-[#D29653]" />
        <div className="absolute top-[40%] right-[15%] h-[120px] border-l border-dashed border-[#603BDA]" />
        <div className="absolute bottom-[25%] left-[20%] w-[100px] border-t border-dashed border-[#D29653]" />
      </div>

      {/* Noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.01] mix-blend-soft-light"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </>
  )
} 