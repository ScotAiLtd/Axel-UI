"use client"

import * as React from "react"
import { Container } from "@/components/ui/Container"
import { motion } from "framer-motion"
import { AuthForm } from "@/components/auth/AuthForm"

const PRIMARY_COLOR = "#0A2463" 
const SECONDARY_COLOR = "#3E92CC" 
const ACCENT_COLOR = "#2E5EAA" 
const CARD_BG = "bg-white" 
const CARD_BORDER = "border border-gray-100"
const SHADOW = "shadow-lg"
const TITLE_COLOR = "text-[#0A2463]" 
const SUBTITLE_COLOR = "text-[#3E92CC]" 
const MUTED_TEXT = "text-gray-600" 

/**
 * Home Page Component
 * 
 * Serves as the landing page and authentication entry point for the application.
 * Displays the authentication form with Azure AD sign-in option.
 */
export default function HomePage() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-white">
      <div 
        className="absolute inset-0" 
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(240, 240, 250, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(240, 240, 250, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
          backgroundPosition: 'center top',
          backgroundRepeat: 'repeat',
          maskImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.15) 0%, rgba(0, 0, 0, 0) 30%)'
        }}
      ></div>
      <Container className="relative z-10">
        <div className="min-h-screen flex items-center justify-center py-12">
          <div className="w-full max-w-md relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className={`relative rounded-lg overflow-hidden ${CARD_BG} ${SHADOW} ${CARD_BORDER}`}
            >
              <div className="h-2 bg-gradient-to-r from-[#0A2463] to-[#3E92CC]" />

              <div className="relative px-8 py-10">
                <div className="relative space-y-6">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col items-center"
                  >
                    <div className="mb-3 w-40 h-40 relative">
                      <img 
                        src="/Ask_Axle_256x256.png" 
                        alt="Axle Logo" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    
                    <span className={`text-2xl font-bold mt-1 ${SUBTITLE_COLOR}`}>
                      People Management Toolkit
                    </span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="text-center space-y-2"
                  >
                    <h2 className="text-xl font-semibold tracking-tight text-gray-800">
                      Welcome to EWMG HR Portal
                    </h2>
                    <p className={`${MUTED_TEXT} text-sm`}>
                      Sign in with your company credentials to access HR resources
                    </p>
                  </motion.div>

                  <AuthForm />
                </div>
              </div>
            </motion.div>

            <div className="absolute -bottom-px left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#3E92CC]/20 to-transparent" />
          </div>
        </div>
      </Container>
    </main>
  )
}
