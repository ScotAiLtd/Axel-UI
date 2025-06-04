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
 * Clean, minimal Azure AD authentication interface.
 */
export function AuthForm({ className = "" }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleAuthStart = () => {
    setIsLoading(true)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className={`space-y-4 ${className}`}
    >
      {/* Azure AD Authentication */}
      <div className="space-y-4">
        <AzureAdButton 
          onAuthStart={handleAuthStart}
          isLoading={isLoading}
        />
        
        {/* Authentication Status */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="bg-blue-50 border border-blue-100 rounded-lg p-3"
          >
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-gray-700">
                Redirecting to Microsoft...
              </span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Minimal Help Text */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          Need help? Contact your IT administrator
        </p>
      </div>
    </motion.div>
  )
}
