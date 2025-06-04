"use client"

import { Container } from "@/components/ui/Container"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { AlertCircle, ArrowLeft, RefreshCw, Shield } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

const ERROR_MESSAGES = {
  Configuration: "There's an issue with the authentication configuration. Please contact your IT administrator.",
  AccessDenied: "Access denied. You don't have permission to access this application.",
  Verification: "Unable to verify your account. Please try signing in again.",
  Default: "An unexpected error occurred during sign-in. Please try again."
}

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error') || 'Default'
  const errorMessage = ERROR_MESSAGES[error as keyof typeof ERROR_MESSAGES] || ERROR_MESSAGES.Default

  return (
    <main className="min-h-screen relative overflow-hidden bg-white">
      {/* Background Pattern */}
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
      />

      <Container className="relative z-10">
        <div className="min-h-screen flex items-center justify-center py-12">
          <div className="w-full max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative rounded-lg overflow-hidden bg-white shadow-lg border border-gray-100"
            >
              {/* Error indicator */}
              <div className="h-2 bg-gradient-to-r from-red-500 to-orange-500" />

              <div className="relative px-8 py-10">
                <div className="space-y-6">
                  {/* Error Icon and Title */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col items-center text-center"
                  >
                    <div className="mb-4 w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
                      <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      Authentication Error
                    </h1>
                    <p className="text-sm text-gray-600 max-w-sm">
                      {errorMessage}
                    </p>
                  </motion.div>

                  {/* Error Details */}
                  {error !== 'Default' && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                      className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-start space-x-3">
                        <Shield className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 mb-1">
                            Error Code: {error}
                          </h3>
                          <p className="text-xs text-gray-600 leading-relaxed">
                            This error code can help your IT administrator diagnose the issue.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Action Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="space-y-3"
                  >
                    <Link href="/" className="block">
                      <Button className="w-full bg-[#0078D4] hover:bg-[#106EBE] text-white">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Try Again
                      </Button>
                    </Link>
                    
                    <Link href="/" className="block">
                      <Button variant="outline" className="w-full">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                      </Button>
                    </Link>
                  </motion.div>

                  {/* Help Information */}
                  <div className="border-t border-gray-100 pt-4">
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                      <div className="flex items-start space-x-2">
                        <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="space-y-1">
                          <p className="text-xs text-blue-800 font-medium">
                            Need additional help?
                          </p>
                          <div className="space-y-1 text-xs text-blue-700">
                            <p>• Contact your IT administrator</p>
                            <p>• Visit the Microsoft Security Center</p>
                            <p>• Check your network connection</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </Container>
    </main>
  )
}

/**
 * Authentication Error Page
 * 
 * Displays detailed error information when Azure AD authentication fails
 * with user-friendly messages and actionable next steps.
 */
export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  )
} 