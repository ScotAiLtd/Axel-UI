"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { AzureAdButton } from "./AzureAdButton"

interface AuthFormProps {
  className?: string
}

/**
 * Authentication form component
 * 
 * This component renders the authentication form with
 * Azure AD sign-in option and additional controls.
 */
export function AuthForm({ className = "" }: AuthFormProps) {
  const [rememberMe, setRememberMe] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className={`space-y-5 ${className}`}
    >
      {/* Azure AD Sign In Button */}
      <div className="space-y-4">
        <AzureAdButton />
        
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="remember-me"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-[#0078D4] focus:ring-[#0078D4] cursor-pointer"
            />
            <label htmlFor="remember-me" className="text-xs text-gray-600 cursor-pointer">
              Remember me
            </label>
          </div>
          <button className="text-xs text-[#0078D4] hover:underline focus:outline-none transition-colors">
            Forgot password?
          </button>
        </div>
      </div>
    </motion.div>
  )
}
