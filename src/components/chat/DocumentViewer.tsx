"use client"

import { useState } from "react"
import { Expand, RefreshCw } from "lucide-react"

export default function DocumentViewer() {
  const [isFullscreen, setIsFullscreen] = useState(false)

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
    document.body.classList.toggle('document-fullscreen')
  }

  const refreshDocument = () => {
    const iframe = document.getElementById("document-viewer") as HTMLIFrameElement
    if (iframe && iframe.src) {
      iframe.src = iframe.src
    }
  }

  return (
    <div className={`document-panel flex flex-col ${isFullscreen ? "w-full" : ""}`}>
      <div className="panel-header flex justify-between items-center p-4 bg-white border-b border-border z-10">
        <h2 className="text-lg font-semibold text-primary truncate md:text-lg">Eastern Western Motor Group - People Management Toolkit</h2>
        <div className="header-controls flex gap-2">
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
        <iframe 
          id="document-viewer" 
          src="https://easternholdings.pagetiger.com/your-people-management-toolkit/1/?ptit=57928447FFC730AC383CF"
          className="w-full h-full border-none"
          allowFullScreen
        />
      </div>
    </div>
  )
}
