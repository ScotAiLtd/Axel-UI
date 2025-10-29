"use client"

import { useState, useEffect } from "react"
import { Expand, RefreshCw, Loader2 } from "lucide-react"
import Image from "next/image"

export default function DocumentViewer() {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [documentUrl, setDocumentUrl] = useState<string>("")
  const [documentTitle, setDocumentTitle] = useState<string>("Eastern Western Motor Group - People Management Toolkit")
  const [isLoading, setIsLoading] = useState(true)

  // Fetch user profile to determine which document to show
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/user/profile')

        if (response.ok) {
          const data = await response.json()
          const azureAdGroup = data.user.azureAdGroup

          // Determine document URL and title based on Azure AD group
          if (azureAdGroup === 'ScotAIUsers') {
            // Show Policy Guide for ScotAIUsers
            setDocumentUrl('https://easternholdings.pagetiger.com/policy-guide/december-2023')
            setDocumentTitle('Eastern Western Motor Group - Policy Guide')
          } else {
            // Show People Management Toolkit for ScotAIManagers or null
            setDocumentUrl('https://easternholdings.pagetiger.com/your-people-management-toolkit/1/?ptit=57928447FFC730AC383CF')
            setDocumentTitle('Eastern Western Motor Group - People Management Toolkit')
          }
        } else {
          // Default to People Management Toolkit if profile fetch fails
          setDocumentUrl('https://easternholdings.pagetiger.com/your-people-management-toolkit/1/?ptit=57928447FFC730AC383CF')
          setDocumentTitle('Eastern Western Motor Group - People Management Toolkit')
        }
      } catch (error) {
        console.error('Error fetching user profile:', error)
        // Default to People Management Toolkit on error
        setDocumentUrl('https://easternholdings.pagetiger.com/your-people-management-toolkit/1/?ptit=57928447FFC730AC383CF')
        setDocumentTitle('Eastern Western Motor Group - People Management Toolkit')
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserProfile()
  }, [])

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
    document.body.classList.toggle('document-fullscreen')
  }

  const refreshDocument = () => {
    const object = document.getElementById("document-viewer") as HTMLObjectElement
    if (object && object.data) {
      object.data = object.data
    }
  }

  return (
    <div className={`document-panel flex flex-col h-full w-full ${isFullscreen ? "fixed inset-0 z-50" : ""}`}>
      <div className="panel-header flex justify-between items-center px-2 py-0 sm:px-4 bg-white border-b border-border z-10">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <Image
            src="/logo.png"
            alt="Eastern Western Motor Group Logo"
            width={120}
            height={120}
            className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 object-contain flex-shrink-0"
          />
          <h2 className="text-sm sm:text-base md:text-lg font-semibold text-primary truncate">{documentTitle}</h2>
        </div>
        <div className="header-controls flex gap-2 flex-shrink-0">
          <button
            onClick={refreshDocument}
            className="bg-transparent border-none text-muted-foreground hover:bg-secondary hover:text-primary p-2 rounded transition-all"
            title="Refresh document"
          >
            <RefreshCw size={18} />
          </button>
          <button
            onClick={toggleFullscreen}
            className="bg-transparent border-none text-muted-foreground hover:bg-secondary hover:text-primary p-2 rounded transition-all"
            title="Toggle fullscreen"
          >
            <Expand size={18} />
          </button>
        </div>
      </div>
      <div className="document-content flex-1 overflow-hidden bg-white">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 size={24} className="animate-spin" />
              <span>Loading document...</span>
            </div>
          </div>
        ) : (
          <object
            id="document-viewer"
            data={documentUrl}
            className="w-full h-full border-none"
            type="text/html"
          >
            <p>
              Please login to view the document.{" "}
              <a
                href={documentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Login here
              </a>
            </p>
          </object>
        )}
      </div>
    </div>
  )
}
