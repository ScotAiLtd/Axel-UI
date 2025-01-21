"use client"

import { motion } from "framer-motion"

export function ThemedBackground() {
  return (
    <>
     
      <div className="absolute inset-0">
        <svg className="w-full h-full opacity-[0.04]">
          <defs>
            <pattern id="technical-pattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
              <circle cx="100" cy="100" r="2" fill="#8ec2b3" />
              <circle cx="100" cy="100" r="40" stroke="#8ec2b3" strokeWidth="0.5" fill="none" />
              <line x1="100" y1="60" x2="100" y2="140" stroke="#8ec2b3" strokeWidth="0.5" />
              <line x1="60" y1="100" x2="140" y2="100" stroke="#8ec2b3" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#technical-pattern)" />
        </svg>
      </div>

    
      <div className="absolute inset-0 overflow-hidden">
      
        <div className="absolute right-[10%] top-[20%] w-[300px] opacity-[0.06]">
          <svg viewBox="0 0 100 160" className="w-full">
       
            <path
              d="M45 160 L55 160 L52 60 L48 60 Z"
              fill="#8ec2b3"
            />
            
            <circle cx="50" cy="60" r="5" fill="#8ec2b3" />
            
        
            <g>
          
              <motion.path 
                d="M50 60 L47 25 L53 25 Z"
                fill="#8ec2b3"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                style={{ originX: "50px", originY: "60px" }}
              />
       
              <motion.path 
                d="M50 60 L47 25 L53 25 Z"
                fill="#8ec2b3"
                initial={{ rotate: 120 }}
                animate={{ rotate: 480 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                style={{ originX: "50px", originY: "60px" }}
              />
          
              <motion.path 
                d="M50 60 L47 25 L53 25 Z"
                fill="#8ec2b3"
                initial={{ rotate: 240 }}
                animate={{ rotate: 600 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                style={{ originX: "50px", originY: "60px" }}
              />
            </g>
          </svg>
        </div>

 
        <div className="absolute left-[5%] top-[40%] w-[200px] opacity-[0.04]">
          <svg viewBox="0 0 100 160" className="w-full">
          
            <path
              d="M45 160 L55 160 L52 60 L48 60 Z"
              fill="#8ec2b3"
            />
            
          
            <circle cx="50" cy="60" r="5" fill="#8ec2b3" />
            
       
            <g>
         
              <motion.path 
                d="M50 60 L47 25 L53 25 Z"
                fill="#8ec2b3"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                style={{ originX: "50px", originY: "60px" }}
              />
           
              <motion.path 
                d="M50 60 L47 25 L53 25 Z"
                fill="#8ec2b3"
                initial={{ rotate: 120 }}
                animate={{ rotate: 480 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                style={{ originX: "50px", originY: "60px" }}
              />
         
              <motion.path 
                d="M50 60 L47 25 L53 25 Z"
                fill="#8ec2b3"
                initial={{ rotate: 240 }}
                animate={{ rotate: 600 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                style={{ originX: "50px", originY: "60px" }}
              />
            </g>
          </svg>
        </div>
      </div>


      <div className="absolute inset-0">
        <svg className="w-full h-full opacity-[0.04]">
          <defs>
            <pattern id="flow-pattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
              <motion.path
                d="M0 100 Q 50 50, 100 100 T 200 100"
                fill="none"
                stroke="#8ec2b3"
                strokeWidth="2"
                initial={{ strokeDasharray: 200, strokeDashoffset: 200 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
              <motion.path
                d="M0 150 Q 50 100, 100 150 T 200 150"
                fill="none"
                stroke="#8ec2b3"
                strokeWidth="2"
                initial={{ strokeDasharray: 200, strokeDashoffset: 200 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 2, delay: 1, repeat: Infinity, ease: "linear" }}
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#flow-pattern)" />
        </svg>
      </div>

     
      <div className="absolute inset-0 opacity-[0.04]">
        <div className="absolute top-[10%] left-[5%] w-[200px] border-t border-dashed border-[#8ec2b3]">
          <div className="text-[#8ec2b3] text-sm mt-1">150mm</div>
        </div>
        <div className="absolute top-[30%] right-[10%] h-[160px] border-l border-dashed border-[#8ec2b3]">
          <div className="text-[#8ec2b3] text-sm ml-2">200mm</div>
        </div>
        <div className="absolute bottom-[20%] left-[15%] w-[120px] border-t border-dashed border-[#8ec2b3]">
          <div className="text-[#8ec2b3] text-sm mt-1">100mm</div>
        </div>
      </div>
    </>
  )
} 