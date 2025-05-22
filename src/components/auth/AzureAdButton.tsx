"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface AzureAdButtonProps {
  className?: string
}

/**
 * Azure AD authentication button component
 * 
 * This component renders a styled button for Azure AD authentication
 * following Microsoft's design guidelines with a professional appearance.
 */
export function AzureAdButton({ 
  className = ""
}: AzureAdButtonProps) {
  const router = useRouter()

  const handleSignIn = () => {
    // Redirect to the chat page when clicked
    router.push("/chat")
  }

  return (
    <Button
      onClick={handleSignIn}
      className={`w-full relative group transition-all duration-200 ease-out bg-[#0078D4] hover:bg-[#106EBE] text-white ${className}`}
      size="lg"
      style={{ 
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)"
      }}
    >
      <div className="relative flex items-center justify-center gap-3">
        <svg className="w-5 h-5" viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M1 1h10v10H1V1zm11 0h10v10H12V1zM1 12h10v10H1V12zm11 0h10v10H12V12z"/>
        </svg>
        <span className="text-sm font-medium">
          Sign in with Microsoft
        </span>
      </div>
    </Button>
  )
}
