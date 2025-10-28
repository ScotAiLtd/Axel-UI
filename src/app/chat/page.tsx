"use client"

import { useEffect, useState } from "react"
import ChatInterface from "@/components/chat/ChatInterface"
import DocumentViewer from "@/components/chat/DocumentViewer"

export default function ChatPage() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <div className="flex flex-col md:flex-row w-full overflow-hidden h-screen" style={{ height: '100dvh' }} id="chat-container">
      <div className="hidden md:block md:w-[65%] md:h-full md:border-r border-border overflow-auto">
        <DocumentViewer />
      </div>

      {/* Chat takes full screen on mobile, 35% width on desktop */}
      <div className="w-full md:w-[35%] h-full flex-shrink-0 overflow-hidden">
        <ChatInterface />
      </div>
    </div>
  )
}
//test
