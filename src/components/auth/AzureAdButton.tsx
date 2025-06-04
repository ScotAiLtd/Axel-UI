"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface AzureAdButtonProps {
  className?: string
  onAuthStart?: () => void
  isLoading?: boolean
  disabled?: boolean
}

/**
 * Azure AD authentication button component
 * 
 * Professional Microsoft Azure AD sign-in button following Microsoft's
 * design guidelines with proper loading states and accessibility features.
 */
export function AzureAdButton({ 
  className = "",
  onAuthStart,
  isLoading = false,
  disabled = false
}: AzureAdButtonProps) {
  const router = useRouter()
  const [isHovered, setIsHovered] = useState(false)

  const handleSignIn = async () => {
    if (disabled || isLoading) return
    
    // Notify parent component that authentication is starting
    onAuthStart?.()
    
    // Simulate Azure AD redirect delay for better UX
    setTimeout(() => {
      // In real implementation, this would redirect to Azure AD
      router.push("/chat")
    }, 1500)
  }

  return (
    <Button
      onClick={handleSignIn}
      disabled={disabled || isLoading}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        w-full relative group transition-all duration-200 ease-out
        ${isLoading || disabled 
          ? 'bg-gray-400 cursor-not-allowed' 
          : 'bg-[#0078D4] hover:bg-[#106EBE] active:bg-[#0F4C81]'
        }
        text-white border-0 focus:ring-2 focus:ring-[#0078D4] focus:ring-offset-2
        ${className}
      `}
      size="lg"
      style={{ 
        boxShadow: isLoading || disabled 
          ? "0 1px 2px rgba(0, 0, 0, 0.05)" 
          : "0 2px 4px rgba(0, 120, 212, 0.15)"
      }}
      aria-label="Sign in with Microsoft Azure AD"
    >
      <div className="relative flex items-center justify-center gap-3">
        {isLoading ? (
          <>
            {/* Loading Spinner */}
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span className="text-sm font-medium">
              Signing in...
            </span>
          </>
        ) : (
          <>
            {/* Microsoft Logo */}
            <svg 
              className="w-5 h-5 transition-transform duration-200"
              style={{
                transform: isHovered ? 'scale(1.05)' : 'scale(1)'
              }}
              viewBox="0 0 23 23" 
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-hidden="true"
            >
              <path 
                fill="currentColor" 
                d="M1 1h10v10H1V1zm11 0h10v10H12V1zM1 12h10v10H1V12zm11 0h10v10H12V12z"
              />
            </svg>
            <span className="text-sm font-medium">
              Sign in with Microsoft
            </span>
          </>
        )}
      </div>
      
      {/* Subtle gradient overlay on hover */}
      {!isLoading && !disabled && (
        <div 
          className={`
            absolute inset-0 rounded-md transition-opacity duration-200
            bg-gradient-to-r from-white/0 via-white/5 to-white/0
            ${isHovered ? 'opacity-100' : 'opacity-0'}
          `}
        />
      )}
    </Button>
  )
}
